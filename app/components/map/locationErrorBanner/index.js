// @flow

import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';

import i18n from 'locales';
import styles from './styles';

const locationErrorIcon = require('assets/gpsOff.png');

import { GFWErrorPermission, GFWErrorLocation, GFWErrorLocationStale } from 'helpers/location';

type Props = {
  locationError: GFWErrorLocation | GFWErrorPermission,
  style: *
};

export default class LocationErrorBanner extends Component<Props> {
  render() {
    let message = null;

    switch (this.props.locationError) {
      case GFWErrorLocation: {
        message = i18n.t('alerts.locationDisabled');
        break;
      }
      case GFWErrorPermission: {
        message = null;
        break;
      }
      case GFWErrorLocationStale: {
        message = i18n.t('alerts.noGPS');
        break;
      }
    }

    if (!message) {
      return null;
    }

    return (
      <View style={[styles.locationErrorBanner, this.props.style]}>
        <View style={styles.locationErrorContainer}>
          <Image style={styles.locationErrorImage} source={locationErrorIcon} />
          <View style={styles.locationErrorTextContainer}>
            <Text style={styles.locationErrorText}>{message}</Text>
          </View>
        </View>
      </View>
    );
  }
}
