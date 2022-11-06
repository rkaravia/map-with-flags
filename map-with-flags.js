'use strict';

const cantonIdByName = { 'Aargau': 'AG', 'Appenzell Innerrhoden': 'AI', 'Appenzell Ausserrhoden': 'AR', 'Bern': 'BE', 'Basel-Landschaft': 'BL', 'Basel-Stadt': 'BS', 'Fribourg': 'FR', 'Genève': 'GE', 'Glarus': 'GL', 'Graubünden': 'GR', 'Jura': 'JU', 'Luzern': 'LU', 'Neuchâtel': 'NE', 'Nidwalden': 'NW', 'Obwalden': 'OW', 'St. Gallen': 'SG', 'Schaffhausen': 'SH', 'Solothurn': 'SO', 'Schwyz': 'SZ', 'Thurgau': 'TG', 'Ticino': 'TI', 'Uri': 'UR', 'Vaud': 'VD', 'Valais': 'VS', 'Zug': 'ZG', 'Zürich': 'ZH' };

const state = {
  highlightCanton: null
}

const cantonPatterns = createCantonPatterns();

const map = initializeMap();

const backgroundLayer = swisstopoGrayMap();
map.addLayer(backgroundLayer);

const overlayLayer = cantonalBoundaries(cantonPatterns);
map.addLayer(overlayLayer);

highlightOnClick(overlayLayer, state);

updateOverlay(overlayLayer, state);

function createCantonPatterns() {
  const patternRoot = document.querySelector('.pattern-svg');
  const patterns = {};
  Object.entries(cantonIdByName).forEach(([name, id]) => {
    patterns[name] = [0, 1, 2].map(scale => {
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
      image.setAttributeNS(null, 'href', cantonSymbolUrl(id));
      pattern.append(image);
      return `url(#${patternId})`;
    });
  });
  return patterns
}

function initializeMap() {
  const map = L.map('map', { crs: L.CRS.EPSG2056, minZoom: 14 });

  map.fitSwitzerland();

  return map;
}

function swisstopoGrayMap() {
  return L.tileLayer.swiss({ layer: 'ch.swisstopo.pixelkarte-grau' });
}

function cantonalBoundaries() {
  return new VectorTileLayer('cantonal-boundaries/{z}/{x}/{y}.pbf', {
    attribution: `
      <a href="https://github.com/nzzdev/ch-canton-symbols">NZZ Storytelling</a>
      (<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>),
      <a href="https://github.com/rkaravia/map-with-flags">Code on GitHub</a>
    `,
    getFeatureId(feature) {
      return feature.properties.name
    },
    maxNativeZoom: 20
  });
}

function makeCantonStyle(cantonPatterns, highlightCanton) {
  return (feature, layerName, zoom) => {
    const name = feature.properties.name;
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
      color: '#333',
      fill: highlightCanton !== name,
      fillColor: cantonPatterns[name][patternSize],
      fillOpacity: 1,
      weight: weight,
    };
  };
}

function highlightOnClick(overlayLayer, state) {
  overlayLayer.on('click', event => {
    state.highlightCanton = event.layer.properties.name;
    updateOverlay(overlayLayer, state);
  });
}

function updateOverlay(overlayLayer, state) {
  overlayLayer.setStyle(makeCantonStyle(cantonPatterns, state.highlightCanton));
  const overlay = document.querySelector('.overlay');
  if (state.highlightCanton) {
    const flag = new Image(13, 13);
    flag.alt = `Flag of ${state.highlightCanton}`;
    flag.src = cantonSymbolUrl(cantonIdByName[state.highlightCanton]);
    const caption = document.createTextNode(state.highlightCanton);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS(null, 'role', 'button');
    svg.setAttributeNS(null, 'aria-label', 'Close');
    svg.setAttributeNS(null, 'viewBox', '0 0 32 32');
    svg.setAttributeNS(null, 'width', 16);
    svg.setAttributeNS(null, 'height', 16);
    svg.addEventListener('click', () => {
      state.highlightCanton = null;
      updateOverlay(overlayLayer, state);
    });
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', 'M24 10L22 8L16 14L10 8L8 10L14 16L8 22L10 24L16 18L22 24L24 22L18 16L24 10Z');
    path.setAttributeNS(null, 'fill', '#000');
    svg.append(path);
    overlay.replaceChildren(flag, caption, svg);
  } else {
    overlay.textContent = 'Tap canton to highlight…';
  }
}

function cantonSymbolUrl(id) {
  return `https://unpkg.com/ch-canton-symbols@1.3.1/symbols/13x13/${id.toLowerCase()}.svg`;
}
