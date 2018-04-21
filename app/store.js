import * as reducers from 'redux-modules';
import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import offline from 'offline';
import thunk from 'redux-thunk';
import { SAVE_LAST_ACTIONS } from 'redux-modules/app';
import createSagaMiddleware from 'redux-saga';

import { getAlertsOnAreasCommit } from './sagas/sync';

import Reactotron, { trackGlobalErrors, networking, openInEditor, asyncStorage } from 'reactotron-react-native'; // eslint-disable-line
import { reactotronRedux } from 'reactotron-redux'; // eslint-disable-line

const authMiddleware = ({ getState }) => next => action => (
  action.type && action.type.endsWith('REQUEST') ? next({ ...action, auth: getState().user.token }) : next(action)
);

const lastActionsMiddleware = ({ dispatch }) => next => action => {
  if (action.type !== SAVE_LAST_ACTIONS || action.type.startsWith('user/')) {
    dispatch({ type: SAVE_LAST_ACTIONS, payload: action });
  }
  return next(action);
};

export const sagaMiddleware = createSagaMiddleware();

const middlewareList = [thunk, authMiddleware, sagaMiddleware];
if (!__DEV__) middlewareList.push(lastActionsMiddleware);


const reducer = combineReducers(reducers);

function createAppStore(startApp) {
  const {
    middleware: offlineMiddleware,
    enhanceReducer,
    enhanceStore
  } = offline({ persistCallback: startApp });
  const middleware = applyMiddleware(...middlewareList, offlineMiddleware);
  if (__DEV__) {
    Reactotron
      .configure()
      .use(reactotronRedux())
      .use(trackGlobalErrors())
      .use(networking())
      .use(openInEditor())
      .use(asyncStorage())
      .connect()
      .clear();
    window.tron = Reactotron; // eslint-disable-line
    return Reactotron.createStore(enhanceReducer(reducer), compose(middleware, enhanceStore));
  }
  return createStore(enhanceReducer(reducer), compose(middleware, enhanceStore));
}

createAppStore.runSagas = () => sagaMiddleware.run(getAlertsOnAreasCommit);


export default createAppStore;
