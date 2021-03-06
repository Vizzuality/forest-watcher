// @flow
import type { OfflineMeta, PersistRehydrate } from 'types/offline.types';
import type { Area } from 'types/areas.types';
import type { LogoutRequest } from 'types/user.types';
import type { RetrySync } from 'types/app.types';
import type { UploadReportRequest } from 'types/reports.types';

export type Alert = {
  id?: string,
  areaId: string,
  slug: string,
  long: number,
  lat: number,
  date: number
};

export type SelectedAlert = {
  lat: number,
  long: number,
  datasetId: ?string
};

export type AlertDatasetConfig = {
  id: string,
  nameKey: string,
  requestThreshold: number, // days
  recencyThreshold: number, // days
  filterThresholdOptions: Array<number>,
  filterThresholdUnits: 'days' | 'months',
  iconPrefix: string,
  color: string,
  colorRecent: string,
  colorReported: string,
  reportNameId: string
};

export type AlertsState = {
  cache: {
    viirs?: {
      [areaId: string]: string
    },
    umd_as_it_happens?: {
      [areaId: string]: string
    }
  },
  syncError: boolean,
  queue: Array<string>
};

export type AlertsAction =
  | RetrySync
  | GetAreaAlertsRequest
  | GetAreaAlertsCommit
  | GetAreaAlertsRollback
  | UploadReportRequest
  | PersistRehydrate
  | LogoutRequest;

type GetAreaAlertsRequest = {
  type: 'alerts/GET_ALERTS_REQUEST',
  payload: string,
  meta: OfflineMeta
};
export type GetAreaAlertsCommit = {
  type: 'alerts/GET_ALERTS_COMMIT',
  payload: ?string,
  meta: { area: Area, datasetSlug: string, range: number, alertId: string }
};
type GetAreaAlertsRollback = {
  type: 'alerts/GET_ALERTS_ROLLBACK',
  payload: ?Error,
  meta: { alertId: string }
};
