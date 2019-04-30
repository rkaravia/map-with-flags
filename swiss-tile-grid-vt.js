'use strict';

loadCantonPatterns().then((cantonPatterns) => {
  const projection = lv95();
  const tileGrid = swissTileGrid();

  const map = initializeMap(projection, tileGrid);

  const backgroundMap = swisstopoGrayMap(projection, tileGrid);
  map.addLayer(backgroundMap);

  const overlay = cantonalBoundaries(projection, tileGrid);
  setOverlayStyle(map, overlay, cantonPatterns);
  map.addLayer(overlay);
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

function lv95() {
  const { project, unproject } = swissgrid;

  const projection = new ol.proj.Projection({
    code: 'EPSG:2056',
    units: 'm',
  });

  ol.proj.addProjection(projection);
  ol.proj.addCoordinateTransforms('EPSG:4326', projection.getCode(), project, unproject);

  return projection;
}

function swissTileGrid() {
  return new ol.tilegrid.TileGrid({
    extent: [2420000, 1030000, 2900000, 1350000],
    resolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5],
  });
}

function initializeMap(projection, tileGrid) {
  const extent = tileGrid.getExtent();
  const view = new ol.View({
    extent,
    projection,
    resolutions: tileGrid.getResolutions(),
  });
  const map = new ol.Map({
    controls: ol.control.defaults({ attribution: false }).extend([
      new ol.control.Attribution({
        collapsible: false,
      }),
    ]),
    target: document.body,
    view,
  });
  const padding = -50000;
  view.fit([
    extent[0] - padding, extent[1] - padding,
    extent[2] + padding, extent[3] + padding,
  ]);
  return map;
}

function swisstopoGrayMap(projection, tileGrid) {
  return new ol.layer.Tile({
    extent: tileGrid.getExtent(),
    source: new ol.source.XYZ(({
      url: 'https://wmts{0-9}.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/2056/{z}/{x}/{y}.jpeg',
      tileGrid,
      projection,
    })),
  });
}

function cantonalBoundaries(projection, tileGrid) {
  const maxZoom = 20;

  const source = new ol.source.VectorTile({
    attributions: `
      Map tiles + <a href="https://opendata.swiss/en/dataset/swissboundaries3d-kantonsgrenzen" target="_blank">swissBOUNDARIES3D</a>
      by <a href="https://www.swisstopo.admin.ch/en/home.html" target="_blank">swisstopo</a> |
      Canton symbols by <a href="https://github.com/nzzdev/ch-canton-symbols" target="_blank">NZZ Storytelling</a>
      (<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">CC BY-SA 4.0</a>)
    `,
    format: new ol.format.MVT(),
    tileGrid: new ol.tilegrid.TileGrid({
      extent: tileGrid.getExtent(),
      resolutions: tileGrid.getResolutions().slice(0, maxZoom + 1),
    }),
    url: 'cantonal-boundaries/{z}/{x}/{y}.pbf',
  });

  source.tileGrids_[projection.getCode()] = tileGrid;

  return new ol.layer.VectorTile({ source });
}

function setOverlayStyle(map, overlay, cantonPatterns) {
  let focusedCanton;

  map.on('moveend', () => {
    const center = map.getSize().map(size => size / 2);
    focusedCanton = undefined;
    if (map.getView().getZoom() > 15) {
      map.forEachFeatureAtPixel(center, (feature) => {
        focusedCanton = feature.get('name');
      });
    }
    overlay.getSource().changed();
  });

  overlay.setStyle((feature, resolution) => {
    const zoom = map.getView().getZoomForResolution(resolution);
    let patternSize = 0;
    let width = 1;
    if (zoom > 20) {
      patternSize = 2;
      width = 5;
    } else if (zoom > 15) {
      patternSize = 1;
      width = 2;
    }
    const stroke = new ol.style.Stroke({ width });
    const name = feature.get('name');
    if (name === focusedCanton) {
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgb(0, 0, 0, 0)',
        }),
        stroke,
      });
    }
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: cantonPatterns[name][patternSize],
      }),
      stroke,
    });
  });
}
