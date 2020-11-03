import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Game from './Game';

const App = () => (
  <BrowserRouter>
    <div className="container">
      <Switch>
        <Route component={Game} path="/" exact={true} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
