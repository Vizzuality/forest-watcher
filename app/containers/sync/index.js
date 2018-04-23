// @flow
import type { State } from 'types/store.types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { retrySync } from 'redux-modules/app';
import { isSyncFinished } from 'helpers/sync';
import isEmpty from 'lodash/isEmpty';

import Sync from 'components/sync';

function mapStateToProps(state: State) {
  const hasAreas = !!state.areas.data.length;
  const hasAlerts = !isEmpty(state.alerts.cache);

  return {
    criticalSyncError: (!hasAreas && state.areas.syncError) || (!hasAlerts && state.alerts.syncError),
    isConnected: state.offline.online,
    syncFinished: isSyncFinished(state)
  };
}

const mapDispatchToProps = (dispatch: *) => bindActionCreators({
  retrySync
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sync);
