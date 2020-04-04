import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import JoinPage from './pages/JoinPage';
import LoginPage from './pages/LoginPage';
import IntroductionPage from './pages/introduction_page';
import ForgotPasswordPage from './pages/forgot_password_page';
import EditPasswordPage from './pages/edit_password_page';
import DomainChoosePage from './pages/domain_choose_page';
import AuthCallbackPage from './pages/auth_callback_page';
import SlackAuthPage from './pages/slack_auth_page';
import App from './App';
import analytics from 'Lib/analytics';

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    analytics.init();
  }

  render() {
    return (
      <BrowserRouter>
        <LastLocationProvider>
          <Switch>
            <Route path="/choose_domain" component={DomainChoosePage} />
            <Route path="/join" component={JoinPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/introduction/:step" component={IntroductionPage} />
            <Route path="/introduction" component={IntroductionPage} />
            <Route path="/forgot_password" component={ForgotPasswordPage} />
            <Route path="/edit_password" component={EditPasswordPage} />
            <Route
              path="/auth/callback/:provider"
              render={props => <AuthCallbackPage {...props} />}
            />
            <Route path="/slack/auth" component={SlackAuthPage} />

            <Redirect
              from="/groups/:groupSlug/topics/:topicSlug"
              to="/groups/:groupSlug/yays/:topicSlug"
            />
            <Redirect
              from="/groups/:groupSlug/topics"
              to="/groups/:groupSlug/yays"
            />

            <Route
              path="/groups/:groupSlug/yays/:topicSlug"
              render={props => <App page="topic" {...props} />}
            />
            <Route
              path="/groups/:groupSlug/yays"
              render={props => <App page="topics" {...props} />}
            />
            <Route
              path="/groups/:groupSlug/users/:personId"
              render={props => <App page="user" {...props} />}
            />
            <Route
              path="/groups/:groupSlug/users"
              render={props => <App page="users" {...props} />}
            />
            <Route
              path="/groups/:groupSlug"
              render={props => <App page="home" {...props} />}
            />

            <Redirect from="/topics/:topicSlug" to="/yays/:topicSlug" />
            <Redirect from="/topics" to="/yays" />

            <Route
              path="/yays/:topicSlug"
              render={props => <App page="topic" {...props} />}
            />
            <Route
              path="/yays"
              render={props => <App page="topics" {...props} />}
            />

            <Route
              path="/users/:personId"
              render={props => <App page="user" {...props} />}
            />
            <Route
              path="/users"
              render={props => <App page="users" {...props} />}
            />
            <Route path="/" render={props => <App page="home" {...props} />} />
          </Switch>
        </LastLocationProvider>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
