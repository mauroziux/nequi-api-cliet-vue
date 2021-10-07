import moment from 'moment'
import axios from 'axios'

let token = null
let tokenType = null
let expiresAt = null

async function auth (options) {
  try {
    const authorization = `Basic ${ Buffer.from(`${ options.clientId }:${ options.clientSecret }`).toString('base64') }`
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': authorization
    }
    
    const endpoint = `${ options.authUri }?grant_type=${ options.authGrantType }`
    
    try {
      const response = await axios.request({
        url: endpoint,
        method: 'POST',
        headers
      })
      
      if (!!response && response.status === 200 && response.data) {
        token = response.data.access_token
        tokenType = response.data.token_type
        expiresAt = moment(new Date()).add(response.data.expires_in, 'seconds')
        
      } else {
        
        throw new Exception('Unable to connect to Nequi, please check the information sent.')
      }
    } catch (error) {
      let msgError = ''
      
      if (error.isAxiosError) {
        const { status = 'Undefined', statusText = 'Undefined' } = error.response
        
        msgError = `Axios error ${ status } -> ${ statusText }`
      } else {
        msgError = `Error -> ${ error }`
      }
      
      throw new Error(msgError)
    }
  } catch (e) {
    throw new Error('Unable to auth to Nequi, please check the information sent.')
  }
}

async function getToken (options, full = true) {
  if (!isValidToken()) {
    await auth(options)
  }
  
  return full ? `${ tokenType } ${ token }` : token
}

function isValidToken () {
  if (!expiresAt) {
    return false
  }
  
  return moment().isBefore(expiresAt)
}

export default {
  getToken
}
