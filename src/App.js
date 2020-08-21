import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Explore from './pages/Explore';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/before">
          {<Explore />}
        </Route>

        {/* Catch-all Route */}
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
