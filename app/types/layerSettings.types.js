// @flow

export type LayerSettingsState = {
  reports: {
    layerIsActive: boolean,
    myReportsActive: boolean,
    importedReportsActive: boolean
  },
  basemap: {
    activeBasemapId: string
  },
  routes: {
    layerIsActive: boolean,
    activeRouteIds: Array<string>
  },
  alerts: {
    layerIsActive: boolean,
    glad: {
      active: boolean,
      timeframeMonths: number
    },
    viirs: {
      active: boolean,
      timeframeMonths: number
    }
  },
  contextualLayers: {
    layerIsActive: boolean,
    activeContextualLayerIds: Array<string>
  }
};

export type LayerSettingsAction =
  | ClearEnabledContextualLayers
  | SetContexualLayerShowing
  | ToggleAlertsLayer
  | ToggleRoutesLayer
  | ToggleReportsLayer
  | ToggleContextualLayersLayer;

export type ClearEnabledContextualLayers = { type: 'layerSettings/CLEAR_ENABLED_CONTEXTUAL_LAYERS' };
export type ToggleAlertsLayer = { type: 'layerSettings/TOGGLE_ALERTS_LAYER' };
export type ToggleRoutesLayer = { type: 'layerSettings/TOGGLE_ROUTES_LAYER' };
export type ToggleReportsLayer = { type: 'layerSettings/TOGGLE_REPORTS_LAYER' };
export type ToggleContextualLayersLayer = { type: 'layerSettings/TOGGLE_CONTEXTUAL_LAYERS_LAYER' };
export type SetContexualLayerShowing = { type: 'layerSettings/SET_CONTEXTUAL_LAYER_SHOWING' };
