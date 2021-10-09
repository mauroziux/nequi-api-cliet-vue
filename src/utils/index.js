import moment from 'moment'

/**
 * Cabeceras para las peticiones nequi
 * @param config
 * @param ServiceOperation
 * @param RestEndpoint
 * @param ServiceName
 * @returns {{headers: {Authorization: *, Accept: string, 'x-api-key': *, 'Content-Type': string}, endpoint: string, RequestHeader: {Destination: {ServiceRegion: string, ServiceName: string, ServiceVersion: string, ServiceOperation}, RequestDate: *, Channel: string, ClientID: string, MessageID: *}}}
 */
export function nequiHeaders (config, ServiceOperation, RestEndpoint, ServiceName = 'PaymentsService') {
  
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: config.token,
    'x-api-key': config.apiKey
  }
  
  const endpoint = `${ config.apiBasePath }${ RestEndpoint }`
  
  const RequestHeader = {
    Channel: 'PQR03-C001',
    RequestDate: moment(new Date()).format(),
    MessageID: config.messageID,
    ClientID: config.clientId,
    Destination: {
      ServiceName,
      ServiceOperation,
      ServiceRegion: 'C001',
      ServiceVersion: '1.2.0'
    }
  }
  
  return {
    headers, endpoint, RequestHeader
  }
}
