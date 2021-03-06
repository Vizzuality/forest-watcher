// @flow
import type { Route } from 'types/routes.types';
import type { ComponentProps, Dispatch, State } from 'types/store.types';

import { connect } from 'react-redux';

import SaveRoute from 'components/routes/save-route';
import { finishAndSaveRoute, updateActiveRoute } from 'redux-modules/routes';
import { copyLayerSettings, enableRoutesLayer, showSavedRoute } from 'redux-modules/layerSettings';

import { trackRouteFlowEvent } from 'helpers/analytics';

type OwnProps = {|
  +componentId: string
|};

function mapStateToProps(state: State) {
  return {
    route: state.routes.activeRoute
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    updateActiveRoute: (route: $Shape<Route>, areaId: string) => {
      dispatch(updateActiveRoute(route));
      dispatch(copyLayerSettings(areaId, route.id));
    },
    finishAndSaveRoute: async (routeId: string, areaId: string) => {
      trackRouteFlowEvent('saved');
      await dispatch(finishAndSaveRoute());
      await dispatch(enableRoutesLayer(areaId));
      await dispatch(showSavedRoute(areaId, routeId));
    }
  };
}

type PassedProps = ComponentProps<OwnProps, typeof mapStateToProps, typeof mapDispatchToProps>;
export default connect<PassedProps, OwnProps, _, _, State, Dispatch>(
  mapStateToProps,
  mapDispatchToProps
)(SaveRoute);
