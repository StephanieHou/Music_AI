import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Provider } from "react-redux";
import Store from "./store";

import Home from "./components/Home/Home";
import Register from "./components/Authorization/Register";
import Login from "./components/Authorization/Login";

class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <Router>
          <div className="App">
            <Route exact path="/" exact component={Home} />
            <Route exact path="/register" exact component={Register} />
            <Route exact path="/login" exact component={Login} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;