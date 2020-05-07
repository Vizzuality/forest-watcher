// @flow
export type RouteState = {
  activeRoute: ?Route,
  previousRoutes: Array<Route>,
  importedRoutes: Array<Route>
};

export type RouteDifficulty = 'easy' | 'medium' | 'hard';

export type Route = {
  id: string,
  areaId: string,
  name: string,
  startDate: number,
  endDate: number,
  difficulty: RouteDifficulty,
  destination?: Location,
  language: string,
  locations: Array<LocationPoint>
};

export type Location = {
  latitude: number,
  longitude: number
};

export type LocationPoint = {
  accuracy: number,
  altitude: number,
  latitude: number,
  longitude: number,
  timestamp: number
};

export type RouteDeletionCriteria = {
  id?: string,
  areaId?: string
};

export type RouteAction =
  | finishAndSaveRoute
  | deleteRouteAction
  | updateActiveRoute
  | updateSavedRoute
  | discardActiveRoute;

type updateActiveRoute = {
  type: 'routes/UPDATE_ACTIVE_ROUTE',
  payload: { areaId: string, destination: Location, startDate: number }
};
type updateSavedRoute = { type: 'routes/UPDATE_SAVED_ROUTE', payload: Route };
type finishAndSaveRoute = { type: 'routes/FINISH_AND_SAVE_ROUTE' };
type deleteRouteAction = { type: 'routes/DELETE_ROUTE', payload: RouteDeletionCriteria };
type discardActiveRoute = { type: 'routes/DISCARD_ACTIVE_ROUTE' };
