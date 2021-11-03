import axios from 'axios'
import { nequiHeaders } from '../../utils'

//Definición de constantes
const restEndpoint = '/payments/v2/-services-paymentservice-unregisteredpayment'
const SUCCESS = '0'

//variable de configuración
let config = {}

/**
 *
 * @returns {Promise<string>}
 */
async function init () {
  const { headers, RequestHeader, endpoint } = nequiHeaders(config, 'unregisteredPayment', restEndpoint)
  const data = {
    RequestMessage: {
      RequestHeader,
      RequestBody: {
        any: {
          unregisteredPaymentRQ: {
            phoneNumber:config.phoneNumber,
            code: 'NIT_'+process.env.NEQUI_CLIENT_NIT,
            value: config.value,
            reference1: config.reference ? config.reference : 'reference1',
          }
        }
      }
    }
  }
  
  try {
    const response = await axios.request({
      url: endpoint,
      method: 'POST',
      headers,
      data
    })
    
    if (!!response && response.status === 200 && response.data) {
      const { data } = response
      const {
        StatusCode: statusCode = '',
        StatusDesc: statusDesc = ''
      } = data.ResponseMessage.ResponseHeader.Status
      
      if (statusCode === SUCCESS) {
        const {
          transactionId = ''
        } = data.ResponseMessage.ResponseBody.any.unregisteredPaymentRS
        
        return transactionId
      } else {
        throw new Error(`Error ${ statusCode } = ${ statusDesc }`)
      }
    } else {
      throw new Error('Unable to connect to Nequi, please check the information sent.')
    }
  } catch (error) {
    let msgError = ''
    if (error.isAxiosError) {
      const { status = 'Undefined', statusText = 'Undefined' } = error.response
      msgError = `Axios error ${ status } -> ${ statusText }`
      throw new Error(msgError)
    } else {
      throw error
    }
  }
}

/**
 *
 * @returns {Promise<string>}
 * @param userOptions
 * @param paymentOptions
 */
export async function generateNotificationPush (userOptions, paymentOptions) {
  config = { ...userOptions, ...paymentOptions }
  try {
    return await init()
  } catch (error) {
    console.error(`Error generando notificacion push -> '${ error.message }'`)
  }
}
