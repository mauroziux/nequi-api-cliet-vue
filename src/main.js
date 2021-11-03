import auth from './auth'
import { generateQR } from './payment/QR/generateQR'
import { generateNotificationPush } from './payment/notificationPush/unregisteredPayments'
import { getStatusPayment } from './payment/getStatusPayment'
import { reverseTransaction } from './reverse/reverseTransaction'

const defaultOptions = {
  clientId: null,
  clientSecret: null,
  apiKey: null,
  token: null,
  authUri: 'https://oauth.sandbox.nequi.com/oauth2/token',
  authGrantType: 'client_credentials',
  apiBasePath: 'https://api.sandbox.nequi.com',
}

export default {
  install (Vue, options) {
    
    // merge default options with arg options
    const userOptions = { ...defaultOptions, ...options }
    Vue.prototype.$nequi = {
      /**
       * Obtener token de autenticación
       * @returns {Promise<*>}
       */
      getToken: async function () {
        return await auth.getToken(userOptions)
      },
      
      /**
       * Generar código Qr
       * @param value
       * @param messageID
       * @param reference
       * @returns {Promise<string>}
       */
      generateQR: async function ({ value, messageID, reference }) {
        userOptions.token = await auth.getToken(userOptions)
        return await generateQR(userOptions, { value, messageID, reference })
      },
  
      /**
       * Generar Notificación Push
       * @param phoneNumber
       * @param value
       * @param messageID
       * @param reference
       * @returns {Promise<string>}
       */
      generateNotificationPush: async function ({ phoneNumber,value, messageID, reference }) {
        userOptions.token = await auth.getToken(userOptions)
        return await generateNotificationPush(userOptions, { phoneNumber, value, messageID, reference })
      },
      
      /**
       * Verificar el estado de una transacción por QR
       * @param code
       * @param messageID
       * @returns {Promise<{phoneNumber: string, status: string}>}
       */
      getStatusPayment: async function ({ code, messageID }) {
        userOptions.token = await auth.getToken(userOptions)
        return await getStatusPayment(userOptions, { code, messageID })
      },
      
      /**
       * Reversar una transacción por QR
       * @param value
       * @param messageID
       * @param phoneNumber
       * @returns {Promise<boolean>}
       */
      reverseTransaction: async function ({value,messageID,phoneNumber}) {
        userOptions.token = await auth.getToken(userOptions)
        return await reverseTransaction(userOptions, {value,messageID,phoneNumber})
      }
    }
  }
}
