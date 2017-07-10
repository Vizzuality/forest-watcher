import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  View
} from 'react-native';
import Row from 'components/common/row';
import DatasetOptions from 'components/settings/area-detail/alert-system/dataset-options';

import I18n from 'locales';
import Theme from 'config/theme';
import styles from './styles';

function loadingState() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator
        color={Theme.colors.color1}
        style={{ height: 80 }}
        size="large"
      />
    </View>
  );
}

function noAlerts() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Row text={I18n.t('areaDetail.noAlerts')} />
      </View>
    </View>
  );
}

class AlertSystem extends Component {
  render() {
    const { datasets, id } = this.props.area;

    if (!datasets) return loadingState();
    if (typeof datasets === 'undefined' || datasets.length === 0) return noAlerts();
    return (
      <View style={styles.container}>
        {datasets.map((dataset, i) => {
          const onDatasetValueChange = (value) => {
            this.props.setAreaDatasetStatus(id, dataset.slug, value);
          };
          return (
            <View key={i}>
              <Row text={dataset.name} value={dataset.active} onValueChange={onDatasetValueChange} />
              {dataset.active
                ? <DatasetOptions
                  id={id}
                  dataset={dataset}
                  updateDate={this.props.updateDate}
                  setAreaDatasetCache={this.props.setAreaDatasetCache}
                />
                : null
              }
            </View>
          );
        })}
      </View>
    );
  }
}

AlertSystem.propTypes = {
  area: PropTypes.shape({
    id: PropTypes.string.isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired
      }).isRequired,
    )
  }).isRequired,
  setAreaDatasetStatus: PropTypes.func.isRequired,
  updateDate: PropTypes.func.isRequired,
  setAreaDatasetCache: PropTypes.func.isRequired
};

export default AlertSystem;
