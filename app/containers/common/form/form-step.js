import { connect } from 'react-redux';
import { getBtnTextByType, parseQuestion, getForm, getAnswers } from 'helpers/forms';
import FormStep from 'components/common/form/form-step';

function getNextStep({ currentQuestion, questions, answers }) {
  let next = 1;
  if (currentQuestion < questions.length - 1) {
    for (let i = currentQuestion + 1, qLength = questions.length; i < qLength; i++) {
      const nextConditions = questions[i].conditions;
      const nextHasConditions = nextConditions && nextConditions.length > 0;
      if (!nextHasConditions || (answers[nextConditions[0].name] === nextConditions[0].value)) {
        break;
      }
      next += 1;
    }
    return currentQuestion + next;
  }
  return null;
}

function getNextCallback({ currentQuestion, questions, answers, navigator, form, screen, title, finish }) {
  const nextStep = getNextStep({ currentQuestion, questions, answers });
  if (nextStep && currentQuestion < questions.length - 1) {
    return () => navigator.push({
      title,
      screen,
      passProps: {
        form,
        title,
        screen,
        step: nextStep
      }
    });
  }
  return () => {
    navigator.push({
      title: 'Review report',
      screen: 'ForestWatcher.Answers',
      backButtonHidden: true,
      passProps: {
        form,
        finish
      }
    });
  };
}

function getEditNextCallback({ currentQuestion, questions, answers, navigator, form, screen, title }) {
  const nextStep = getNextStep({ currentQuestion, questions, answers });
  tron.log(nextStep);
  tron.log(currentQuestion);
  if (nextStep && currentQuestion < questions.length - 1) {
    const nextQuestionName = questions[nextStep].name;
    if (typeof answers[nextQuestionName] === 'undefined') {
      return () => navigator.push({
        title,
        screen,
        passProps: {
          editMode: true,
          form,
          title,
          screen,
          step: nextStep
        }
      });
    }
  }
  return () => {
    navigator.dismissModal();
  };
}

function mapStateToProps(state, { form, index, questionsToSkip, finish, title, screen, navigator, editMode }) {
  const storeForm = getForm(state, form);
  const questions = storeForm.questions;
  const question = questions && questions[index];
  const parsedQuestion = question && parseQuestion({ question, form: storeForm }, state.app.language);
  const answers = getAnswers(state.form, form);
  const answer = typeof answers[question.name] !== 'undefined' || null;
  const nextText = !answer && question.required ? getBtnTextByType(question.type) : 'commonText.next';
  const getCallback = editMode ? getEditNextCallback : getNextCallback;
  return {
    form,
    questionsToSkip,
    question: parsedQuestion,
    answer,
    navigator,
    next: {
      text: nextText,
      callback: getCallback({
        finish,
        navigator,
        form,
        screen,
        title,
        currentQuestion: index,
        questions,
        answers,
        isConnected: state.offline.online
      })
    }
  };
}


export default connect(mapStateToProps)(FormStep);
