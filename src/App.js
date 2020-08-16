//import logo from './logo.svg';
import "./assets/css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import { Redirect } from 'react-router';
import Home from "./components/Home";
import Profile from "./components/Profile";
import SiderDemo from "./components/dashboard/Navigation";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import config from './config/config';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/perfil"  component={Profile}/>
            <Route path='/dashboard' render={props => (
                config.admins.includes(localStorage.email)
                  ? <SiderDemo/>
                  : <Redirect to="/" />
                )} />
            <Route path="*" render={() => (
            <Redirect to="/"/> )}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;

