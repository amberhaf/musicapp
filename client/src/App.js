import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Game from "./Game";
import Music from "./Music";

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
