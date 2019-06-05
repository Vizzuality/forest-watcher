// @flow
import type { RouteState, RouteAction, Route } from 'types/routes.types';

// Actions
const DELETE_ROUTE = 'routes/DELETE_ROUTE';
const SET_ROUTE_DESTINATION = 'routes/SET_ROUTE_DESTINATION';
const FINISH_AND_SAVE_ROUTE = 'routes/FINISH_AND_SAVE_ROUTE';

const locationsMock = [
  {
    isFromMockProvider: true,
    speed: 0.16595615446567535,
    longitude: -1.9038149583965769,
    altitude: 45.72404098510742,
    latitude: 50.723844868152916,
    time: 1559301014492,
    accuracy: 2.5674021244049072,
    provider: 'gps'
  },
  {
    provider: 'network',
    id: 227,
    accuracy: 3.618929386138916,
    locationProvider: 0,
    mockLocationsEnabled: false,
    time: 1559301017547,
    latitude: 50.72372814244796,
    altitude: 46.55546569824219,
    isFromMockProvider: true,
    longitude: -1.9039320183728654,
    speed: 0.26691338419914246
  },
  {
    provider: 'network',
    id: 227,
    accuracy: 3.618929386138916,
    locationProvider: 0,
    mockLocationsEnabled: false,
    time: 1559301017547,
    latitude: 50.72372814244796,
    altitude: 46.55546569824219,
    isFromMockProvider: true,
    longitude: -1.9039320183728654,
    speed: 0.26691338419914246
  },
  {
    provider: 'gps',
    id: 228,
    accuracy: 3.659508228302002,
    locationProvider: 0,
    mockLocationsEnabled: false,
    time: 1559301020640,
    latitude: 50.72384538743944,
    altitude: 46.62886047363281,
    isFromMockProvider: true,
    longitude: -1.9038152601701193,
    speed: 0.18818020820617676
  },
  {
    provider: 'gps',
    id: 228,
    accuracy: 3.659508228302002,
    locationProvider: 0,
    mockLocationsEnabled: false,
    time: 1559301020640,
    latitude: 50.72384538743944,
    altitude: 46.62886047363281,
    isFromMockProvider: true,
    longitude: -1.9038152601701193,
    speed: 0.18818020820617676
  }
];
const locationsMock2 = [
  { latitude: 50.7226855, longitude: -1.8627967, timestamp: 1558620056631 },
  { latitude: 50.722720418, longitude: -1.862749454, timestamp: 1558620082999 },
  { latitude: 50.722570688185215, longitude: -1.8628064121799122, timestamp: 1558620432926 },
  { latitude: 50.722710612, longitude: -1.862993474, timestamp: 1558620447999 },
  { latitude: 50.722682092346496, longitude: -1.862718694324153, timestamp: 1558690826148 },
  { latitude: 50.72258898200081, longitude: -1.8628698979816005, timestamp: 1558690828107 },
  { latitude: 50.7226765, longitude: -1.8627919, timestamp: 1558692839793 },
  { latitude: 50.72230311864745, longitude: -1.862668810048171, timestamp: 1558692842626 },
  { latitude: 50.723040018394684, longitude: -1.8630032066175732, timestamp: 1558694282874 },
  { latitude: 50.722774129, longitude: -1.862832636, timestamp: 1558694298000 },
  { latitude: 50.722603197, longitude: -1.862739012, timestamp: 1558694311000 },
  { latitude: 50.72260704714993, longitude: -1.8625382907512602, timestamp: 1558694396098 },
  { latitude: 50.72279132480454, longitude: -1.8626409617834825, timestamp: 1558695104315 },
  { latitude: 50.722549986, longitude: -1.862716698, timestamp: 1558695717000 },
  { latitude: 50.72261739779484, longitude: -1.862722800043729, timestamp: 1558696334000 },
  { latitude: 50.7529491, longitude: -1.8729443, timestamp: 1559219384474 },
  { latitude: 50.7530021005132, longitude: -1.8726596698146811, timestamp: 1559219392952 },
  { latitude: 50.752896401974766, longitude: -1.8729340099691414, timestamp: 1559219394954 },
  { latitude: 50.7529411, longitude: -1.8729274, timestamp: 1559219406026 },
  { latitude: 50.75278883183058, longitude: -1.8733814510992615, timestamp: 1559219412826 },
  { latitude: 50.752746024, longitude: -1.873368518, timestamp: 1559219421999 },
  { latitude: 50.7529415, longitude: -1.8729303, timestamp: 1559219429413 },
  { latitude: 50.75278290897856, longitude: -1.8732908578634164, timestamp: 1559219429999 },
  { latitude: 50.752797763, longitude: -1.873279917, timestamp: 1559219434999 },
  { latitude: 50.752908897, longitude: -1.87301057, timestamp: 1559219446999 },
  { latitude: 50.7529469, longitude: -1.8729455, timestamp: 1559219519773 },
  { latitude: 50.75297378887252, longitude: -1.8730031361578492, timestamp: 1559219572999 },
  { latitude: 50.75285879648641, longitude: -1.873019216236112, timestamp: 1559219726143 },
  { latitude: 50.753048866, longitude: -1.873099807, timestamp: 1559219738999 },
  { latitude: 50.7529483, longitude: -1.8729164, timestamp: 1559220030264 },
  { latitude: 50.752992863, longitude: -1.873181087, timestamp: 1559220049999 },
  { latitude: 50.753092358, longitude: -1.872973009, timestamp: 1559220287999 },
  { latitude: 50.753188628, longitude: -1.872699521, timestamp: 1559220593999 },
  { latitude: 50.753337889, longitude: -1.872520053, timestamp: 1559220603999 },
  { latitude: 50.753175145, longitude: -1.872386441, timestamp: 1559220621000 },
  { latitude: 50.753062797, longitude: -1.872609877, timestamp: 1559220795000 },
  { latitude: 50.7529462, longitude: -1.8729189, timestamp: 1559221278332 },
  { latitude: 50.7530115464828, longitude: -1.8727993970199242, timestamp: 1559221280000 },
  { latitude: 50.753191922, longitude: -1.87280135, timestamp: 1559222557000 },
  { latitude: 50.753024694, longitude: -1.872907097, timestamp: 1559226698000 },
  { latitude: 50.752931941724725, longitude: -1.8730058018513829, timestamp: 1559229010999 },
  { latitude: 50.752967048, longitude: -1.872987064, timestamp: 1559229056256 },
  { latitude: 50.753056503, longitude: -1.872882866, timestamp: 1559229442999 }
];

const routeMock = {
  name: 'ReduxMock',
  locations: locationsMock,
  date: 123123123,
  difficulty: 'easy',
  language: 'en-GB'
};
const routeMock2 = {
  name: 'ReduxMock2',
  locations: locationsMock2,
  date: 123123124,
  difficulty: 'hard',
  language: 'en-GB'
};

// Reducer
const initialState: RouteState = {
  activeRoute: undefined,
  previousRoutes: [routeMock, routeMock2]
};

export default function reducer(state: RouteState = initialState, action: RouteAction) {
  switch (action.type) {
    case SET_ROUTE_DESTINATION:
      return {
        ...state,
        activeRoute: {
          ...state.activeRoute,
          ...action.payload
        }
      };
    case FINISH_AND_SAVE_ROUTE:
      return {
        ...state,
        //previousRoutes: [...state.previousRoutes, action.payload],
        activeRoute: undefined
      };
    case DELETE_ROUTE:
      return {
        ...state,
        previousRoutes: state.previousRoutes.filter(route => route.areaId != action.payload.areaId && route.id !== action.payload.id)
      };
    default:
      return state;
  }
}

export function deleteRoutes(criteria: RouteDeletionCriteria): RouteAction {
  return {
    type: DELETE_ROUTE,
    payload: criteria
  };
}

export function setRouteDestination(destination: Location, areaId: string): RouteAction {
  return {
    type: SET_ROUTE_DESTINATION,
    payload: {
      areaId: areaId,
      destination: destination
    }
  };
}

/*export function createRouteDummy(): RouteAction {
  return {
    type: CREATE_ROUTE,
    payload: {
      name: 'Test Route 1',
      locations: [],
      date: 123123123,
      difficulty: 'easy',
      language: 'en-GB'
    }
  };
}*/

export function finishAndSaveRoute(route: Route): RouteAction {
  return {
    type: FINISH_AND_SAVE_ROUTE
  };
}
