// @flow
import type { LayerSettingsState, LayerSettingsAction } from 'types/layerSettings.types';
import { DEFAULT_BASEMAP, GFW_BASEMAPS } from 'config/constants';
import remove from 'lodash/remove';
import type { Dispatch, GetState } from 'types/store.types';
import type { Area } from 'types/areas.types';
import { DATASETS } from 'config/constants';

// Actions
const TOGGLE_ALERTS_LAYER = 'layerSettings/TOGGLE_ALERTS_LAYER';
const TOGGLE_ROUTES_LAYER = 'layerSettings/TOGGLE_ROUTES_LAYER';
const TOGGLE_REPORTS_LAYER = 'layerSettings/TOGGLE_REPORTS_LAYER';
const TOGGLE_CONTEXTUAL_LAYERS_LAYER = 'layerSettings/TOGGLE_CONTEXTUAL_LAYERS_LAYER';

const TOGGLE_MY_REPORTS_LAYER = 'layerSettings/TOGGLE_MY_REPORTS_LAYER';
const TOGGLE_IMPORTED_REPORTS_LAYER = 'layerSettings/TOGGLE_IMPORTED_REPORTS_LAYER';

const INITIALISE_ALERTS = 'layerSettings/INITIALISE_ALERTS';
const TOGGLE_GLAD_ALERTS = 'layerSettings/TOGGLE_GLAD_ALERTS';
const TOGGLE_VIIRS_ALERTS = 'layerSettings/TOGGLE_VIIRS_ALERTS';
const SET_GLAD_ALERTS_TIME_FRAME = 'layerSettings/SET_GLAD_ALERTS_TIME_FRAME';
const SET_VIIRS_ALERTS_TIME_FRAME = 'layerSettings/SET_VIIRS_ALERTS_TIME_FRAME';

const COPY_LAYER_SETTINGS = 'layerSettings/COPY_LAYER_SETTINGS';

const SELECT_ACTIVE_BASEMAP = 'layerSettings/SELECT_ACTIVE_BASEMAP';

const SET_CONTEXTUAL_LAYER_SHOWING = 'layerSettings/SET_CONTEXTUAL_LAYER_SHOWING';
const CLEAR_ENABLED_CONTEXTUAL_LAYERS = 'layerSettings/CLEAR_ENABLED_CONTEXTUAL_LAYERS';

const DESELECT_ALL_ROUTES = 'layerSettings/DESELECT_ALL_ROUTES';
const TOGGLE_ROUTE_SELECTED = 'layerSettings/TOGGLE_ROUTE_SELECTED';

// Reducer
export const DEFAULT_LAYER_SETTINGS = {
  alerts: {
    layerIsActive: true,
    // alert types need to be made active depending on which alert types are available for the area
    initialised: false,
    glad: {
      active: false,
      timeFrame: 1
    },
    viirs: {
      active: false,
      timeFrame: 1
    }
  },
  routes: {
    showAll: true,
    layerIsActive: false,
    activeRouteIds: []
  },
  reports: {
    layerIsActive: false,
    myReportsActive: true,
    importedReportsActive: true
  },
  contextualLayers: {
    layerIsActive: false,
    activeContextualLayerIds: []
  },
  basemap: {
    activeBasemapId: DEFAULT_BASEMAP.id
  }
};

const initialState = {};

export default function reducer(
  state: LayerSettingsState = initialState,
  action: LayerSettingsAction
): LayerSettingsState {
  const featureId: string = action.payload?.featureId;
  if (!featureId) {
    // All actions require the featureId, this will be the ID of the area or route we want to change the layer settings for.
    return state;
  }
  if (!state[featureId]) {
    // if this feature had no custom layer settings, we duplicate the default,
    // and then apply the changes of the action
    state = { ...state, [featureId]: DEFAULT_LAYER_SETTINGS };
  }

  switch (action.type) {
    case TOGGLE_ALERTS_LAYER: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          alerts: {
            ...state[featureId].alerts,
            layerIsActive: !state[featureId].alerts.layerIsActive
          }
        }
      };
    }
    case TOGGLE_ROUTES_LAYER: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          routes: {
            ...state[featureId].routes,
            layerIsActive: !state[featureId].routes.layerIsActive
          }
        }
      };
    }
    case TOGGLE_REPORTS_LAYER: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          reports: {
            ...state[featureId].reports,
            layerIsActive: !state[featureId].reports.layerIsActive
          }
        }
      };
    }
    case TOGGLE_CONTEXTUAL_LAYERS_LAYER: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          contextualLayers: {
            ...state[featureId].contextualLayers,
            layerIsActive: !state[featureId].contextualLayers.layerIsActive
          }
        }
      };
    }
    case TOGGLE_MY_REPORTS_LAYER: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          reports: {
            ...state[featureId].reports,
            myReportsActive: !state[featureId].reports.myReportsActive
          }
        }
      };
    }
    case TOGGLE_IMPORTED_REPORTS_LAYER: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          reports: {
            ...state[featureId].reports,
            importedReportsActive: !state[featureId].reports.importedReportsActive
          }
        }
      };
    }
    case INITIALISE_ALERTS: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          alerts: {
            ...state[featureId].alerts,
            initialised: true,
            glad: {
              ...state[featureId].alerts.glad,
              active: action.payload.showGlad
            },
            viirs: {
              ...state[featureId].alerts.viirs,
              active: action.payload.showViirs
            }
          }
        }
      };
    }
    case TOGGLE_GLAD_ALERTS: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          alerts: {
            ...state[featureId].alerts,
            glad: {
              ...state[featureId].alerts.glad,
              active: !state[featureId].alerts.glad.active
            }
          }
        }
      };
    }
    case TOGGLE_VIIRS_ALERTS: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          alerts: {
            ...state[featureId].alerts,
            viirs: {
              ...state[featureId].alerts.viirs,
              active: !state[featureId].alerts.viirs.active
            }
          }
        }
      };
    }
    case SET_GLAD_ALERTS_TIME_FRAME: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          alerts: {
            ...state[featureId].alerts,
            glad: {
              ...state[featureId].alerts.glad,
              timeFrame: action.payload.timeFrame
            }
          }
        }
      };
    }
    case SET_VIIRS_ALERTS_TIME_FRAME: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          alerts: {
            ...state[featureId].alerts,
            viirs: {
              ...state[featureId].alerts.viirs,
              timeFrame: action.payload.timeFrame
            }
          }
        }
      };
    }
    case SELECT_ACTIVE_BASEMAP: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          basemap: {
            activeBasemapId: action.payload.basemapId
          }
        }
      };
    }
    case COPY_LAYER_SETTINGS: {
      return {
        ...state,
        [featureId]: state[action.payload.copyFromFeatureId]
      };
    }
    case SET_CONTEXTUAL_LAYER_SHOWING: {
      const activeContextualLayerIds = [...state[featureId].contextualLayers.activeContextualLayerIds];
      if (action.payload.showing && !activeContextualLayerIds.includes(action.payload.layerId)) {
        activeContextualLayerIds.push(action.payload.layerId);
      } else if (!action.payload.showing) {
        remove(activeContextualLayerIds, layerId => {
          return layerId === action.payload.layerId;
        });
      }
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          contextualLayers: {
            ...state[featureId].contextualLayers,
            activeContextualLayerIds
          }
        }
      };
    }
    case CLEAR_ENABLED_CONTEXTUAL_LAYERS: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          contextualLayers: {
            ...state[featureId].contextualLayers,
            activeContextualLayerIds: []
          }
        }
      };
    }
    case TOGGLE_ROUTE_SELECTED: {
      const { activeRouteIds } = state[featureId].routes;
      let { showAll } = state[featureId].routes;
      const { routeId, allRouteIds } = action.payload;
      let newActiveRouteIds;
      if (!activeRouteIds.includes(routeId) && !showAll) {
        // select route
        newActiveRouteIds = [...activeRouteIds, routeId];
        if (newActiveRouteIds.length === allRouteIds.length) {
          showAll = true;
        }
      } else {
        // deselect route
        if (state[featureId].routes.showAll) {
          newActiveRouteIds = allRouteIds.filter(id => id !== routeId);
          showAll = false;
        } else {
          newActiveRouteIds = activeRouteIds.filter(id => id !== routeId);
        }
      }
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          routes: {
            ...state[featureId].routes,
            activeRouteIds: newActiveRouteIds,
            showAll
          }
        }
      };
    }
    case DESELECT_ALL_ROUTES: {
      return {
        ...state,
        [featureId]: {
          ...state[featureId],
          routes: {
            ...state[featureId].routes,
            showAll: false,
            activeRouteIds: []
          }
        }
      };
    }
    default:
      return state;
  }
}

export function clearEnabledContextualLayers(featureId: string) {
  return {
    type: CLEAR_ENABLED_CONTEXTUAL_LAYERS,
    payload: {
      featureId
    }
  };
}

export function setContextualLayerShowing(featureId: string, layerId: string, showing: boolean) {
  return {
    type: SET_CONTEXTUAL_LAYER_SHOWING,
    payload: {
      featureId,
      layerId,
      showing
    }
  };
}

export function deselectAllRoutes(featureId: string) {
  return {
    type: DESELECT_ALL_ROUTES,
    payload: {
      featureId
    }
  };
}

export function toggleRouteSelected(featureId: string, routeId: string, allRouteIds: Array<string>) {
  return {
    type: TOGGLE_ROUTE_SELECTED,
    payload: {
      featureId,
      routeId,
      allRouteIds
    }
  };
}

export function toggleAlertsLayer(featureId: string): LayerSettingsAction {
  return {
    type: TOGGLE_ALERTS_LAYER,
    payload: {
      featureId
    }
  };
}

export function toggleRoutesLayer(featureId: string): LayerSettingsAction {
  return {
    type: TOGGLE_ROUTES_LAYER,
    payload: {
      featureId
    }
  };
}

export function toggleReportsLayer(featureId: string): LayerSettingsAction {
  return {
    type: TOGGLE_REPORTS_LAYER,
    payload: {
      featureId
    }
  };
}

export function toggleContextualLayersLayer(featureId: string): LayerSettingsAction {
  return {
    type: TOGGLE_CONTEXTUAL_LAYERS_LAYER,
    payload: {
      featureId
    }
  };
}

export function toggleMyReportsLayer(featureId: string): LayerSettingsAction {
  return {
    type: TOGGLE_MY_REPORTS_LAYER,
    payload: {
      featureId
    }
  };
}

export function toggleImportedReportsLayer(featureId: string): LayerSettingsAction {
  return {
    type: TOGGLE_IMPORTED_REPORTS_LAYER,
    payload: {
      featureId
    }
  };
}

export function initialiseAlerts(featureId: string, showGlad: boolean, showViirs: boolean): LayerSettingsAction {
  return {
    type: INITIALISE_ALERTS,
    payload: {
      featureId,
      showGlad,
      showViirs
    }
  };
}

export function toggleGladAlerts(featureId: string): LayerSettingsAction {
  return {
    type: TOGGLE_GLAD_ALERTS,
    payload: {
      featureId
    }
  };
}

export function toggleViirsAlerts(featureId: string): LayerSettingsAction {
  return {
    type: TOGGLE_VIIRS_ALERTS,
    payload: {
      featureId
    }
  };
}

export function setGladAlertsTimeFrame(featureId: string, timeFrame: number): LayerSettingsAction {
  return {
    type: SET_GLAD_ALERTS_TIME_FRAME,
    payload: {
      featureId,
      timeFrame
    }
  };
}

export function setViirsAlertsTimeFrame(featureId: string, timeFrame: number): LayerSettingsAction {
  return {
    type: SET_VIIRS_ALERTS_TIME_FRAME,
    payload: {
      featureId,
      timeFrame
    }
  };
}

export function selectActiveBasemap(featureId: string, basemapId: string): LayerSettingsAction {
  return {
    type: SELECT_ACTIVE_BASEMAP,
    payload: {
      featureId,
      basemapId
    }
  };
}

// Used to copy an Area's layer settings to a new Route, when the route is created.
export function copyLayerSettings(copyFromFeatureId: string, copyToFeatureId: string): LayerSettingsAction {
  return {
    type: COPY_LAYER_SETTINGS,
    payload: {
      copyFromFeatureId,
      featureId: copyToFeatureId
    }
  };
}

export function getActiveBasemap(featureId: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const activeBasemapId = state.layerSettings?.[featureId]?.basemap?.activeBasemapId;
    if (!activeBasemapId) {
      return DEFAULT_BASEMAP;
    }
    const allBasemaps = [...GFW_BASEMAPS, ...state.basemaps.importedBasemaps];
    const basemap = allBasemaps.find(item => item.id === activeBasemapId);
    return basemap ?? DEFAULT_BASEMAP;
  };
}

// This should be called whenever opening a feature (area / route) on the map screen.
export function initialiseAreaLayerSettings(featureId: string, areaId: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { layerSettings, areas } = getState();
    const featureLayerSettings = layerSettings[featureId] || DEFAULT_LAYER_SETTINGS;
    if (featureLayerSettings.alerts.initialised) {
      return;
    }
    // Alert types need to be initialised for area, depending on available alert types
    const area: ?Area = areas.data.find((area: Area) => area.id === areaId);

    if (!area) {
      return;
    }

    const areaDatasets = area.datasets.map(dataset => dataset.slug);
    const hasGladAlerts = areaDatasets.includes(DATASETS.umd_as_it_happens.id);
    const hasViirsAlerts = areaDatasets.includes(DATASETS.viirs.id);
    const showGlad = hasGladAlerts;
    const showViirs = hasViirsAlerts && !hasGladAlerts;
    dispatch(initialiseAlerts(featureId, showGlad, showViirs));
  };
}
