import React from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Theme from 'config/theme';
import styles from './styles';

const nextIcon = require('assets/next.png');

function AreaList(props) {
  const { areas } = props;
  if (!areas) return null;

  return (
    <View>
      {areas.map((area, key) => (
        <TouchableHighlight
          key={key}
          activeOpacity={0.5}
          underlayColor="transparent"
          onPress={() => props.onAreaPress(area.id, area.name)}
        >
          <View style={styles.item}>
            <View style={styles.imageContainer}>
              {area.image
                ? <Image style={styles.image} source={{ uri: area.image }} />
                : null
              }
            </View>
            <Text style={styles.title} numberOfLines={2}> {area.name} </Text>
            <TouchableHighlight
              activeOpacity={0.5}
              underlayColor="transparent"
              onPress={() => props.onAreaPress(area.id, area.name)}
            >
              <Image style={Theme.icon} source={nextIcon} />
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      ))}
    </View>
  );
}

AreaList.propTypes = {
  areas: React.PropTypes.array
};

export default AreaList;
