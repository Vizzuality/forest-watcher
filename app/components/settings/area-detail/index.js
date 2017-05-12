import React, { Component } from 'react';
import {
  Alert,
  View,
  Image
} from 'react-native';
import tracker from 'helpers/googleAnalytics';

import I18n from 'locales';
import Theme from 'config/theme';
import ActionButton from 'components/common/action-button';
import styles from './styles';

class AreaDetail extends Component {
  static navigatorStyle = {
    navBarTextColor: Theme.colors.color1,
    navBarButtonColor: Theme.colors.color1,
    topBarElevationShadowEnabled: false,
    navBarBackgroundColor: Theme.background.main
  };

  componentDidMount() {
    tracker.trackScreenView('AreaDetail');
  }

  handleDeleteArea = () => {
    if (this.props.isConnected) {
      this.props.deleteArea(this.props.area.id);
      this.props.navigator.pop({
        animated: true
      });
    } else {
      Alert.alert(
        I18n.t('commonText.connectionRequiredTitle'),
        I18n.t('commonText.connectionRequired'),
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  }

  render() {
    const imageUrl = this.props.imageUrl !== undefined ? this.props.imageUrl : null;
    return (
      <View style={styles.area}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: imageUrl || 'placeholder.png' }} />
        </View>
        <View style={styles.buttonContainer}>
          <ActionButton onPress={this.handleDeleteArea} delete text={I18n.t('areaDetail.delete')} />
        </View>
      </View>
    );
  }
}

AreaDetail.propTypes = {
  imageUrl: React.PropTypes.string,
  deleteArea: React.PropTypes.func,
  isConnected: React.PropTypes.func,
  navigator: React.PropTypes.object,
  area: React.PropTypes.object
};

export default AreaDetail;
