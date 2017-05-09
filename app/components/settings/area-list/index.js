import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Theme from 'config/theme';
import styles from './styles';

const nextIcon = require('assets/next.png');

function AreaList(props) {
  const { areas, areasImages } = props;
  const areasCollection = areas.map((item, key) => {
    const area = item.attributes;
    area.id = item.id;
    const image = areasImages[area.id];

    return (
      <TouchableHighlight
        key={key}
        activeOpacity={0.5}
        underlayColor="transparent"
        onPress={() => props.onAreaPress(area.id)}
      >
        <View style={styles.item}>
          <View style={styles.imageContainer}>
            {image
              ? <Image style={styles.image} source={{ uri: image }} />
              : null
            }
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {area.name} - {item.cached ? 'cached' : 'no-cached'}
          </Text>
          <TouchableHighlight
            activeOpacity={0.5}
            underlayColor="transparent"
            onPress={() => props.onAreaPress(area.id)}
          >
            <Image style={Theme.icon} source={nextIcon} />
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    );
  });
  return (
    <View>
      { props.syncing ?
        <ActivityIndicator
          color={Theme.colors.color1}
          style={{ height: 80 }}
          size={'large'}
        /> : areasCollection
      }
    </View>
  );
}

AreaList.propTypes = {
  syncing: React.PropTypes.bool,
  areas: React.PropTypes.array,
  areasImages: React.PropTypes.object
};

export default AreaList;
