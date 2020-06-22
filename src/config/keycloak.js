import Keycloak from 'keycloak-js';
const keycloak= new Keycloak({ url: 'http://localhost:8080/auth', realm: 'Google-Auth', clientId: 'google' });
export default keycloak;