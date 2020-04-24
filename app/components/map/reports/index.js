// @flow
import React, { Component } from 'react';

import { View } from 'react-native';
import Theme from 'config/theme';
import { mapboxStyles } from './styles';
import MapboxGL from '@react-native-mapbox-gl/maps';
import i18n from 'i18next';
import moment from 'moment';
import type { FormattedReport, FormattedReports } from 'containers/reports';
import { REPORTS } from 'config/constants';

type ReportLayerSettings = {
  layerIsActive: false,
  myReportsActive: true,
  importedReportsActive: true
};

type Props = {
  featureId: string,
  myReports: FormattedReports,
  importedReports: FormattedReports,
  reportLayerSettings: ReportLayerSettings,
  onShapeSourcePressed?: () => void
};

export default class Reports extends Component<Props> {
  getReportIcon = (isImported: boolean, isSelected: boolean) => {
    let iconName = isImported ? 'importedReport' : 'report';
    if (isSelected) {
      iconName += 'Selected';
    }
    return iconName;
  };

  reportToFeature = (report: FormattedReport) => {
    const properties = {
      icon: this.getReportIcon(report.imported, false),
      date: moment(report.date),
      type: 'report',
      name: i18n.t('map.layerSettings.report'),
      imported: report.imported
    };
    const position = report.userPosition
      .split(',')
      .reverse()
      .map(a => Number(a));
    return MapboxGL.geoUtils.makePoint(position, properties);
  };

  renderReports = (reports: Array<FormattedReport>, imported: boolean) => {
    if (!reports) {
      return null;
    }
    // remove reports with no location
    reports = reports.filter(report => report.userPosition !== REPORTS.noGpsPosition);
    const reportFeatureCollection = reports
      ? MapboxGL.geoUtils.makeFeatureCollection(reports.map(this.reportToFeature))
      : null;
    const circleColor = imported ? Theme.colors.importedReport : Theme.colors.report;
    const onPress = this.props.onShapeSourcePressed || null;
    const key = imported ? 'importedReport' : 'myReport';
    return (
      <View>
        <MapboxGL.ShapeSource
          id={key + 'Source'}
          cluster
          clusterRadius={40}
          shape={reportFeatureCollection}
          onPress={onPress}
        >
          <MapboxGL.SymbolLayer id={key + 'PointCount'} style={mapboxStyles.clusterCount} />
          <MapboxGL.CircleLayer
            id={key + 'ClusteredPoints'}
            belowLayerID={key + 'PointCount'}
            filter={['has', 'point_count']}
            style={{ ...mapboxStyles.clusteredPoints, circleColor }}
          />
          <MapboxGL.SymbolLayer
            id={key + 'Layer'}
            filter={['!', ['has', 'point_count']]}
            style={mapboxStyles.reportIcon}
          />
        </MapboxGL.ShapeSource>
      </View>
    );
  };

  render() {
    const { myReportsActive, importedReportsActive, layerIsActive } = this.props.reportLayerSettings;
    if (!layerIsActive) {
      return null;
    }
    return (
      <View>
        <MapboxGL.Images
          images={{
            // Add all images to map so we cn dynamically change the icon for reports
            report: require('assets/alertMapIcons/myReportMapIcon.png'),
            reportSelected: require('assets/alertMapIcons/myReportSelectedMapIcon.png'),
            importedReport: require('assets/alertMapIcons/importedReportMapIcon.png'),
            importedReportSelected: require('assets/alertMapIcons/importedReportSelectedMapIcon.png')
          }}
        />
        {myReportsActive && this.renderReports(this.props.myReports, false)}
        {importedReportsActive && this.renderReports(this.props.importedReports, true)}
      </View>
    );
  }
}
