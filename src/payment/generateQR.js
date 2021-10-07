import axios from 'axios'
import moment from 'moment'

const RestEndpoint = '/payments/v2/-services-paymentservice-generatecodeqr'
let config = {}

async function init () {
  
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: config.options.token,
    'x-api-key': config.options.apiKey
  }
  
  const endpoint = `${ config.options.apiBasePath }${ RestEndpoint }`
  
  const data = {
    RequestMessage: {
      RequestHeader: {
        Channel: 'PQR03-C001',
        RequestDate: moment(new Date()).format(),
        MessageID: config.messageID,
        ClientID: config.options.clientId,
        Destination: {
          ServiceName: 'PaymentsService',
          ServiceOperation: 'generateCodeQR',
          ServiceRegion: 'C001',
          ServiceVersion: '1.2.0'
        }
      },
      RequestBody: {
        any: {
          generateCodeQRRQ: {
            code: 'NIT_1',
            value: config.value,
            reference1: config.reference,
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
      
      if (statusCode === '0') {
        const {
          codeQR = ''
        } = data.ResponseMessage.ResponseBody.any.generateCodeQRRS
        
        
        return codeQR
        
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
 * @param options
 * @param value
 * @param messageID
 * @param reference
 * @returns {Promise<void>}
 */
export async function call (options, value, messageID, reference) {
  config = {
    value,
    messageID,
    reference,
    options
  }
  try {
  return await init()
  } catch (error) {
    console.error(`Pagos con QR code -> Error generando código -> '${ error.message }'`)
  }
}
