'use strict';

loadCantonPatterns().then((cantonPatterns) => {
  const map = initializeMap();

  const backgroundMap = swisstopoGrayMap();
  map.addLayer(backgroundMap);

  const overlay = cantonalBoundaries(cantonPatterns);
  map.addLayer(overlay);

  mouseMoveRevealCircle(map, overlay);
});

function loadCantonPatterns() {
  const cantons = { 'Aargau': 'AG', 'Appenzell Innerrhoden': 'AI', 'Appenzell Ausserrhoden': 'AR', 'Bern': 'BE', 'Basel-Landschaft': 'BL', 'Basel-Stadt': 'BS', 'Fribourg': 'FR', 'Genève': 'GE', 'Glarus': 'GL', 'Graubünden': 'GR', 'Jura': 'JU', 'Luzern': 'LU', 'Neuchâtel': 'NE', 'Nidwalden': 'NW', 'Obwalden': 'OW', 'St. Gallen': 'SG', 'Schaffhausen': 'SH', 'Solothurn': 'SO', 'Schwyz': 'SZ', 'Thurgau': 'TG', 'Ticino': 'TI', 'Uri': 'UR', 'Vaud': 'VD', 'Valais': 'VS', 'Zug': 'ZG', 'Zürich': 'ZH' };
  const loadRequests = Object.entries(cantons).map(([name, id]) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        cantons[name] = createPatterns(image, [0, 1, 2]);
        resolve();
      };
      image.crossOrigin = 'anonymous';
      image.src = `https://unpkg.com/ch-canton-symbols@1.3.1/symbols/13x13/${id.toLowerCase()}.svg`;
    });
  });
  return Promise.all(loadRequests).then(() => cantons);
}

function createPatterns(image, scales) {
  return scales.map((scale) => {
    const factor = Math.pow(2, scale) * window.devicePixelRatio;
    const size = 16 * factor;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, size, size);
    const { width, height } = image;
    context.drawImage(image, 0, 0, width * factor, height * factor);
    const patternContext = document.createElement('canvas').getContext('2d');
    return patternContext.createPattern(canvas, 'repeat');
  });
}

function initializeMap() {
  const element = document.createElement('div');
  document.body.appendChild(element);

  const map = L.map(element, { crs: L.CRS.EPSG2056 });

  map.fitSwitzerland();

  return map;
}

function swisstopoGrayMap() {
  return L.tileLayer.swiss({ layer: 'ch.swisstopo.pixelkarte-grau' });
}

function cantonalBoundaries(cantonPatterns) {
  return L.vectorGrid.protobuf('cantonal-boundaries/{z}/{x}/{y}.pbf', {
    attribution: `
      <a href="https://github.com/nzzdev/ch-canton-symbols">NZZ Storytelling</a>
      (<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>),
      <a href="https://github.com/rkaravia/map-with-flags">Code on GitHub</a>
    `,
    maxNativeZoom: 20,
    rendererFactory: hiDpiPolygonRenderer,
    vectorTileLayerStyles: {
      swissboundaries3d_1_3_tlm_kantonsgebiet(properties, zoom) {
        let patternSize = 0;
        let weight = 1;
        if (zoom > 20) {
          patternSize = 2;
          weight = 5;
        } else if (zoom > 15) {
          patternSize = 1;
          weight = 2;
        }
        return {
          color: '#000',
          fill: true,
          fillColor: cantonPatterns[properties.name][patternSize],
          fillOpacity: 1,
          weight: weight * window.devicePixelRatio,
        };
      },
    },
  });
}

function hiDpiPolygonRenderer(...args) {
  const Renderer = L.Canvas.Tile.extend({
    initialize(tileCoord, tileSize, options) {
      L.Canvas.Tile.prototype.initialize.call(this, tileCoord, tileSize.multiplyBy(window.devicePixelRatio), options);
    },

    _updatePoly(layer, closed) {
      if (!this._drawing) { return; }

      var i, j, len2, p,
          parts = layer._parts,
          len = parts.length,
          ctx = this._ctx;

      if (!len) { return; }

      ctx.beginPath();

      for (i = 0; i < len; i++) {
        for (j = 0, len2 = parts[i].length; j < len2; j++) {
          p = parts[i][j];
          ctx[j ? 'lineTo' : 'moveTo'](p.x * window.devicePixelRatio, p.y * window.devicePixelRatio);
        }
        if (closed) {
          ctx.closePath();
        }
      }

      this._fillStroke(ctx, layer);
    },
  });

  return new Renderer(...args);
}

function mouseMoveRevealCircle(map, gridLayer) {
  const tileSize = gridLayer.getTileSize();
  const radius = 128;
  const maskSize = 2 * (tileSize.x + radius);
  const maskCenter = L.point(maskSize, maskSize).divideBy(2);
  const mask = createMask(maskSize, radius);
  map.on('mousemove', (event) => {
    const origin = map.getPixelOrigin();
    const { layerPoint } = event;
    const scale = map.getZoomScale(map.getZoom(), gridLayer._level.zoom);
    Object.values(gridLayer._tiles).forEach((tile) => {
      const { style } = tile.el;
      const tilePosition = tile.coords.scaleBy(tileSize).multiplyBy(scale).subtract(origin);
      const offset = layerPoint.subtract(tilePosition).divideBy(scale);
      if (-radius < offset.x && offset.x < tileSize.x + radius &&
          -radius < offset.y && offset.y < tileSize.y + radius) {
        const maskPosition = offset.subtract(maskCenter);
        style['-webkit-mask-image'] = `url(${mask})`;
        style['-webkit-mask-position'] = `${maskPosition.x}px ${maskPosition.y}px`;
      }
      else {
        style['-webkit-mask-image'] = '';
      }
    });
  });
}

function createMask(size, radius) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d');

  const center = size / 2;
  var gradient = context.createRadialGradient(center, center, 0, center, center, radius);

  gradient.addColorStop(.9, 'rgb(0, 0, 0, 0)');
  gradient.addColorStop(.95, '#000');

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return canvas.toDataURL();
}
