// @flow
import type { ComponentProps, Dispatch, State } from 'types/store.types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ContextualLayersLayerSettings from 'components/settings/layer-settings/contextual-layers';

import {
  clearEnabledContextualLayers,
  DEFAULT_LAYER_SETTINGS,
  setContextualLayerShowing
} from 'redux-modules/layerSettings';

import type { Layer } from 'types/layers.types';

type OwnProps = {|
  +componentId: string,
  featureId: string
|};

function mapStateToProps(state: State, ownProps: OwnProps) {
  let baseFiles: Array<Layer> = state.layers.data || [];
  const importedGFWLayers = state.layers.imported.filter(layer => !layer.isCustom && layer.type === 'contextual_layer');
  baseFiles = baseFiles.concat(importedGFWLayers);
  const importedFiles: Array<Layer> = state.layers.imported.filter(
    layer => layer.isCustom && layer.type === 'contextual_layer'
  );

  return {
    baseApiLayers: baseFiles,
    featureId: ownProps.featureId,
    contextualLayersLayerSettings:
      state.layerSettings?.[ownProps.featureId]?.contextualLayers || DEFAULT_LAYER_SETTINGS.contextualLayers,
    downloadProgress: state.layers.downloadedLayerProgress,
    importedContextualLayers: importedFiles
  };
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      clearEnabledContextualLayers,
      setContextualLayerShowing
    },
    dispatch
  );

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, State, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ContextualLayersLayerSettings);
