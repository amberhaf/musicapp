import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Game from "./Game";
import Genre from "./Genre";

const App = () => (
  <BrowserRouter>
    <div className="container">
      <Switch>
        <Route component={Game} path="/game" exact={true} />
        <Route component={Genre} path="/" exact={true} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
