// eslint-disable-next-line
import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/css/login.css"
import config from './config/config';
 
const responseGoogle = (response) => {
  localStorage.setItem("email", response.profileObj.email);
  localStorage.setItem("name", response.profileObj.name);
  window.location.reload();
}

class Login extends Component {
  render() {
    return (
      <div className="register-photo">
            <div className="form-container">
                    <div className="image-holder"></div>
                    <form method="post">
                <div className="logo"></div>
                <p className="text-center"><strong>Administradores</strong></p>
                <div className="form-group"><input className="form-control" type="email" name="email" placeholder="Correo"></input></div>
                <div className="form-group"><input className="form-control" type="password" name="password" placeholder="Contraseña"></input></div>
                <div className="form-group">
                  <button className="btn btn-primary btn-block" type="submit"><strong>Iniciar Sesión</strong></button>
                </div>
                <hr></hr>
                <p className="text-center"><strong>Usuarios de Intelix</strong></p>
                <GoogleLogin className="btn btn-google btn-block"
    clientId={config.clientId}
    buttonText="Iniciar Sesión"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
  />
              </form>
              
        </div>
        </div>
    );
  }
}
export default Login;

