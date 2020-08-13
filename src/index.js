/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
//Get the keycloak configuration
import keycloak from './config/keycloak';
//Initialization of the keycloak instance
keycloak.init({ onLoad: 'login-required', promiseType: 'native', checkLoginIframe: false }).then((authenticated) => {
    if (!authenticated) {
        keycloak.init({ onLoad: 'login-required', promiseType: 'native' });
    }else{
        //React Render on authentication
        ReactDOM.render(<App />, document.getElementById('root'));
        //store authentication tokens in sessionStorage
        sessionStorage.setItem('authentication', keycloak.token);
        sessionStorage.setItem('refreshToken', keycloak.refreshToken);
        //to regenerate token on expiry
        setTimeout(() => {
            keycloak.updateToken(70).then((refreshed) => {
                if (refreshed) {
                    console.debug('Token refreshed' + refreshed);
                } else {
                    console.warn('Token not refreshed, valid for '
                        + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
                }
            }).catch( (error) => {
                console.error('Failed to refresh token');
            });


        }, 60000)
    }

}).catch( (error) => {
    console.error("Authenticated Failed");
});

export default keycloak