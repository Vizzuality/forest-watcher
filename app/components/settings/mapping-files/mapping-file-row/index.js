// @flow
import type { ViewStyle } from 'types/reactElementStyles.types';
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

const infoIcon = require('assets/info.png');
const refreshIcon = require('assets/refreshLayer.png');
const downloadIcon = require('assets/downloadGrey.png');
const downloadedIcon = require('assets/downloaded.png');
const checkboxOff = require('assets/checkbox_off.png');
const checkboxOn = require('assets/checkbox_on.png');
const deleteIcon = require('assets/settingsDelete.png');
const renameIcon = require('assets/settingsEdit.png');

type Props = {
  downloadable: boolean,
  downloaded?: boolean,
  deletable: boolean,
  image?: ?string | ?number,
  inEditMode: boolean,
  onDeletePress: () => void,
  onDownloadPress?: ?() => void,
  onPress?: ?() => void,
  onInfoPress?: () => void,
  onRenamePress?: () => void,
  refreshable: boolean,
  renamable: boolean,
  selected?: ?boolean,
  style?: ?ViewStyle,
  subtitle?: ?string,
  title: string
};

export default class MappingFileRow extends Component<Props> {
  renderIcons = () => {
    if (this.props.inEditMode) {
      return (
        <React.Fragment>
          {this.props.renamable && this.renderIcon(renameIcon, this.props.onRenamePress)}
          {this.props.deletable && this.renderIcon(deleteIcon, this.props.onDeletePress)}
        </React.Fragment>
      );
    }
    if (this.props.selected === false) {
      return this.renderIcon(checkboxOff, this.props.onPress);
    } else if (this.props.selected === true) {
      return this.renderIcon(checkboxOn, this.props.onPress);
    }

    return (
      <React.Fragment>
        {this.props.onInfoPress && this.renderIcon(infoIcon, this.props.onInfoPress)}
        {this.renderIcon(
          this.props.downloaded && this.props.refreshable ? refreshIcon : this.props.downloadable ? downloadIcon : null,
          this.props.onDownloadPress
        )}
      </React.Fragment>
    );
  };

  renderIcon = (icon, onPress: ?() => void) => {
    const Touchable = Platform.select({
      android: TouchableNativeFeedback,
      ios: TouchableHighlight
    });

    return (
      <Touchable
        disabled={onPress == null}
        onPress={onPress}
        background={Platform.select({
          // hide ripple as hitbox is wider than icon
          android: TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0)'),
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
      <View style={styles.item}>
        <View style={styles.imageContainer}>
          {this.props.image && <ImageBackground resizeMode={'cover'} style={styles.image} source={this.props.image} />}
        </View>
        <View style={styles.contentContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {this.props.title}
          </Text>
          {!!this.props.subtitle && (
            <View style={styles.subtitleContainer}>
              <Text style={styles.title}>{this.props.subtitle}</Text>
            </View>
          )}
        </View>
        <View style={styles.iconsContainer}>{this.renderIcons()}</View>
      </View>
    );
  }
}
