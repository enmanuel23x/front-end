![Logo](https://cs.intelix.biz/logo/pic.png "InteliX")
# Mapeo de conocimiento

#### v-1.0.0

## 1. Introducción.

Este repositorio contiene el frontend de la aplicacion "Mapeo de Conocimiento",
la cual permitira ingresar las habilidades del colaborador en cuestión, permitiendo asi mantener 
una gestión actualizada de los mismos para futuros usos.


## 2. Funcionalidad.

Mapeo de conocimientos es un aplicación web diseñada únicamente para los colaboradores de la empresa.
Con el objetivo de facilitar a nuestro equipo de gestión y métodos la recolección de habilidades de cada integrante 
de la empresa para así potenciar el proceso de selección de un proyecto manejado desde la plataforma de Resource Guru.

## 3. Tipos de conexión.

-  El puerto configurado para ejecutar la aplicación es el **3000**.
-  La aplicacion realiza las peticiones (API) en el puerto **4080**.
-  El servicio de autenticacion (Keycloak) esta configurado en el puerto **8080**.


## 4. Generalidades sobre la implementación.

- Esta aplicacion ha sido desarrollada con React.

- Arbol de la aplicación:

	```
    front-end
    │   README.md
    │   .gitignore   
    │   package.json   
    │   package-lock.json   
    │
    └───src
    │   │   App.js
    │   │   index.js
    │   │
    │   └───assets
    │   │   └───css
    │   │   │   App.css
    │   │   │   index.css
    │   │
    │   └───components
    │       │   Home.js
    │       │   Profile.js
    │       │   
    │       └───auth
    │       │   keycloak.js   
    │       │   
    │       └───external
    │       │   FloatButtom.js
    │       │   Footer.js
    │       │   LogOut.js
    │       │   Navigation.js
    │       │   pagination.js
    │    
    └───public
        │   index.html
        └───css
        │
        └───fonts
        │
        └───img
    ```
	
- Nivel de conocimiento: Bajo.

## 5. Configuración y Despliegue.

Aspectos a considerar:

- Se describe el proceso de instalación y despliegue para la aplicación.

- Seguirlo paso a paso debería garantizar la correcta instalación y posterior despliegue o puesta en funcionamiento de los servicios.
 
- Cualquier tipo de contingencia o caso atípico que se pudiera presentar durante el despliegue en un ambiente determinado será documentado en esta fase en el punto **5.4 Resolución de problemas**.

### 5.1. Prerrequisitos.

**Se deben tener configurados los siguientes entornos:**

- NodeJS

- Keycloak (Leer más dentro de la carpeta Keycloak)

- El backend de la aplicacion debe estar debidamente instalado y configurado.


### 5.2. Instalación y configuración.

Paso a paso a seguir para la instalación propiamente de la aplicación:

1. Clonar el repositorio con `git`.
2. Acceder a la carpeta donde se haya descargado todo el código fuente del servicio.
3. Ejecutar `npm install` para instalar todas las dependencias necesarias del servicio.

#### Configuraciones en el codigo *(Solo de ser necesario)*

- En el componente Profile (src/components/Profile.js), en las lineas iniciales, existe una constante llamada *email*, 
la cual se debe inicializar con el correo al cual llegaran las notificaciones, ya sea por falta de habilidad reportado
 o colaborador no registrado en RG.

```javascript
const email = "";
```

- En el package.json (./) se debe configurar el puerto en el cual se ejectara el backend,
por defecto esta configurado en el puerto "4080".

```
 "proxy": "http://localhost:4080/"
```

- En el componente keycloak (src/components/auth/keycloak.js) se encuentra la configuracion de "login-required" en el 
archivo index.js (src/index.js). En caso de modificar el Realm o el cliente en Keycloak, se debe configurar aqui.

```javascript
 const keycloak= new Keycloak({ url: 'http://localhost:8080/auth/', realm: 'Google-Auth', clientId: 'google' });
```

### 5.3. Ejecución.


**Importante**: Antes de inicializar los comandos de React se debe iniciar por consola el backend y 
los servicios de autenticacion de Keycloak `standalone.bat` en  Windows y `standalone.sh` en Linux 
*(Se recomienda leer mas en los README.me en el directorio Keycloak y en el repositorio "back-end")*.

Para inicializar los servicios de Keycloak:

1. Acceder a la carpeta de Keycloak y posicionarse en el directorio /bin.

2. Ejecutar el comando `standalone.bat` o en su defecto `standalone.bat -b 0.0.0.0` para acceder a la aplicacion
mediante la dirección IP.


En esta sección se deben considerar los siguientes pasos:

1. Inicializa el servidor `npm start`.

2. La consola en donde se ejecutó el anterior, una vez se compile el codigo, esta proporcionara 2 direcciones para acceder. 
Si se ejecuto el comando `standalone.bat` en la inicializacion de Keycloak acceder mediante `localhost`.
En el caso de ejecutar el comando `standalone.bat -b 0.0.0.0` se podra acceder desde la dirección IP.


### 5.4. Resolución de problemas.


- En el caso de en la sección de perfil, puede ocurrir que nunca se renderize el componente de las categorias y las 
habilidades, si este es el caso, verificar la consola web, además de que las credenciales de Resource Guru esten actualizadas.
Luego se recomienda reiniciar la consola del backend y recargar la pagina.

- Puede ocurrir que al momento de iniciar sesion en el Login mediante el boton de Google+ este servicio no pueda comprobar
la identidad del usuario, si este es el caso, verificar las configuraciones en la consola de administración de Keycloak (Kerberos).

---
_(c) 2019 Intelix Synergy C.A. Documentación técnica de aplicación **v1.0.0**_
