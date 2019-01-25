import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router';

export const RouterOutlet = ({ routes, placeholder, ..._props }) => (
  <Switch>
    {routes.map((route, index) =>
      route.redirectTo ? (
        <Redirect
          key={index}
          from={route.path}
          exact={route.exact}
          strict={route.strict}
          to={route.redirectTo}
          push={route.push}
        />
      ) : route.canEnter && !route.canEnter(_props) ? (
        <Redirect
          key={index}
          from={route.path}
          exact={route.exact}
          strict={route.strict}
          to={route.fallback}
          push={route.push}
        />
      ) : (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props =>
            Suspense ? (
              <Suspense fallback={placeholder || <div />}>
                <route.component {...props} routes={route.routes} />
              </Suspense>
            ) : (
              <route.component {...props} routes={route.routes} />
            )
          }
        />
      )
    )}
  </Switch>
);

export const routePropType = PropTypes.shape({
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  canEnter: PropTypes.func,
  fallback: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  redirectTo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  push: PropTypes.bool,
});

RouterOutlet.propTypes = {
  routes: PropTypes.arrayOf(routePropType).isRequired,
  placeholder: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default RouterOutlet;
