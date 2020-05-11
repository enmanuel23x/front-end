import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import LogOut from './LogOut';
import keycloak from "../../config/keycloak" 
class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: keycloak.idTokenParsed.name
        }
    }


    render() {
        return (
            <nav className="navbar navbar-light">
                <a href="/" className="brandlink"> </a>
                <ul className="menu">
                    <li> <NavLink exact to="/perfil" activeClassName="active">{this.state.name}<i className="fa fa-user"></i> </NavLink></li>
                    <li> <LogOut/></li>
                </ul>
            </nav>
        );
    }
}

export default Navigation;
