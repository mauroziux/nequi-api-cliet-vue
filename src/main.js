import auth from './auth'
import { call } from './payment/generateQR'

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
      getToken: async function () {
        return await auth.getToken(userOptions)
      },
      
      generateQR: async function (value, messageID, reference) {
        userOptions.token = await auth.getToken(userOptions)
        return await call(userOptions, value, messageID, reference)
      }
      
    }
  }
}
