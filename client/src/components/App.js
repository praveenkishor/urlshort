import React, { Component } from "react";
import { BrowserRouter, Link,Route, Switch } from "react-router-dom";

import Header from "./header/Headers";
import Landing from "./landing/Landing";
import Stats from "./landing/Stats"
import "./styles.css";
class App extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/stats" component={Stats} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
