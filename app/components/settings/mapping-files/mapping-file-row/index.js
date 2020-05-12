// @flow

import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableHighlight,
  Image,
  ImageBackground,
  Platform,
  TouchableNativeFeedback
} from 'react-native';
import styles from './styles';

import Theme from 'config/theme';

const infoIcon = require('assets/info.png');
const downloadIcon = require('assets/downloadGrey.png');
const checkboxOff = require('assets/checkbox_off.png');
const checkboxOn = require('assets/checkbox_on.png');

type ViewProps = React.ElementProps<typeof View>;
type ViewStyleProp = $PropertyType<ViewProps, 'style'>;

type Props = {
  image?: ?string | ?number,
  onDownloadPress?: () => void,
  onPress?: ?() => void,
  onInfoPress?: () => void,
  selected?: ?boolean,
  style?: ?ViewStyleProp,
  subtitle?: ?string,
  title: string
};

export default class MappingFileRow extends Component<Props> {
  renderIcons = () => {
    if (this.props.selected === false) {
      return this.renderIcon(checkboxOff, this.props.onPress);
    } else if (this.props.selected === true) {
      return this.renderIcon(checkboxOn, this.props.onPress);
    }
    if (!this.props.onDownloadPress) {
      return this.renderIcon(infoIcon, this.props.onPress);
    }
    return (
      <React.Fragment>
        {this.renderIcon(infoIcon, this.props.onPress)}
        {this.renderIcon(downloadIcon, this.props.onPress)}
      </React.Fragment>
    );
  };

  renderIcon = (icon, onPress) => {
    const Touchable = Platform.select({
      android: TouchableNativeFeedback,
      ios: TouchableHighlight
    });
    return (
      <Touchable
        onPress={onPress}
        background={Platform.select({
          android: TouchableNativeFeedback.Ripple(Theme.background.secondary),
          ios: undefined
        })}
        underlayColor={Platform.select({
          android: undefined,
          ios: 'white'
        })}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Image source={icon} />
        </View>
      </Touchable>
    );
  };

  render() {
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="transparent"
        onPress={this.props.onPress}
        style={this.props.style}
      >
        <View style={styles.item}>
          <View style={styles.imageContainer}>
            {this.props.image && (
              <ImageBackground resizeMode={'cover'} style={styles.image} source={this.props.image} />
            )}
          </View>
          <View style={styles.contentContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {this.props.title}
            </Text>
            {!!this.props.subtitle && (
              <View style={{ justifyContent: 'flex-end' }}>
                <Text style={styles.title}>{this.props.subtitle}</Text>
              </View>
            )}
          </View>
          <View style={styles.iconsContainer}>{this.renderIcons()}</View>
        </View>
      </TouchableHighlight>
    );
  }
}
