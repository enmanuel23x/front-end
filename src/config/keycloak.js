import Keycloak from 'keycloak-js';
const keycloak= new Keycloak({ url: 'https://10.48.13.152.nip.io/auth/', realm: 'MapaConocimientos', clientId: 'google' });
export default keycloak;