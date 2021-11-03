import axios from 'axios'
import { nequiHeaders } from '../utils'

//Definición de constantes
const RestEndpoint = '/payments/v2/-services-paymentservice-getstatuspayment'
const PENDIENTE = '33'
const REALIZADO = '35'
const SUCCESS = '0'

//variable de configuración
let config = {}

/**
 *
 * @returns {Promise<{phoneNumber: string, status: string}>}
 */
async function init () {
  const { headers, RequestHeader, endpoint } = nequiHeaders(config, 'getStatusPayment', RestEndpoint)
  const data = {
    RequestMessage: {
      RequestHeader,
      RequestBody: {
        any: {
          getStatusPaymentRQ: {
            codeQR: config.code,
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
          status = '',
          phoneNumber = '',
        } = data.ResponseMessage.ResponseBody.any.getStatusPaymentRS
        
        return { status, phoneNumber }
        
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
 * @returns {Promise<{phoneNumber: string, status: string}>}
 * @param userOptions
 * @param paymentOptions
 */
export async function getStatusPayment (userOptions, paymentOptions) {
  config = { ...userOptions, ...paymentOptions }
  try {
    return await init()
  } catch (error) {
    console.error(`Error verificando el estado del pago por QR -> '${ error.message }'`)
  }
}
