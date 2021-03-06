// @flow

import type { LayerFile, LayerType } from 'types/sharing.types';
import type { FeatureCollection, Polygon } from '@turf/helpers';

import _ from 'lodash';
import intersect from '@turf/intersect';

import { layerRootDir, pathForLayer, pathForLayerType, tileForFileName } from 'helpers/layer-store/layerFilePaths';
import tilebelt from '@mapbox/tilebelt';

const RNFS = require('react-native-fs');

/**
 * Returns all layer files meeting the following conditions:
 *
 * (i) The ID of the layer must be in whitelist (ignored if whitelist is empty)
 * (ii) The ID of the layer must not be in the blacklist (blacklist takes precedence over whitelist)
 * (iii) The polygon associated with the layer file must intersect the specified region (ignored if empty or null)
 */
export default async function queryLayerFiles(
  type: LayerType,
  query: {|
    whitelist: Array<string>,
    blacklist: Array<string>,
    region?: ?FeatureCollection<Polygon>
  |},
  dir: string = layerRootDir()
): Promise<Array<LayerFile>> {
  const actualWhitelist = query.whitelist.length > 0 ? query.whitelist : await listLayerIds(type, dir);
  const idsToConsider = actualWhitelist.filter(id => !query.blacklist.includes(id));
  const listLayerFilePromises = idsToConsider.map(id =>
    query.region ? listLayerFilesForRegion(type, id, query.region, dir) : listLayerFiles(type, id, dir)
  );
  const layerFiles = await Promise.all(listLayerFilePromises);
  return _.flatten(layerFiles);
}

/**
 * Returns whether or not the specified layer file partially intersects any of the polygons in the feature collection.
 *
 * If the feature collection is empty then this will return false.
 */
export function isLayerFileIntersectingRegion(layerFile: LayerFile, region: FeatureCollection<Polygon>): boolean {
  const layerPolygon = layerFile.polygon ?? tilebelt.tileToGeoJSON(layerFile.tileXYZ);
  return region.features.some(feature => !!intersect(layerPolygon, feature));
}

/**
 * Lists all the layer files stored on disk for a particular layer ID.
 *
 * For custom layers, only the enclosing tile directory is returned. For tile-based layers, the tile files themselves
 * are returned.
 */
async function listLayerFiles(type: LayerType, id: string, dir: string): Promise<Array<LayerFile>> {
  const path = pathForLayer(type, id, dir);
  // Check exists, otherwise the readDir throws on iOS
  const exists = await RNFS.exists(path);
  if (!exists) {
    return [];
  }

  const children = await RNFS.readDir(path);
  const layerFiles: Array<LayerFile> = [];

  // eslint-disable-next-line no-unused-vars
  for (const child of children) {
    const tileXYZ = tileForFileName(child.name); // TODO: Ignore invalid names
    const polygon = tilebelt.tileToGeoJSON(tileXYZ);
    const isDir = child.isDirectory();
    const grandchildren = isDir ? await RNFS.readDir(child.path) : []; // TODO: Do we need to recurse children?
    const size = isDir ? _.sumBy(grandchildren, file => file.size ?? 0) : child.size;

    layerFiles.push({
      type: type,
      layerId: id,
      path: child.path,
      tileXYZ: tileXYZ,
      subFiles: isDir ? grandchildren.map(grandchild => grandchild.name) : null,
      polygon: polygon,
      size: parseInt(size)
    });
  }

  return layerFiles;
}

/**
 * Lists all the layer files stored on disk for a particular layer ID that intersect at least one of the specified regions
 *
 * If the regions array is empty then no filtering occurs.
 */
async function listLayerFilesForRegion(
  type: LayerType,
  id: string,
  region: FeatureCollection<Polygon>,
  dir: string
): Promise<Array<LayerFile>> {
  const layerFiles = await listLayerFiles(type, id, dir);

  if (region.features.length === 0) {
    return layerFiles;
  }

  return layerFiles.filter(layerFile => isLayerFileIntersectingRegion(layerFile, region));
}

/**
 * Lists the IDs of all the layers stored on disk of a certain type
 */
async function listLayerIds(type: LayerType, dir: string): Promise<Array<string>> {
  const path = pathForLayerType(type, dir);
  // Check exists, otherwise the readDir throws on iOS
  const exists = await RNFS.exists(path);
  if (!exists) {
    return [];
  }
  const children = await RNFS.readDir(path);
  return children.filter(child => child.isDirectory()).map(dir => dir.name);
}
