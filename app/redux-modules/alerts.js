// @flow
import type { AlertsState, AlertsAction } from 'types/alerts.types';
import type { Area } from 'types/areas.types';

import Config from 'react-native-config';

// Actions
import { LOGOUT_REQUEST } from 'redux-modules/user';
import { UPLOAD_REPORT_REQUEST } from 'redux-modules/reports';
import { RETRY_SYNC } from 'redux-modules/app';
import { PERSIST_REHYDRATE } from '@redux-offline/redux-offline/lib/constants';
import { parseAlerts } from 'helpers/alertsParse';

const SET_CAN_DISPLAY_ALERTS = 'alerts/SET_CAN_DISPLAY_ALERTS';
export const SET_ACTIVE_ALERTS = 'alerts/SET_ACTIVE_ALERTS';
const GET_ALERTS_REQUEST = 'alerts/GET_ALERTS_REQUEST';
export const GET_ALERTS_COMMIT = 'alerts/GET_ALERTS_COMMIT';
const GET_ALERTS_ROLLBACK = 'alerts/GET_ALERTS_ROLLBACK';

// Reducer
const initialState = {
  data: {},
  reported: [],
  canDisplayAlerts: true,
  syncError: false,
  queue: []
};

export default function reducer(state: AlertsState = initialState, action: AlertsAction) {
  switch (action.type) {
    case PERSIST_REHYDRATE: {
      const { alerts } = action.payload;
      return { ...state, ...alerts, syncError: false };
    }
    case RETRY_SYNC: {
      return { ...state, syncError: false };
    }
    case SET_CAN_DISPLAY_ALERTS:
      return { ...state, canDisplayAlerts: action.payload };
    case UPLOAD_REPORT_REQUEST: {
      const { alerts } = action.payload;
      let reported = [...state.reported];

      if (alerts && alerts.length) {
        alerts.forEach(alert => {
          reported = [...reported, `${alert.lon}${alert.lat}`];
        }, this);
      }
      return { ...state, reported };
    }
    case GET_ALERTS_REQUEST: {
      const queue = [...state.queue, action.payload];
      return { ...state, queue };
    }
    case GET_ALERTS_COMMIT: {
      const alerts = parseAlerts(action.payload);
      const { area, datasetSlug, alertId } = action.meta;
      const data = {
        ...state.data,
        [area.id]: {
          ...(state.data[area.id] ?? {}),
          [datasetSlug]: {
            lastUpdated: Date.now(),
            alerts
          }
        }
      };
      const queue = state.queue.filter(item => item !== alertId);
      return { ...state, queue, data };
    }
    case GET_ALERTS_ROLLBACK: {
      const { alertId } = action.meta;
      const queue = state.queue.filter(item => item !== alertId);
      return { ...state, queue, syncError: true };
    }
    case LOGOUT_REQUEST: {
      return initialState;
    }
    default:
      return state;
  }
}

// Action Creators
export function setCanDisplayAlerts(canDisplay: boolean) {
  return {
    type: SET_CAN_DISPLAY_ALERTS,
    payload: canDisplay
  };
}

export function setActiveAlerts() {
  return { type: SET_ACTIVE_ALERTS };
}

export function getAreaAlerts(area: Area, datasetSlug: string, range: number) {
  const url = `${Config.API_URL}/fw-alerts/${datasetSlug}/${area.geostore.id}?range=${range}&output=csv`;
  const alertId = `${area.id}_${datasetSlug}`;
  return {
    type: GET_ALERTS_REQUEST,
    payload: alertId,
    meta: {
      offline: {
        effect: { url, deserialize: false },
        commit: { type: GET_ALERTS_COMMIT, meta: { area, datasetSlug, range, alertId } },
        rollback: { type: GET_ALERTS_ROLLBACK, meta: { alertId } }
      }
    }
  };
}
