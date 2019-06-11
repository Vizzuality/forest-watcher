// @flow

import React, { PureComponent } from 'react';
import { Text, ScrollView, Picker } from 'react-native';
import { Navigation } from 'react-native-navigation';

import styles from './styles';
import ActionButton from 'components/common/action-button';
import InputText from 'components/common/text-input';
import { deleteAllLocations, getValidLocations, stopTrackingLocation } from 'helpers/location';
import RoutePreviewImage from '../preview-image';

type Props = {
  componentId: string,
  route: Route,
  updateActiveRoute: () => void,
  finishAndSaveRoute: () => void
};

class SaveRoute extends PureComponent<Props> {
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'Save Route'
        }
      }
    };
  }

  constructor(props: Props) {
    super(props);
    Navigation.events().bindComponent(this);

    const date = Date.now();
    this.state = {
      route: {
        id: date,
        endDate: date,
        name: '',
        difficulty: 'easy',
        locations: []
      }
    };
  }

  componentDidMount() {
    getValidLocations((locations, error) => {
      if (error) {
        return;
      }

      this.setState(state => ({
        route: {
          ...state.route,
          locations: locations ?? []
        }
      }));
    });
  }

  changeRouteSaveName = newRouteSaveName => {
    this.setState(state => ({
      route: {
        ...state.route,
        name: newRouteSaveName
      }
    }));
  };

  changeRouteDifficulty = newDifficulty => {
    this.setState(state => ({
      route: {
        ...state.route,
        difficulty: newDifficulty
      }
    }));
  };

  onSaveRoutePressed = () => {
    stopTrackingLocation();
    this.props.updateActiveRoute({
      ...this.state.route
    });
    this.props.finishAndSaveRoute();
    deleteAllLocations();
    Navigation.pop(this.props.componentId);
  };

  render() {
    if (!this.props.route) {
      return null;
    }

    return (
      <ScrollView style={styles.container}>
        <RoutePreviewImage
          style={styles.headerImage}
          route={{
            ...this.props.route,
            ...this.state.route
          }}
        />
        <Text style={styles.headingText}>{'Route Name'.toUpperCase()}</Text>
        <InputText value={this.state.route.name} placeholder={'Route Name'} onChangeText={this.changeRouteSaveName} />
        <Text style={styles.headingText}>{'Difficulty'.toUpperCase()}</Text>
        <Picker
          selectedValue={this.state.route.difficulty}
          onValueChange={this.changeRouteDifficulty}
          style={styles.picker}
          itemStyle={{ height: 72 }} // Only for iOS
          mode="dropdown" // Only for Android
        >
          <Picker.Item label={'easy'} value={'easy'} style={styles.pickerItem} />
          <Picker.Item label={'medium'} value={'medium'} style={styles.pickerItem} />
          <Picker.Item label={'hard'} value={'hard'} style={styles.pickerItem} />
        </Picker>
        <ActionButton
          style={styles.actionButton}
          onPress={this.state.route.name.length > 0 ? this.onSaveRoutePressed : null}
          text={'Save Route'.toUpperCase()}
          disabled={this.state.route.name.length === 0}
          short
          noIcon
        />
      </ScrollView>
    );
  }
}
/*
label: PropTypes.string.isRequired,
  selectedValue: PropTypes.any.isRequired,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired
 */
export default SaveRoute;
