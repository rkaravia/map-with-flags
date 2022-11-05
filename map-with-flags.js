'use strict';

const state = {
  highlightId: null
}

const cantonPatterns = createCantonPatterns();

const map = initializeMap();

const backgroundMap = swisstopoGrayMap();
map.addLayer(backgroundMap);

const overlay = cantonalBoundaries(cantonPatterns);
map.addLayer(overlay);

overlay.on('click', event => {
  state.highlightId = event.layer.properties.name;
  overlay.setStyle(makeCantonStyle(cantonPatterns, state.highlightId));
});

function createCantonPatterns() {
  const cantons = { 'Aargau': 'AG', 'Appenzell Innerrhoden': 'AI', 'Appenzell Ausserrhoden': 'AR', 'Bern': 'BE', 'Basel-Landschaft': 'BL', 'Basel-Stadt': 'BS', 'Fribourg': 'FR', 'Genève': 'GE', 'Glarus': 'GL', 'Graubünden': 'GR', 'Jura': 'JU', 'Luzern': 'LU', 'Neuchâtel': 'NE', 'Nidwalden': 'NW', 'Obwalden': 'OW', 'St. Gallen': 'SG', 'Schaffhausen': 'SH', 'Solothurn': 'SO', 'Schwyz': 'SZ', 'Thurgau': 'TG', 'Ticino': 'TI', 'Uri': 'UR', 'Vaud': 'VD', 'Valais': 'VS', 'Zug': 'ZG', 'Zürich': 'ZH' };
  const patternRoot = document.querySelector('.pattern-svg');
  Object.entries(cantons).forEach(([name, id]) => {
    cantons[name] = [0, 1, 2].map(scale => {
      const factor = 2 ** scale;
      const patternId = `pattern-${id}-${scale}`;
      const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
      pattern.setAttributeNS(null, 'id', patternId);
      pattern.setAttributeNS(null, 'width', 16 * factor);
      pattern.setAttributeNS(null, 'height', 16 * factor);
      pattern.setAttributeNS(null, 'patternUnits', 'userSpaceOnUse');
      patternRoot.append(pattern);
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttributeNS(null, 'width', 16 * factor);
      rect.setAttributeNS(null, 'height', 16 * factor);
      rect.setAttributeNS(null, 'fill', '#fff');
      pattern.append(rect);
      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttributeNS(null, 'width', 13 * factor);
      image.setAttributeNS(null, 'height', 13 * factor);
      image.setAttributeNS(null, 'href', `https://unpkg.com/ch-canton-symbols@1.3.1/symbols/13x13/${id.toLowerCase()}.svg`);
      pattern.append(image);
      return `url(#${patternId})`;
    });
  });
  return cantons
}

function initializeMap() {
  const element = document.createElement('div');
  document.body.appendChild(element);

  const map = L.map(element, { crs: L.CRS.EPSG2056, minZoom: 14 });

  map.fitSwitzerland();

  return map;
}

function swisstopoGrayMap() {
  return L.tileLayer.swiss({ layer: 'ch.swisstopo.pixelkarte-grau' });
}

function cantonalBoundaries(cantonPatterns) {
  return new VectorTileLayer('cantonal-boundaries/{z}/{x}/{y}.pbf', {
    attribution: `
      <a href="https://github.com/nzzdev/ch-canton-symbols">NZZ Storytelling</a>
      (<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>),
      <a href="https://github.com/rkaravia/map-with-flags">Code on GitHub</a>
    `,
    getFeatureId(feature) {
      return feature.properties.name
    },
    maxNativeZoom: 20,
    style: makeCantonStyle(cantonPatterns)
  });
}

function makeCantonStyle(cantonPatterns, highlightId) {
  return (feature, layerName, zoom) => {
    const id = feature.properties.name;
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
      fill: highlightId !== id,
      fillColor: cantonPatterns[id][patternSize],
      fillOpacity: 1,
      weight: weight * window.devicePixelRatio,
    };
  };
}
