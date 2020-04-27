/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import Login from './Login';
console.log(window.location.href)
    if(window.location.href.search("nip.io")==-1){
        window.location.href="http://"+window.location.hostname+".nip.io:"+window.location.port
    }else{
        if(localStorage.getItem("email")==null){
            ReactDOM.render(<Login />, document.getElementById('root'));
        }else{
            ReactDOM.render(<App />, document.getElementById('root'));
        }
    }

