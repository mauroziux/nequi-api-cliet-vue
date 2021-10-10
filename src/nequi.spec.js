// nequi.spec.js
import nequi from './main'
import { createLocalVue } from '@vue/test-utils'
jest.setTimeout(30000);

// se requiere para leer las variables del .env
require('dotenv').config()

//Definicion de constantes
const localVue = createLocalVue()
const messageID = ( Math.random() + 1 ).toString(36).substring(2)
const PENDIENTE = '33'
const REALIZADO = '35'

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

it('get qr nequi && check pendent paymentQR', async () => {
  expect.assertions(1)
  const value = 10 //valor en pesos
  const reference = 'referencia' //Cualquier dato adicional relacionado con el cobro
  const codeQR = await localVue.prototype.$nequi.generateQR({ value, messageID, reference })
  const { status } = await localVue.prototype.$nequi.getStatusPayment({ codeQR, messageID })
  
  return expect(codeQR).toContain(messageID) && expect(status).toBe(PENDIENTE)
})

it('check success paymentQR', async () => {
  const codeQR = 'C001-10011-123456S893'
  const messageID = '123456S893'
  const { status } = await localVue.prototype.$nequi.getStatusPayment({ codeQR, messageID })
  
  return expect(status).toBe(REALIZADO)
})

it('revertion paymentQR', async () => {
  const value = '10'
  const messageID = '123456SS7896' //cambiarlo por uno existente
  const phoneNumber = '3017707049' //cambiarlo por uno existente
  
  return expect(await localVue.prototype.$nequi.reverseTransaction({ value, messageID, phoneNumber })).toBe(false)
})
