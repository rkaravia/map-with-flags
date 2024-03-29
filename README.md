# Map with flags

A fun map of Switzerland with flags!

[<img src="screenshot.png" alt="Screenshot of Map with flags" width="640">](https://labs.karavia.ch/map-with-flags/)

## Technical Details

The Swiss cantonal boundaries are loaded as vector tiles, using the same tile grid as [Swisstopo raster maps](https://api3.geo.admin.ch/services/sdiservices.html#wmts).

The tiles have been generated with [t-rex](https://t-rex.tileserver.ch/) and are available in this repo.

URL: `https://labs.karavia.ch/map-with-flags/cantonal-boundaries/{z}/{x}/{y}.pbf`

Zoom levels 0 to 20 have been generated.

## Tech demos

This repo was originally called [swiss-tile-grid-vt](https://github.com/rkaravia/swiss-tile-grid-vt) and contained tech demos
for loading vector tiles using the Swiss tile grid with the latest mapping libraries at the time (2019).

You can still see them here:

- [Leaflet 1.4.0](https://labs.karavia.ch/map-with-flags/v1-leaflet.html)
- [OpenLayers 5.3.0](https://labs.karavia.ch/map-with-flags/v1-ol.html)

## Attribution

The tiles have been derived from the [swissBOUNDARIES3D](https://opendata.swiss/en/dataset/swissboundaries3d-kantonsgrenzen)
by [Swisstopo](https://www.swisstopo.admin.ch/en/home.html). Attribution of the source is required when using the tiles.

## License

OpenLayers 5.3.0 is licensed under the [2-Clause BSD License](https://github.com/openlayers/openlayers/blob/v5.3.0/LICENSE.md).

Leaflet.VectorTileLayer is licensed under the [3-Clause BSD License](https://gitlab.com/jkuebart/Leaflet.VectorTileLayer/-/blob/main/LICENCE).

The remaining code in this repo is licensed under the MIT license, see the LICENSE file.
