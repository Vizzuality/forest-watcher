import 'react-native';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { combinedReducer } from 'combinedReducer';
import appReducer, {
  retrySync,
  setAppSynced,
  setCoordinatesFormat,
  setOfflineMode,
  setPristineCacheTooltip,
  showNotConnectedNotification,
  syncApp,
  updateApp
} from 'redux-modules/app';

describe('Redux App Module', () => {
  it('Initial reducer state', () => {
    expect(appReducer(undefined, { type: 'NONE' })).toMatchSnapshot();
  });

  describe('Simple Actions: snapshot and reducer test', () => {
    // todo: use snapshot-diff snapshot with reducer initial state!!
    // Snapshot tests the action object and the reducer state
    function simpleActionTest(action) {
      expect(action).toMatchSnapshot();
      expect(appReducer(undefined, action)).toMatchSnapshot();
    }

    it('setAppSynced', () => {
      simpleActionTest(setAppSynced(true));
      simpleActionTest(setAppSynced(false));
    });

    it('setCoordinatesFormat', () => {
      simpleActionTest(setCoordinatesFormat('decimal'));
      simpleActionTest(setCoordinatesFormat('degrees'));
    });

    it('setOfflineMode', () => {
      simpleActionTest(setOfflineMode(true));
      simpleActionTest(setOfflineMode(false));
    });

    it('setPristineCacheTooltip', () => {
      simpleActionTest(setPristineCacheTooltip(true));
      simpleActionTest(setPristineCacheTooltip(false));
    });

    it('updateApp', () => {
      simpleActionTest(updateApp());
    });
  });

  describe('Redux Snapshot Thunk Actions', () => {
    let initialStoreState;
    let configuredStore;
    let store;

    beforeAll(() => {
      // create store
      initialStoreState = combinedReducer(undefined, { type: 'NONE' });
      // initialStoreState = { app: appReducer(undefined, { type: 'NONE' }) };
      configuredStore = configureStore([thunk]);
    });

    beforeEach(() => {
      // reset store state and clears actions
      store = configuredStore(initialStoreState);
    });

    // if changing this method, change in other tests too
    function mockDispatchAction(state, action, test = true) {
      const newStore = configuredStore({ app: state });
      newStore.dispatch(action);
      const resolvedActions = newStore.getActions();
      let newState = state;
      // should only be one but the loop is used for future changes and so all tests conform.
      resolvedActions.forEach(resolvedAction => {
        newState = appReducer(newState, resolvedAction);
      });
      if (test) {
        expect(resolvedActions).toMatchSnapshot();
        expect(newState).toMatchSnapshot();
      }
      return newState;
    }

    it('retrySync', () => {
      store.dispatch(retrySync());
      expect(store.getActions()).toMatchSnapshot();
    });

    // it('retrySync222', () => { //todo?
    //   const newState = appReducer(undefined, { type: 'NONE' });
    //   mockDispatchAction(newState, retrySync());
    // });

    it('syncApp', () => {
      store.dispatch(syncApp());
      expect(store.getActions()).toMatchSnapshot();
    });

    it('showNotConnectedNotification', () => {
      store.dispatch(showNotConnectedNotification());
      expect(store.getActions()).toMatchSnapshot();
    });

    // it('syncApp full test', () => {
    //   store.dispatch(syncApp());
    //   // todo test with user.loggedIn == true
    //   expect(store.getActions()).toMatchSnapshot();
    // });

    it('showNotConnectedNotification full test', () => {
      // Although this is super cool, changing the steps (actions) will make
      // the snapshot diff very unreadable (but still very helpful).
      let newState = appReducer(undefined, { type: 'NONE' }); // only models the app module state object
      // todo: can for loop actions:
      newState = mockDispatchAction(newState, showNotConnectedNotification());
      newState = mockDispatchAction(newState, setOfflineMode(true));
      mockDispatchAction(newState, showNotConnectedNotification());
    });
  });
});
