import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Notes from "./Pages/NotePage";
import Home from "./Pages/Home";
import EditNote from "./Pages/NoteEdit";
import CreateNote from "./Pages/NoteCreate";
import PrivateRoute from "./components/PrivateRoute";
import './App.css';
import store from "./redux";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact={true} path="/notes" component={Notes} />
            <PrivateRoute exact={true} path="/notes/edit" component={EditNote} />
            <PrivateRoute exact={true} path="/notes/create" component={CreateNote} />
          </Switch>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
