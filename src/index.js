/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import Login from './Login';
            if(localStorage.getItem("email")==null){
                ReactDOM.render(<Login />, document.getElementById('root'));
            }else{
                ReactDOM.render(<App />, document.getElementById('root'));
            }

