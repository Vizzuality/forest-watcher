// @flow
import type { State } from 'types/store.types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setSelectedAreaId } from 'redux-modules/areas';
import { createReport } from 'redux-modules/reports';
import { discardActiveRoute, setRouteDestination } from 'redux-modules/routes';
import { setCanDisplayAlerts, setActiveAlerts } from 'redux-modules/alerts';
import tracker from 'helpers/googleAnalytics';
import { getContextualLayer } from 'helpers/map';
import { shouldBeConnected } from 'helpers/app';
import { getSelectedArea, activeDataset } from 'helpers/area';
import Map from 'components/map';
import { coordsArrayToObject } from 'helpers/location';

function getAreaCoordinates(areaFeature) {
  switch (areaFeature.geometry.type) {
    case 'MultiPolygon': {
      // When KML files are uploaded in the webapp they are always turned into MultiPolygons even if that multi polygon
      // only consists of a single polygon - just take the first polygon
      return areaFeature.geometry.coordinates[0][0].map(coordinate => coordsArrayToObject(coordinate));
    }
    case 'Polygon':
    default: {
      // Handle anything we don't recognise as a Polygon
      return areaFeature.geometry.coordinates[0].map(coordinate => coordsArrayToObject(coordinate));
    }
  }
}

function reconcileRoutes(activeRoute, previousRoute) {
  if (activeRoute) {
    return activeRoute;
  } else if (previousRoute) {
    return previousRoute;
  } else {
    return null;
  }
}

function mapStateToProps(state: State, ownProps: { previousRoute: Route }) {
  const area = getSelectedArea(state.areas.data, state.areas.selectedAreaId);
  let areaCoordinates = null;
  let dataset = null;
  let areaProps = null;
  if (area) {
    dataset = activeDataset(area);
    const geostore = area.geostore;
    const areaFeatures = (geostore && geostore.geojson && geostore.geojson.features[0]) || false;
    if (areaFeatures) {
      areaCoordinates = getAreaCoordinates(areaFeatures);
    }
    areaProps = {
      dataset,
      id: area.id,
      name: area.name,
      templateId: area.templateId || 'default'
    };
  }
  const { cache } = state.layers;
  const contextualLayer = getContextualLayer(state.layers);
  return {
    contextualLayer,
    areaCoordinates,
    isTracking: !!state.routes.activeRoute,
    route: reconcileRoutes(state.routes.activeRoute, ownProps.previousRoute),
    area: areaProps,
    isConnected: shouldBeConnected(state),
    isOfflineMode: state.app.offlineMode,
    coordinatesFormat: state.app.coordinatesFormat,
    canDisplayAlerts: state.alerts.canDisplayAlerts,
    basemapLocalTilePath: (area && area.id && cache.basemap && cache.basemap[area.id]) || '',
    ctxLayerLocalTilePath: area && cache[state.layers.activeLayer] ? cache[state.layers.activeLayer][area.id] : '',
    mapWalkthroughSeen: state.app.mapWalkthroughSeen
  };
}

function mapDispatchToProps(dispatch, { navigation }) {
  return {
    ...bindActionCreators(
      {
        setActiveAlerts,
        setCanDisplayAlerts,
        setSelectedAreaId
      },
      dispatch
    ),
    createReport: report => {
      dispatch(createReport(report));
      let numAlertsInReport = 0;
      if (report.latLng) {
        const parsedAlerts = JSON.parse(report.latLng);
        numAlertsInReport = parsedAlerts.length;
      }
      tracker.trackReportFlowStartedEvent(numAlertsInReport);
    },
    navigate: (routeName, params) => {
      navigation.navigate(routeName, params);
    },
    onStartTrackingRoute: (location, areaId) => {
      dispatch(setRouteDestination(location, areaId));
    },
    onCancelTrackingRoute: () => {
      dispatch(discardActiveRoute());
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
