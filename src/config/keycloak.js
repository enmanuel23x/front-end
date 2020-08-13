import Keycloak from 'keycloak-js';
const keycloak= new Keycloak({ url: 'https://security.intelix.biz/auth', realm: 'MapaConocimientos', clientId: 'google' });
export default keycloak;