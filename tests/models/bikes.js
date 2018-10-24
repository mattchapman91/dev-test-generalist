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

test('BikesModel => getBike should return the document when it exists', async (t) => {
  const getBike = await bikesModel.getBike(1)

  t.true(typeof getBike === 'object')
  t.true(getBike.hasOwnProperty('bikeId'))
  t.true(getBike.hasOwnProperty('name'))
  t.true(getBike.hasOwnProperty('description'))
  t.true(getBike.hasOwnProperty('price'))
})

test('BikesModel => validateNewBike => Returns true when data matches the schema.', async (t) => {
  const fields = {
    name: 'Test Name',
    description: 'Test description',
    price: '999'
  }

  const event = { body: JSON.stringify(fields) }

  const validate = await bikesModel.validateNewBike(event)
  t.true(validate)
})

test('BikesModel => validateNewBike => Throws an error when data doesn\'t match the schema.', async (t) => {
  const fields = {
    description: 'Test Name',
    price: '999'
  }
  const event = { body: JSON.stringify(fields) }

  try {
    await bikesModel.validateNewBike(event)
  } catch (e) {
    t.is(e.message, '"name" is required')
  }
})

test('BikesModel => addBike should the new document when adding of the bike is sucessful.', async (t) => {
  const expectedError = new Error('')
  expectedError.statusCode = 500

  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .returns({
      insertOne () {
        rejects()
      },
      find () {
        return {
          sort () {
            return { toArray: () => Promise.resolve([{}, {}]) }
          }
        }
      }
    })

  const newBike = { body: "{\"name\": \"test\", \"description\": \"test\", \"price\": \"50\"}" }

  try {
    await bikesModel.addBike(newBike)
  } catch (error) {
    t.true(initSpy.calledOnce) // If this is called twice then we haven\'t passed in our database connection to getAllBikes
    t.deepEqual(error, expectedError)
  }
})

test('BikesModel => addBike should return the document when adding a newBike.', async (t) => {
  const newBike = { body: "{\"bikeId\": \"test-id\", \"name\": \"test\", \"description\": \"test\", \"price\": \"50\"}" }

  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .returns({
      insertOne () {
        return {
          insertedCount: 1,
          ops: [newBike.body]
        }
      },
      find () {
        return {
          sort () {
            return { toArray: () => Promise.resolve([{}, {}]) }
          }
        }
      }
    })

  const insertedBike = await bikesModel.addBike(newBike)
  t.is('test-id', JSON.parse(insertedBike).bikeId)
})

test('BikesModel => addBike should return an error when unable to add the bike.', async (t) => {
  const expectedError = new Error('Unable to insert new bike.')
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .returns({
      insertOne () {
        return {
          insertedCount: 0
        }
      },
      find () {
        return {
          sort () {
            return { toArray: () => Promise.resolve([{}, {}]) }
          }
        }
      }
    })

  const newBike = { body: "{\"name\": \"test\", \"description\": \"test\", \"price\": \"50\"}" }

  try {
    await bikesModel.addBike(newBike)
  } catch (error) {
    t.true(initSpy.calledOnce) // If this is called twice then we haven\'t passed in our database connection to getAllBikes
    t.deepEqual(error, expectedError)
  }
})

test('BikesModel => getBike should return an error when the bike doesn\'t exist.', async (t) => {
  const expectedError = new Error('No bike with id invalid-id found.')

  try {
    await bikesModel.getBike('invalid-id')
  } catch (error) {
    t.deepEqual(error, expectedError)
  }
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

test('BikesModel => getBike function returns an error when it can\'t query the database', async (t) => {
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .resolves()

  const expectedError = new Error()
  expectedError.statusCode = 500

  try {
    await bikesModel.getBike(1)
  } catch (error) {
    t.deepEqual(error, expectedError)
  }

  t.true(initSpy.calledOnce)
})

test('BikesModel => getAllBikes function returns an error when it can\'t query the database', async (t) => {
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

test('BikesModel => getting a bike by bikeId should return a 500 when unable to query the database', async (t) => {
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