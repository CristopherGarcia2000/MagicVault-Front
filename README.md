# Magic The Gathering App Frontend

Este repositorio contiene el frontend del Proyecto MagicVault. Una aplicación móvil llamada MagicVault para aficionados y coleccionistas de cartas MTG. La aplicación ofrece características como búsqueda avanzada, gestión de mazos y colecciones y más.

## Índice

- [Screens](#screens)
  - [HomeScreen](#homescreen)
  - [LoginScreen](#loginscreen)
  - [RegisterScreen](#registerscreen)
  - [SearchScreen](#searchscreen)
  - [CollectionsScreen](#collectionsscreen)
  - [DecksScreen](#decksscreen)
  - [UserProfileScreen](#userprofilescreen)
- [Componentes](#componentes)
  - [CardPreview](#cardpreview)
  - [ManaText](#manatext)
  - [UserProfileButton](#userprofilebutton)
  - [Footer](#footer)
  - [HeaderLogo](#headerlogo)
- [Servicios](#servicios)
  - [Servicio de Autenticación](#servicio-de-autenticación)
  - [Servicio de Mazos](#servicio-de-mazos)
  - [Servicio de Colecciones](#servicio-de-colecciones)
  - [Servicio de Cartas](#servicio-de-cartas)

## Screens

### HomeScreen

La pantalla principal de la aplicación. Muestra un comandante aleatorio y las últimas cartas visitadas por el usuario.

### LoginScreen

Pantalla de inicio de sesión donde los usuarios pueden ingresar sus credenciales para acceder a la aplicación.

### RegisterScreen

Pantalla de registro donde los nuevos usuarios pueden crear una cuenta proporcionando un nombre de usuario, correo electrónico y contraseña.

### SearchScreen

Pantalla de búsqueda que permite a los usuarios buscar cartas utilizando varios filtros, como colores, tipo de carta y expansión.

### CollectionsScreen

Pantalla que muestra las colecciones del usuario. Los usuarios pueden ver, agregar y eliminar colecciones, así como ver las cartas dentro de cada colección.

### DecksScreen

Pantalla que muestra los mazos del usuario. Los usuarios pueden ver, agregar y eliminar mazos, así como ver las cartas dentro de cada mazo.

### UserProfileScreen

Pantalla de perfil de usuario que muestra la información del usuario actual y permite cerrar sesión.

## Componentes

### CardPreview

Componente para mostrar una vista previa de una carta. Incluye detalles como el nombre, imagen, tipo, coste de maná, y texto de la carta.

### ManaText

Componente para renderizar texto que incluye símbolos de maná. Convierte los símbolos de maná en imágenes correspondientes.

### UserProfileButton

Botón que lleva al usuario a su perfil. Si el usuario no está autenticado, lo redirige a la pantalla de inicio de sesión.

### Footer

Componente de pie de página que incluye botones de navegación para moverse entre las principales pantallas de la aplicación.

### HeaderLogo

Logo que aparece en el encabezado de la aplicación. Al tocarlo, redirige al usuario a la pantalla principal.

## Servicios

### Servicio de Autenticación

**Registrar Usuario**

- **URL:** `/auth/register`
- **Método:** `POST`
- **Respuesta:** JSON que contiene el token de autenticación.

**Iniciar Sesión**

- **URL:** `/auth/login`
- **Método:** `POST`
- **Respuesta:** JSON que contiene el token de autenticación.

### Servicio de Mazos

**Fetch All Decks**

- **URL:** `/decks`
- **Método:** `GET`
- **Respuesta:** JSON array de todos los mazos.

**Fetch User Decks**

- **URL:** `/decks/user/:username`
- **Método:** `GET`
- **Respuesta:** JSON array de los mazos del usuario.

**Add Deck**

- **URL:** `/decks`
- **Método:** `POST`
- **Respuesta:** JSON object representando el mazo creado.

**Delete Deck**

- **URL:** `/decks/delete`
- **Método:** `DELETE`
- **Respuesta:** JSON object representando el estado de la eliminación.

**Add Card to Deck**

- **URL:** `/decks/addCard`
- **Método:** `PUT`
- **Respuesta:** JSON object representando el mazo actualizado.

**Remove Card from Deck**

- **URL:** `/decks/removeCard`
- **Método:** `DELETE`
- **Respuesta:** JSON object representando el mazo actualizado.

### Servicio de Colecciones

**Fetch User Collections**

- **URL:** `/collections/user/:username`
- **Método:** `GET`
- **Respuesta:** JSON array de las colecciones del usuario.

**Add Collection**

- **URL:** `/collections`
- **Método:** `POST`
- **Respuesta:** JSON object representando la colección creada.

**Delete Collection**

- **URL:** `/collections/delete`
- **Método:** `DELETE`
- **Respuesta:** JSON object representando el estado de la eliminación.

**Add Card to Collection**

- **URL:** `/collections/addCard`
- **Método:** `PUT`
- **Respuesta:** JSON object representando la colección actualizada.

**Remove Card from Collection**

- **URL:** `/collections/removeCard`
- **Método:** `DELETE`
- **Respuesta:** JSON object representando la colección actualizada.

### Servicio de Cartas

**Search Cards**

- **URL:** `/search-cards`
- **Método:** `POST`
- **Respuesta:** JSON array de las cartas que coinciden con los criterios de búsqueda.

**Fetch Expansions**

- **URL:** `/sets`
- **Método:** `GET`
- **Respuesta:** JSON array de las expansiones disponibles.

**Fetch Random Commander**

- **URL:** `/random-commander`
- **Método:** `GET`
- **Respuesta:** JSON object representando un comandante aleatorio.
