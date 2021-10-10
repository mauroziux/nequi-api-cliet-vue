import axios from 'axios'
import { nequiHeaders } from '../utils'


//Definición de constantes
const RestEndpoint = '/payments/v2/-services-reverseservices-reversetransaction'
const SUCCESS = '0'
const NO_EXISTE = '2-CCSB000079' //No se encontro un dato en el core financiero, puede que la transacción o messageId no exista
const ERROR_TECNICO = '20-07A' //No se encontro un dato en el core financiero, puede que la transacción o messageId no exista

//Variable de configuración
let config = {}

/**
 *
 * @returns {Promise<boolean>}
 */
async function init () {
  const {
    headers,
    RequestHeader,
    endpoint
  } = nequiHeaders(config, 'reverseTransaction', RestEndpoint, 'reverseServices')
  const data = {
    RequestMessage: {
      RequestHeader,
      RequestBody: {
        any: {
          'reversionRQ': {
            'phoneNumber': config.phoneNumber,
            'value': config.value,
            'code': 'NIT_1',
            'messageId': config.messageID,
            'type': 'payment'
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
      
      if (statusCode === SUCCESS) return statusCode === SUCCESS
      if (statusCode === NO_EXISTE || statusCode === ERROR_TECNICO) return false
      throw new Error(`Error ${ statusCode } = ${ statusDesc }`)
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
 * @returns {Promise<boolean>}
 * @param userOptions
 * @param paymentOptions
 */
export async function reverseTransaction (userOptions, paymentOptions) {
  config = { ...userOptions, ...paymentOptions }
  try {
    return await init()
  } catch (error) {
    console.error(`Error generando la reversión del pago por QR -> '${ error.message }'`)
  }
}
