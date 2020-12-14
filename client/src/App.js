import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Game from "./Game";
import Genre from "./Genre";
import About from "./About";
import TwoPlayer from "./TwoPlayer";

const App = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route component={Game} path="/game" exact={true} />
        <Route component={Genre} path="/" exact={true} />
        <Route component={About} path="/about" exact={true} />
        <Route component={TwoPlayer} path="/twoplayer" exact={true} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
