// eslint-disable-next-line
import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/css/login.css"
import config from './config/config';
import Swal from 'sweetalert2'


/*
Para el llamado de la libreria 'react-google-login'
la en el componente importamos de la 
forma "import GoogleLogin from 'react-google-login';"
Esta es un componente que implementa el diseño basico del boton de inicio de sesion

-Definimos el clientID definido en la API de google, tambien definimos la URL en esa API
-Definimos el texto del boton, si lo dejamos default solo dira "login"
-Luego se hace el llamado a la funcion "import GoogleLogin from 'react-google-login';",
la cual analizara el resultado de este inicio de sesion

<GoogleLogin className="btn btn-google btn-block"
  clientId={config.clientId}
  buttonText="Iniciar Sesión"
  onSuccess={responseGoogle}
  onFailure={responseGoogle}/>
*/

/*
Funcion para almacenar los datos de la sesion, 
esta funcion solo es llamada cuando el inicio de sesion es exitoso
Si ocurre un error no se almacena la sesion y se muestra una alerta
*/
const responseGoogle = (response) => {
  if(response.profileObj.email!==null && response.profileObj.email!==undefined){
    localStorage.setItem("email", response.profileObj.email);
    localStorage.setItem("name", response.profileObj.name);
    window.location.reload();
  }else{
    Swal.fire({
      icon: 'error',
      title: 'Se produjo un error!',
      text:'',
      showConfirmButton: true
  })
  }
  
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
                  onFailure={responseGoogle}/>
              </form>
              
        </div>
        </div>
    );
  }
}
export default Login;

