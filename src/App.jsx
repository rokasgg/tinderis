import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Login from "./components/login";
import Register from "./components/register";
import Main from "./components/main";
import Game from "./components/game";
import Profile from "./components/profile";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FinalRegistrationScreen from "./components/finalRegScreen";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route
              path="/"
              exact
              component={Login}
              render={(props) => <Login {...props} />}
            />
            <Route
              path="/login"
              component={Login}
              render={(props) => <Login {...props} />}
            />
            <Route
              path="/register"
              component={Register}
              render={(props) => <Register {...props} />}
            />
            <Route
              path="/finalReg"
              component={FinalRegistrationScreen}
              render={(props) => <FinalRegistrationScreen {...props} />}
            />
            <Route
              path="/main"
              component={Main}
              render={(props) => <Main {...props} />}
            />
            <Route
              path="/profile"
              component={Profile}
              render={(props) => <Profile {...props} />}
            />
            <Route
              path="/game"
              component={Game}
              render={(props) => <Game {...props} />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
