import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native';

import Theme from 'config/theme';
import I18n from 'locales';
import styles from './styles';

const backIcon = require('assets/previous.png');
const backIconWhite = require('assets/previous_white.png');
const layersIcon = require('assets/layers.png');

class SetupHeader extends Component {

  onContextualLayersPress = () => {
    this.props.navigator.toggleDrawer({
      side: 'right',
      animated: true
    });
  }

  render() {
    const { page, showBack, onBackPress, title } = this.props;
    const showBackStyle = showBack ? '' : styles.margin;
    const titleColor = page === 1 ? { color: 'white' } : { color: Theme.fontColors.main };
    return (
      <View style={styles.container}>
        <View style={styles.arrowText}>
          {showBack &&
            <TouchableHighlight
              style={styles.backIcon}
              onPress={onBackPress}
              activeOpacity={0.5}
              underlayColor="transparent"
            >
              <Image style={Theme.icon} source={page === 1 ? backIconWhite : backIcon} />
            </TouchableHighlight>
          }
          <Text style={[styles.title, showBackStyle, titleColor]}>
            {title}
          </Text>
        </View>
        {page === 0 &&
        <TouchableHighlight
          style={styles.rightButton}
          onPress={this.onContextualLayersPress}
          activeOpacity={0.5}
          underlayColor="transparent"
        >
          <Text style={styles.logout}>Logout</Text>
        </TouchableHighlight>
        }
        {page === 1 && !showBack &&
          <TouchableHighlight
            style={styles.rightButton}
            onPress={this.onContextualLayersPress}
            activeOpacity={0.5}
            underlayColor="transparent"
          >
            <Image
              source={layersIcon}
            />
          </TouchableHighlight>
        }
      </View>
    );
  }
}

SetupHeader.propTypes = {
  title: PropTypes.string,
  navigator: PropTypes.object,
  showBack: PropTypes.bool,
  onBackPress: (props, propName, componentName) => {
    if (props.showBack && !props[propName]) {
      return new Error(`${I18n.t('setupHeader.errorFirst')} ${propName}
      ${I18n.t('setupHeader.errorSecond')}  ${componentName}. ${I18n.t('setupHeader.errorThird')}`);
    }
    return null;
  },
  page: PropTypes.number.isRequired
};

export default SetupHeader;
