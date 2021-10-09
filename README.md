# nequi-api-client-vue #

### Ejemplo para el consumo del API de Nequi en Vue.js y Nuxt.js  ###
El propósito de este ejemplo es ilustrativo para aquellos interesados en la integración con el API de Nequi. Con este repositorio podrá consumir algunos de los recursos ofrecidos por el API,y si lo desea podrá utilizar este código como base para el consumo del resto de recursos expuestos en el API. Para más información visite el portal para desarrolladores [https://conecta.nequi.com.co](https://conecta.nequi.com.co "Nequi Conecta").

## 1. Instalación y preparación del ambiente
```bash
#yarn
yarn add 'nequi-api-client-vue'
#npm 
npm install 'nequi-api-client-vue'
```

### Credenciales de acceso

Asegúrese de tener las credenciales necesarias para hacer el consumo del API, los datos mínimos que debe tener son:
- Client Id
- Client Secret
- API Key

Los anteriores datos los podrá encontrar en la sección **Credenciales** en el siguiente enlace [https://conecta.nequi.com/content/consultas](https://conecta.nequi.com/content/consultas "Nequi Conecta").

### Archivo de configuración

En el archivo ```/.env.example``` podrá encontrar un ejemplo de las credenciales que debe proveer. Además también encontrará algunas definiciones adicionales que se usan en los ejemplos.

*Tenga en cuenta que los ejemplos toman como premisa que las credenciales y las definiciones adicionales están almacenadas en **variables de entorno**.*

### Librería 'axios'

Todos los ejemplos aquí proporciandos usan la librería [Axios](https://www.npmjs.com/package/axios) para hacer el consumo de los endpoints. Usted y su equipo de desarrollo es libre de usar cualquier librería que le provea una abstracción para el consumo de APIs Restful o de crear su propio código para dicha integración.

### Uso del plugin
```js
import vue from 'vue';
import nequi from 'nequi-api-client-vue'

// add .env config settings here
Vue.use(nequi,{ clientId, clientSecret, apiKey })
```

## 3. Metodos Nequi

Recuerde que podrá encontrar el detalle de los recursos ofrecidos por el API en el siguiente enlace [https://docs.conecta.nequi.com.co/](https://docs.conecta.nequi.com.co/).

### Autenticación en Nequi Conecta

En el archivo ```/src/auth.js``` podrá encontrar el código necesario para autenticarse, el cual le permite obtener un token de acceso que deberá usar en las integraciones del API.

```javascript
this.$nequi.auth.getToken()
```

### Pagos con QR code

Esta sección encontrará cada uno de las funciones acerca de los servicios para integrar APIs con comercios electrónicos y recibir pagos con Nequi a través de QR dinámicos. Los podrá encontrar alojado en la carpeta ```/src/payment/QR```.

#### Generar pago QR: 
En el archivo ```/src/payment/QR/generateQR.js``` Permite a partir del tipo y número de identificación de un comercio y un valor a cobrar, crear una solicitud o código de pago, que al concatenar con el string “bancadigital-” conforman la cadena con la cual se puede crear un código QR que puede ser leído desde la aplicación móvil NEQUI para concretar el pago.
```js
#variables
let value =  '(numeric): valor en pesos de la transacción'
let messageID =  '(string): Identificador unico de la transacción, alfanumérico de longitud 10, atributo con proposito de trazabilidad'
let reference = '(string, optional): Campo opcional para guardar información adicional de la transacción'

this.$nequi.auth.generateQR({ value, messageID, reference })
```
## Consultar pago QR: 
En el archivo ```/src/payment/QR/getStatusPayment.js``` Permite a partir del código QR, consultar el estado del pago y verificar si el pago fue realizado o cancelado por alguna cuenta NEQUI.
```js
#variables
let codeQR =  '(string): Identificador único o código del pago que se genera con el anterior servicio para generación de código QR'
let messageID =  '(string): Identificador unico de la transacción, alfanumérico de longitud 10, atributo con proposito de trazabilidad'

this.$nequi.auth.getStatusPayment({ value, messageID, reference })
```

## Reversar pago QR:
En el archivo ```/src/payment/QR/getStatusPayment.js``` Permite a partir del código QR, consultar el estado del pago y verificar si el pago fue realizado o cancelado por alguna cuenta NEQUI.
```js
#variables
let codeQR =  '(string): Identificador único o código del pago que se genera con el anterior servicio para generación de código QR'
let messageID =  '(string): Identificador unico de la transacción, alfanumérico de longitud 10, atributo con proposito de trazabilidad'

this.$nequi.auth.getStatusPayment({ value, messageID, reference })
```

### Depósitos y Retiros

Esta sección cuenta con 2 ejemplos que podrás encontrar alojado en la carpeta ```/src/deposit_withdrawal/```.

- **Validar una cuenta**: En el archivo ```/src/deposit_withdrawal/ValidateClient.js``` podrá encontrar el código para validar una cuenta.

- **Recargar una cuenta**: En el archivo ```/src/deposit_withdrawal/ChargeAccount.js``` podrá encontrar el código para recargar una cuenta.

### Pagos con notificación

Esta sección cuenta con 1 ejemplo que podrá encontrar alojado en la carpeta ```/src/payment_push/```.

- **Solicitu de pago**: En el archivo ```/src/payment_push/UnregisteredPaymentRequest.js``` podrá encontrar el código para solicitar un pago mediante notificación push.

## Integrating with Nuxt
Create `/plugins/nequi-api-client-vue.js` and add the following to it
```javascript
import Vue from 'vue'
import nequi from 'nequi-api-client-vue'

// add .env config settings here
Vue.use(nequi,{ clientId, clientSecret, apiKey })
export default nequi
```
Load the plugin in `nuxt.config.js`:
```javascript
plugins: [ { src: '@/plugins/nequi-api-client-vue.js', mode: 'client' }]
```
The `mode: 'client'` is necessary to prevent Nuxt from loading the plugin during server-side rendering (SSR).
### Unit Test
```bash
#yarn
yarn test
#npm
npm test

```

----------
*Made with ♥ at Nequi by Mauricio Suarez Vega*

