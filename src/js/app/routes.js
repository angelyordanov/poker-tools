import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import HandsView from 'js/features/hands/components/HandsView';
import NotFoundView from 'js/components/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HandsView} />
    <Route path="404" component={NotFoundView} />
    <Redirect from="*" to="404" />
  </Route>
);
