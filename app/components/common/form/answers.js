import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView
} from 'react-native';
import Theme from 'config/theme';
import I18n from 'locales';

import ActionButton from 'components/common/action-button';
import Answer from 'components/common/form/answer/answer';
import ImageCarousel from 'components/common/image-carousel';
import withDraft from './withDraft';
import styles from './styles';

const deleteIcon = require('assets/delete_red.png');

class Answers extends Component {
  static navigatorStyle = {
    navBarTextColor: Theme.colors.color1,
    navBarButtonColor: Theme.colors.color1,
    topBarElevationShadowEnabled: false,
    navBarBackgroundColor: Theme.background.main
  };

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    results: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        question: React.PropTypes.object,
        answers: React.PropTypes.array
      })
    ),
    form: React.PropTypes.string.isRequired,
    finish: React.PropTypes.func.isRequired
  };

  onPressSave = () => {
    const { form, finish, navigator } = this.props;
    finish(form);
    navigator.popToRoot({ animate: true });
  }

  onEdit = (result, index) => {
    const { navigator, form } = this.props;
    const isFeedback = name => (name === 'daily' || name === 'weekly');
    const screen = isFeedback(form) ? 'ForestWatcher.Feedback' : 'ForestWatcher.NewReport';
    const disableDraft = isFeedback(form);
    navigator.showModal({
      screen,
      passProps: {
        form,
        title: 'Report',
        screen,
        step: index,
        disableDraft,
        editMode: true
      }
    });
  }

  render() {
    const { results } = this.props;
    const regularAnswers = results.filter(({ question }) => question.type !== 'blob');
    const images = results.filter(({ question }) => question.type === 'blob')
      .map(image => ({ id: image.question.Id, uri: image.answers[0] }))
      .filter(image => !!image.uri);
    const imageActions = [{
      callback: (id) => console.warn(id), // TODO: delete the image
      icon: deleteIcon
    }];
    return (
      <View style={styles.answersContainer}>
        <ScrollView>
          {
            regularAnswers.map((result) => (
              <Answer
                id={result.question.Id}
                key={result.question.Id}
                answers={result.answers}
                question={result.question.label}
                onEditPress={() => this.onEdit(result, result.question.questionNumber)}
              />
            ))
          }
          {images.length > 0 &&
            <View style={styles.picturesContainer}>
              <Text style={styles.answersText}>Pictures</Text>
              <ImageCarousel images={images} actions={imageActions} />
            </View>
          }
          <View style={styles.buttonSaveContainer}>
            <ActionButton
              onPress={this.onPressSave}
              text={I18n.t('commonText.save')}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withDraft(Answers);
