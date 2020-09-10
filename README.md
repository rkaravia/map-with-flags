# swiss-tile-grid-vt

Swiss cantonal boundaries as vector tiles, using the same tile grid as [swisstopo raster maps](https://api3.geo.admin.ch/services/sdiservices.html#wmts).

## Client Demos
- [Using Leaflet](https://labs.karavia.ch/swiss-tile-grid-vt/leaflet.html)
- [Using OpenLayers](https://labs.karavia.ch/swiss-tile-grid-vt/)

## Technical Details

The tiles have been generated with [t-rex](https://t-rex.tileserver.ch/) and are available in this repo.

URL: `https://labs.karavia.ch/swiss-tile-grid-vt/cantonal-boundaries/{z}/{x}/{y}.pbf`

Zoom levels 0 to 20 have been generated.

## Attribution

The tiles have been derived from the [swissBOUNDARIES3D](https://opendata.swiss/en/dataset/swissboundaries3d-kantonsgrenzen)
by [swisstopo](https://www.swisstopo.admin.ch/en/home.html). Attribution of the source is required when using the tiles.

## License

The client demo code is licensed under the MIT license, see the LICENSE file.

OpenLayers 5.3.0 is licensed under the [2-Clause BSD License](https://github.com/openlayers/openlayers/blob/v5.3.0/LICENSE.md).
