import test from 'ava'
import sinon from 'sinon'
import * as bikes from '../../src/controllers/add-bike'
import BikesModel from '../../src/models/bikes'

const bikesHandler = bikes.handler
const addBike = bikes.addBike

test.beforeEach((t) => {
  t.context.sandbox = sinon.sandbox.create()
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('Getting a single bike => The handler function should return a 200 event when called.', async (t) => {
  const event = { body: "{\"name\": \"Test-bike\", \"description\": \"description\", \"price\": \"450\" }" }
  const bikesModel = new BikesModel()

  const handler = await bikesHandler(event, bikesModel)
  const body = JSON.parse(handler.body)
  t.is(handler.statusCode, 200)
  t.true(typeof body.data === 'object')
  t.true(body.data.hasOwnProperty('bikeId'))
  t.true(typeof body.data.bikeId === 'number')
})

test('Adding a bike => Returns a 500 when unable to connect to the database.', async (t) => {
  const bikesModel = new BikesModel()
  const event = { body: "{\"name\": \"Test-bike\", \"description\": \"description\", \"price\": \"450\" }" }
  const error = new Error();
  error.statusCode = 500
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .rejects(error)

  const bikesCall = await addBike(event, bikesModel)
  const body = JSON.parse(bikesCall.body)

  t.true(initSpy.calledOnce)
  t.is(bikesCall.statusCode, 500)
  t.is(body.message, 'Something went wrong')
})

test('Adding a bike => Returns a 400 when there the bike is not found.', async (t) => {
  const bikesModel = new BikesModel()
  const event = { body: "{\"name\": \"Test-bike\", \"description\": \"description\", \"price\": \"450\" }" }
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .returns({
      find () {
        return {
          sort () {
            return { toArray: () => Promise.resolve([{}, {}]) }
          }
        }
      },
      insertOne () {
        return {
          insertedCount: 0
        }
      },
    })

  const bikesCall = await addBike(event, bikesModel)
  const body = JSON.parse(bikesCall.body)

  t.is(bikesCall.statusCode, 400)
  t.is(body.status, 'fail')
  t.is(body.data.message, 'Unable to insert new bike.')
})
