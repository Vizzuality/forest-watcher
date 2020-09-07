// @flow

import type { Area } from 'types/areas.types';
import type { AlertLayerSettingsType, LayerSettingsAction } from 'types/layerSettings.types';
import React, { PureComponent } from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from './styles';
import VerticalSplitRow from 'components/common/vertical-split-row';
import i18n from 'i18next';
import Theme from 'config/theme';
import { Navigation, NavigationButtonPressedEvent } from 'react-native-navigation';
import Dropdown from 'components/common/dropdown';
import { DATASETS } from 'config/constants';

type Props = {
  featureId: string,
  area: ?Area,
  alertLayerSettings: AlertLayerSettingsType,
  toggleGladAlerts: string => void,
  toggleViirsAlerts: string => void,
  setGladAlertsTimeFrame: (string, number) => LayerSettingsAction,
  setViirsAlertsTimeFrame: (string, number) => LayerSettingsAction
};

type Options = Array<{ labelKey: string, value: string }>;

class AlertLayerSettings extends PureComponent<Props> {
  static options(passProps: {}) {
    return {
      topBar: {
        title: {
          text: i18n.t('map.layerSettings.alerts')
        },
        rightButtons: [
          {
            id: 'clear',
            text: i18n.t('commonText.clear'),
            ...styles.topBarTextButton
          }
        ]
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({ buttonId }: NavigationButtonPressedEvent) {
    if (buttonId === 'clear') {
      this.clearAllOptions();
    }
  }

  clearAllOptions = () => {
    if (this.props.alertLayerSettings?.glad?.active) {
      this.props.toggleGladAlerts(this.props.featureId);
    }
    if (this.props.alertLayerSettings?.viirs?.active) {
      this.props.toggleViirsAlerts(this.props.featureId);
    }
  };

  onGladAlertsTimeFrameChanged = (value: number) => {
    this.props.setGladAlertsTimeFrame(this.props.featureId, value);
  };

  onViirsAlertsTimeFrameChanged = (value: number) => {
    this.props.setViirsAlertsTimeFrame(this.props.featureId, value);
  };

  getGladTimeFrameOptions = (): Options => {
    return DATASETS.umd_as_it_happens.filterThresholdOptions.map(value => {
      return {
        value,
        labelKey: i18n.t(
          value === 1 ? 'map.layerSettings.alertSettings.oneMonth' : 'map.layerSettings.alertSettings.manyMonths',
          { count: value }
        )
      };
    });
  };

  getViirsTimeFrameOptions = (): Options => {
    return DATASETS.viirs.filterThresholdOptions.map(value => {
      return {
        value,
        labelKey: i18n.t(
          value === 1 ? 'map.layerSettings.alertSettings.oneDay' : 'map.layerSettings.alertSettings.manyDays',
          { count: value }
        )
      };
    });
  };

  render() {
    const areaDatasets = this.props.area?.datasets?.map(dataset => dataset.slug) ?? [];
    const showViirs = areaDatasets.includes(DATASETS.viirs.id);
    const showGlad = areaDatasets.includes(DATASETS.umd_as_it_happens.id);

    const gladTimeFrame = this.props.alertLayerSettings.glad.timeFrame;
    const gladShowingDescription = i18n.t(
      gladTimeFrame === 1
        ? 'map.layerSettings.alertSettings.showingOneMonth'
        : 'map.layerSettings.alertSettings.showingManyMonths',
      { count: gladTimeFrame }
    );
    const viirsTimeFrame = this.props.alertLayerSettings.viirs.timeFrame;
    const viirsShowingDescription = i18n.t(
      viirsTimeFrame === 1
        ? 'map.layerSettings.alertSettings.showingOneDay'
        : 'map.layerSettings.alertSettings.showingManyDays',
      { count: viirsTimeFrame }
    );
    const gladActive = this.props.alertLayerSettings.glad.active;
    const viirsActive = this.props.alertLayerSettings.viirs.active;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {showGlad && (
            <React.Fragment>
              <Text style={styles.heading}>{i18n.t('map.layerSettings.alertSettings.deforestation')}</Text>
              <VerticalSplitRow
                title={i18n.t('map.layerSettings.alertSettings.glad')}
                selected={gladActive}
                onPress={() => this.props.toggleGladAlerts(this.props.featureId)}
                legend={[
                  { title: i18n.t('map.layerSettings.alertSettings.alert'), color: Theme.colors.glad },
                  { title: i18n.t('map.layerSettings.alertSettings.recent'), color: Theme.colors.recent },
                  { title: i18n.t('map.layerSettings.alertSettings.reportedOn'), color: Theme.colors.report }
                ]}
                style={styles.rowContainer}
                hideImage
                hideDivider
                smallerVerticalPadding
                largerLeftPadding
              />
              <View style={styles.selectRowContainer}>
                <Text style={[styles.smallLabel, !gladActive ? styles.inactiveHeading : {}]}>
                  {i18n.t(`map.layerSettings.alertSettings.timeFrame`)}
                </Text>
                {gladActive && <Text style={styles.bodyText}>{gladShowingDescription}</Text>}
              </View>
              <Dropdown
                label={i18n.t(`map.layerSettings.alertSettings.timeFrame`)}
                description={i18n.t(`map.layerSettings.alertSettings.timeFrameDescMonths`)}
                hideLabel
                selectedValue={gladTimeFrame}
                onValueChange={this.onGladAlertsTimeFrameChanged}
                options={this.getGladTimeFrameOptions()}
                inactive={!gladActive}
              />
            </React.Fragment>
          )}
          {showViirs && (
            <React.Fragment>
              <Text style={styles.heading}>{i18n.t('map.layerSettings.alertSettings.fires')}</Text>
              <VerticalSplitRow
                title={i18n.t('map.layerSettings.alertSettings.viirs')}
                selected={viirsActive}
                onPress={() => this.props.toggleViirsAlerts(this.props.featureId)}
                legend={[
                  { title: i18n.t('map.layerSettings.alertSettings.alert'), color: Theme.colors.viirs },
                  { title: i18n.t('map.layerSettings.alertSettings.reportedOn'), color: Theme.colors.viirsReported }
                ]}
                style={styles.rowContainer}
                hideImage
                hideDivider
                smallerVerticalPadding
                largerLeftPadding
              />
              <View style={styles.selectRowContainer}>
                <Text style={[styles.smallLabel, !viirsActive ? styles.inactiveHeading : {}]}>
                  {i18n.t(`map.layerSettings.alertSettings.timeFrame`)}
                </Text>
                {viirsActive && <Text style={styles.bodyText}>{viirsShowingDescription}</Text>}
              </View>
              <Dropdown
                label={i18n.t(`map.layerSettings.alertSettings.timeFrame`)}
                description={i18n.t(`map.layerSettings.alertSettings.timeFrameDescDays`)}
                hideLabel
                selectedValue={viirsTimeFrame}
                onValueChange={this.onViirsAlertsTimeFrameChanged}
                options={this.getViirsTimeFrameOptions()}
                inactive={!viirsActive}
              />
            </React.Fragment>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default AlertLayerSettings;
