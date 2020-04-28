/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import Login from './Login';
    /*Verificacion de que la ip termine en nip.io 
    (Por motivos de seguridad de la API de google 
        no se aceptan solo direcciones IP, pero nip.io es un 
        servidor dns que se presenta como alternativa para estas situaciones
        , este redirecciona a la IP o URL que se encuentre antes de ".nip.io")

        La estructura genreal es http:// + IP + nip.io + :puerto
    */
    if(window.location.href.search("nip.io")==-1){
        //De no tener "".nip.io" en la url se añade al final del nombre del host o en este caso la IP
        window.location.href="http://"+window.location.hostname+".nip.io:"+window.location.port
    }else{
        //Se verifica que la sesion este almacenada, 
        if(localStorage.getItem("email")==null){
            //Si la sesion no esta almacenada renderiza el Login
            ReactDOM.render(<Login />, document.getElementById('root'));
        }else{
            //Si la sesion esta almacenada renderiza a la APP
            ReactDOM.render(<App />, document.getElementById('root'));
        }
    }

