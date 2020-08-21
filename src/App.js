import {
  Route,
} from 'react-router-dom';

import Explore from './pages/Explore';
import NotFound from './pages/NotFound';

/*
 * Master app function
 *
 */
function App() {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/">
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
