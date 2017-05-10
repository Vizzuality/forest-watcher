import Home from 'containers/home';
import Setup from 'containers/setup';
import Dashboard from 'containers/dashboard';
import Alerts from 'containers/alerts';
import Map from 'containers/map';
import Settings from 'containers/settings';
import Reports from 'containers/reports';
import NewReport from 'components/reports/new';
import Feedback from 'components/feedback';
import AreaDetail from 'containers/settings/area-detail';
import Partners from 'components/settings/partners';

export const Routes = {
  Home: { screen: Home },
  Setup: { screen: Setup },
  Dashboard: { screen: Dashboard },
  Alerts: { screen: Alerts },
  Map: { screen: Map },
  Settings: { screen: Settings },
  Reports: { screen: Reports },
  NewReport: { screen: NewReport, path: 'new-report/:step' },
  Feedback: { screen: Feedback },
  AreaDetail: { screen: AreaDetail, path: 'areas/:id' },
  Partners: { screen: Partners }
};

export const RoutesConfig = {
  initialRouteName: 'NewReport',
  headerMode: 'screen'
};
