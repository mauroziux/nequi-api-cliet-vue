// nequi.spec.js
import nequi from './main'
import { createLocalVue } from '@vue/test-utils'
require('dotenv').config()

const localVue = createLocalVue()
localVue.use(nequi, {
  clientId: process.env.NEQUI_CLIENT_ID,
  clientSecret: process.env.NEQUI_CLIENT_SECRET,
  apiKey: process.env.NEQUI_API_KEY,
})

it('adds an $nequi method to the Vue prototype', () => {
  expect(typeof localVue.prototype.$nequi).toBe('object')
})

it('get token nequi', async () => {
  expect.assertions(1)
  const data = await localVue.prototype.$nequi.getToken()
  return expect(data).toContain('Bearer')
  
})

it('get qr nequi', async () => {
  let messageID = ( Math.random() + 1 ).toString(36).substring(2)
  expect.assertions(1)
  const data = await localVue.prototype.$nequi.generateQR(10, messageID, 'miproteina')
  return expect(data).toContain(messageID)
})
