// @flow

import React, { Component } from 'react';

import { View, Text, TouchableHighlight, TouchableOpacity, Image, ImageBackground } from 'react-native';
import styles from './styles';
import Theme from 'config/theme';

import SettingsButton from 'components/common/settings-button';
import Callout from 'components/common/callout';

const nextIcon = require('assets/next.png');
const checkboxOff = require('assets/checkbox_off.png');
const checkboxOn = require('assets/checkbox_on.png');
const downloadIcon = require('assets/download.png');

type ViewProps = React.ElementProps<typeof View>;
type ViewStyleProp = $PropertyType<ViewProps, 'style'>;

type Props = {
  downloadCalloutBody?: ?boolean,
  downloadCalloutVisible?: ?boolean,
  downloadCalloutTitle?: ?string,
  downloadVisible?: ?boolean,
  imageSrc?: ?string | ?number,
  onDownloadPress: void => void,
  onPress: void => void,
  onSettingsPress: void => void,
  renderImageChildren?: (?void) => React.Node,
  selected?: ?boolean,
  style?: ?ViewStyleProp,
  subtitle?: ?string,
  title: string,
  backgroundImageResizeMode?: ?string
};

export default class VerticalSplitRow extends Component<Props> {
  render() {
    const { selected, downloadVisible } = this.props;
    const icon = selected != null ? (selected ? checkboxOn : checkboxOff) : nextIcon;
    const inShareMode = selected === true || selected === false;

    return (
      <TouchableHighlight
        activeOpacity={0.5}
        disabled={this.props.onPress == null}
        underlayColor="transparent"
        onPress={this.props.onPress}
        style={this.props.style}
      >
        <View style={styles.item}>
          <View style={styles.imageContainer}>
            {!!this.props.imageSrc && (
              <ImageBackground
                resizeMode={this.props.backgroundImageResizeMode || "cover"}
                style={styles.image}
                source={typeof this.props.imageSrc === 'string' ? { uri: this.props.imageSrc } : this.props.imageSrc}
              >
                {this.props.renderImageChildren && this.props.renderImageChildren()}
              </ImageBackground>
            )}
            {downloadVisible && (
              <Callout
                body={this.props.downloadCalloutBody}
                offset={4}
                title={this.props.downloadCalloutTitle}
                visible={this.props.downloadCalloutVisible}
              >
                <TouchableOpacity onPress={this.props.onDownloadPress} style={styles.downloadButton}>
                  <Image source={downloadIcon} />
                </TouchableOpacity>
              </Callout>
            )}
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.nameContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {this.props.title} 
                </Text>
                <Image style={styles.disclosureIndicator} source={icon} />
              </View>
               {!!this.props.subtitle && <Text style={styles.subtitle}>{this.props.subtitle}</Text>}
            </View>
            <SettingsButton disabled={inShareMode || this.props.onSettingsPress == null} onPress={this.props.onSettingsPress} style={styles.settingsButton} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
