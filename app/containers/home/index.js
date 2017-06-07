import { connect } from 'react-redux';
import { setLanguage } from 'redux-modules/app';
import { setLoginStatus } from 'redux-modules/user';
import { getLanguage } from 'helpers/language';
import { getReadyState } from 'helpers/sync';
import Home from 'components/home';

function mapStateToProps(state) {
  return {
    hasAreas: !!state.areas.data.length,
    readyState: getReadyState(state),
    loggedIn: state.user.loggedIn,
    token: state.user.token,
    languageChanged: state.app.language !== getLanguage()
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setLoginStatus: (status) => {
      dispatch(setLoginStatus(status));
    },
    setLanguageDispatch: () => {
      dispatch(setLanguage(getLanguage()));
    }
  };
}

function mergeProps({ languageChanged, ...stateProps }, { setLanguageDispatch, ...dispatchProps }, ownProps) {
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
    setLanguage: () => (languageChanged && setLanguageDispatch())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Home);
