// @flow
import type { Alert, AlertDatasetConfig } from 'types/common.types';

import React, { Component } from 'react';

import { mapboxStyles } from './styles';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { type FeatureCollection, type Point, featureCollection, point } from '@turf/helpers';
import i18n from 'i18next';
import _ from 'lodash';
import moment from 'moment';
import queryAlerts from 'helpers/alert-store/queryAlerts';
import generateUniqueID from 'helpers/uniqueId';
import { DATASETS } from 'config/constants';

type AlertProperties = {|
  type: 'alert',
  clusterId: 'reported' | 'recent' | 'other',
  name: string,
  date: number,
  icon: string,
  reported: boolean
|};

type Props = {|
  +areaId?: ?string,
  +isActive: boolean,
  +onPress?: ?() => any,
  +slug: 'umd_as_it_happens' | 'viirs',
  +reportedAlerts: Array<string>,
  +timeframe: number,
  +timeframeUnit: 'days' | 'months'
|};

type State = {|
  +recentAlerts: FeatureCollection<Point>,
  +reportedAlerts: FeatureCollection<Point>,
  +otherAlerts: FeatureCollection<Point>
|};

/**
 * Displays the alerts corresponding to the specified dataset and other criteria
 */
export default class AlertDataset extends Component<Props, State> {
  activeRequestId: ?string;
  datasets: {
    [string]: AlertDatasetConfig & {
      name: string,
      recencyTimestamp: number
    }
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      recentAlerts: featureCollection([]),
      reportedAlerts: featureCollection([]),
      otherAlerts: featureCollection([])
    };

    const now = moment();
    this.datasets = _.mapValues(DATASETS, config => ({
      name: i18n.t(config.nameKey),
      recencyTimestamp: now.subtract(config.recencyThreshold, 'days').valueOf()
    }));
  }

  componentDidMount() {
    this._loadAlertsFromDb();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      this.props.slug !== prevProps.slug ||
      this.props.isActive !== prevProps.isActive ||
      this.props.timeframe !== prevProps.timeframe ||
      this.props.timeframeUnit !== prevProps.timeframeUnit ||
      this.props.areaId !== prevProps.areaId ||
      this.props.reportedAlerts !== prevProps.reportedAlerts
    ) {
      this._loadAlertsFromDb();
    }
  }

  /**
   * Updates component state so that it holds the alerts from the local DB matching the constraints imposed by the
   * component props
   */
  _loadAlertsFromDb = async () => {
    const { areaId, isActive, slug, timeframe, timeframeUnit } = this.props;

    // Reset the data in state before retrieving the updated data
    this.setState({
      recentAlerts: featureCollection([]),
      reportedAlerts: featureCollection([]),
      otherAlerts: featureCollection([])
    });

    if (!isActive) {
      return;
    }

    try {
      const requestId = generateUniqueID();
      this.activeRequestId = requestId;
      const alerts = await queryAlerts({
        areaId: areaId ?? undefined,
        dataset: slug,
        timeAgo: { max: timeframe, unit: timeframeUnit },
        distinctLocations: true
      });
      const updatedAlertState = this._createFeaturesForAlerts(alerts);

      if (requestId !== this.activeRequestId) {
        return;
      }

      this.setState({
        ...updatedAlertState
      });
    } catch (err) {
      console.warn(err);
    }
  };

  _getAlertProperties = (alert: Alert): AlertProperties => {
    const { name, recencyTimestamp, iconPrefix } = this.datasets[alert.slug];
    const reported = this.props.reportedAlerts.includes(`${alert.long}${alert.lat}`);
    const isRecent = alert.date > recencyTimestamp;
    const iconSuffix = this._getAlertIconSuffix(isRecent, reported, false);
    const icon = `${iconPrefix}${iconSuffix}`;
    return {
      icon,
      date: alert.date,
      type: 'alert',
      name,
      reported,
      clusterId: reported ? 'reported' : isRecent ? 'recent' : 'other'
    };
  };

  _getAlertIconSuffix = (recent: boolean, reported: boolean, selected: boolean) => {
    let suffix = '';
    if (reported) {
      suffix += 'Reported';
    } else if (recent) {
      suffix += 'Recent';
    }

    if (selected) {
      suffix += 'Selected';
    }
    return suffix;
  };

  _createFeaturesForAlerts = (alerts: Array<Alert>): State => {
    const alertFeatures = alerts.map((alert: Alert) => {
      const properties = this._getAlertProperties(alert);
      return point([alert.long, alert.lat], properties);
    });
    const alertsGroupedByCluster = _.groupBy(alertFeatures, feature => feature.properties?.['cluster']);
    return {
      recentAlerts: featureCollection(alertsGroupedByCluster.recent ?? []),
      reportedAlerts: featureCollection(alertsGroupedByCluster.reported ?? []),
      otherAlerts: featureCollection(alertsGroupedByCluster.other ?? [])
    };
  };

  render() {
    const { isActive, slug } = this.props;

    if (!isActive) {
      return null;
    }

    const { recentAlerts, reportedAlerts, otherAlerts } = this.state;
    const { color, colorReported, colorRecent } = this.datasets[slug] ?? {};

    return (
      <>
        {this.renderCluster('reportedAlerts', colorReported, reportedAlerts)}
        {this.renderCluster('recentAlerts', colorRecent, recentAlerts)}
        {this.renderCluster('otherAlerts', color, otherAlerts)}
      </>
    );
  }

  renderCluster = (clusterName: string, clusterColor: any, alerts: FeatureCollection<Point>) => {
    const idShapeSource = `${clusterName}Source`;
    const idClusterCountSymbolLayer = `${clusterName}PointCount`;
    const idClusterCircleLayer = `${clusterName}ClusteredPoints`;
    const idAlertSymbolLayer = `${clusterName}AlertLayer`;
    return (
      <MapboxGL.ShapeSource
        id={idShapeSource}
        cluster
        clusterRadius={120}
        clusterMaxZoomLevel={15}
        shape={alerts}
        onPress={this.props.onPress}
      >
        <MapboxGL.SymbolLayer id={idClusterCountSymbolLayer} style={mapboxStyles.clusterCount} />
        <MapboxGL.CircleLayer
          id={idClusterCircleLayer}
          belowLayerID={idClusterCountSymbolLayer}
          filter={['has', 'point_count']}
          style={{ ...mapboxStyles.clusteredPoints, circleColor: clusterColor }}
        />
        <MapboxGL.SymbolLayer
          id={idAlertSymbolLayer}
          filter={['!', ['has', 'point_count']]}
          style={mapboxStyles.alert}
        />
      </MapboxGL.ShapeSource>
    );
  };
}
