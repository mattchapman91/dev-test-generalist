import test from 'ava'
import sinon from 'sinon'
import MongoClient from 'mongodb'

import BikesModel from '../../src/models/bikes'
let  bikesModel

test.beforeEach((t) => {
  t.context.sandbox = sinon.sandbox.create()
  bikesModel = new BikesModel()
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('BikesModel => get all bikes returns a list of bikes when successful.', async (t) => {
  const getAllBikes = await bikesModel.getAllBikes()

  t.true(typeof getAllBikes === 'object')
  t.true(getAllBikes.length > 0)
  t.true(getAllBikes[0].hasOwnProperty('bikeId'))
})

test('BikesModel => init function returns the bikesCollection when sucessful', async (t) => {
  const initCall = await bikesModel.init()
  t.true(typeof initCall === 'object')
})

test('BikesModel => init function throws an error when unable to connect', async (t) => {
  t.context.sandbox.stub(MongoClient, 'connect')
    .rejects({})

    const expectedError = new Error()
    expectedError.statusCode = 500

  try {
    await bikesModel.init()
  } catch (error) {
    t.deepEqual(error, expectedError)
  }
})

test('BikesModel => get all bikes function returns an error when it can\'t query the database', async (t) => {
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .resolves()

  const expectedError = new Error()
  expectedError.statusCode = 500

  try {
    await bikesModel.getAllBikes()
  } catch (error) {
    t.deepEqual(error, expectedError)
  }

  t.true(initSpy.calledOnce)
})