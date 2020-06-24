import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import keycloak from '../../config/keycloak';
class Logout extends Component {

  logout() {
    keycloak.logout();
  }

  render() {
    return (
      <button className="link" onClick={ () => this.logout() }>
       <i className="fa fa-sign-out"></i>
      </button>
    );
  }
}
export default withRouter(Logout);