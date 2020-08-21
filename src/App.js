import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Explore from './pages/Explore';
import NotFound from './pages/NotFound';
import { useDarkMode } from './components/DarkMode';

function App() {
  const [theme, toggleTheme, componentMounted] = useDarkMode();

  if (theme === 'dark') {
    document.documentElement.classList.add('mode-dark');
  } else {
    document.documentElement.classList.remove('mode-dark');
  }

  if (!componentMounted) {
    return <div />;
  }

  return (
    <Router>
      <div onClick={toggleTheme}>Toggle dark mode</div>
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
