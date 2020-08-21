import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Import pages
import Explore from './pages/Explore';
import NotFound from './pages/NotFound';

// Import dark mode
import { useDarkMode } from './components/DarkMode';
import DarkModeToggle from 'react-dark-mode-toggle';

// Global css
import './App.css';

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
      <div className="text-center w-screen pt-8 bg-gray-200 dark:bg-gray-700">
        <DarkModeToggle
          onChange={toggleTheme}
          checked={theme === 'dark'}
          size={50}
          speed={5}
        />
      </div>
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
