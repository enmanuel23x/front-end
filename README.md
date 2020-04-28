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
    │   │   Login.js
    │   │
    │   └───assets
    │   │   └───css
    │   │   │   App.css
    │   │   │   index.css
    │   │
    │   └───config
    │   │   │   config.js
    │   │
    │   └───components
    │       │   Home.js
    │       │   Profile.js
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

- Activar el servicio de autenticacion de Google API

- El backend de la aplicacion debe estar debidamente instalado y configurado.


### 5.2. Instalación y configuración.

Paso a paso a seguir para la instalación propiamente de la aplicación:

1. Clonar el repositorio con `git`.
2. Acceder a la carpeta donde se haya descargado todo el código fuente del servicio.
3. Ejecutar `npm install` para instalar todas las dependencias necesarias del servicio.

#### Configuraciones en el codigo *(Solo de ser necesario)*

- En el componente Profile (src/config/config.js), en las lineas iniciales, existe unas constantes llamadas: 
    - *email*: Correol cual llegaran las notificaciones, ya sea por falta de habilidad reportado
                o colaborador no registrado en RG
    - *clientId*: ID del cliente de Google API
    - *backURL*: URL del backend de la app mapeo de conomientos
    las cuales se deben inicializar para el completo funcionamiento de la app, 
    la estructura de este archivos es la siguiente:

```javascript
module.exports = {
    backURL: "http://10.48.13.156:4080",
    clientId:"808436269199-clfno654lulirtkmn17p1g6o5klks9g6.apps.googleusercontent.com",
    email:"anarvaez@intelix.biz"
};

```

### 5.3. Ejecución.


**Importante**: Antes de inicializar los comandos de React se debe iniciar por consola el backend y 
configurar los servicios de autenticacion de Google API
*(Se recomienda leer mas en el repositorio "back-end")*.

En esta sección se deben considerar los siguientes pasos:

1. Inicializa el servidor `npm start`.

2. La consola en donde se ejecutó el anterior, una vez se compile el codigo, esta proporcionara 2 direcciones para acceder. 

### 5.4. Resolución de problemas.


- En el caso de en la sección de perfil, puede ocurrir que nunca se renderize el componente de las categorias y las 
habilidades, si este es el caso, verificar la consola web, además de que las credenciales de Resource Guru esten actualizadas.
Luego se recomienda reiniciar la consola del backend y recargar la pagina.

- Puede ocurrir que al momento de iniciar sesion en el Login mediante el boton de Google este servicio no pueda comprobar
la identidad del usuario, si este es el caso, verificar las configuraciones de acceso y ClientID en Google API, tambien 
verifique que esta ingresando con un correo del dominio intelix.biz.

---
_(c) 2019 Intelix Synergy C.A. Documentación técnica de aplicación **v1.0.0**_
