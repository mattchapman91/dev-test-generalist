import test from 'ava'
import sinon from 'sinon'
import * as bikes from '../../src/controllers/get-bike'
import BikesModel from '../../src/models/bikes'

const bikesHandler = bikes.handler
const getBike = bikes.getBike

test.beforeEach((t) => {
  t.context.sandbox = sinon.sandbox.create()
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('Getting a single bike => The handler function should return a 200 event when called.', async (t) => {
  const event = { pathParameters: {"id": 1} }
  const bikesModel = new BikesModel()

  const handler = await bikesHandler(event, bikesModel)

  const body = JSON.parse(handler.body)
  t.is(handler.statusCode, 200)
  t.true(typeof body.data === 'object')
  t.true(body.data.hasOwnProperty('bikeId'))
  t.is(body.data.bikeId, 1)
})

test('Getting a single => Returns a 500 when unable to connect to the database.', async (t) => {
  const bikesModel = new BikesModel()
  const error = new Error();
  error.statusCode = 500
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .rejects(error)

  const bikesCall = await getBike({ pathParameters: {"id": 1} }, bikesModel)
  const body = JSON.parse(bikesCall.body)

  t.true(initSpy.calledOnce)
  t.is(bikesCall.statusCode, 500)
  t.is(body.message, 'Something went wrong')
})

test('Getting a single bike => Returns a 400 when there the bike is not found.', async (t) => {
  const bikesModel = new BikesModel()
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .returns({
      findOne () {
        return null
      },
    })

  const bikesCall = await getBike({ pathParameters: {"id": 'invalid-id'}}, bikesModel)
  const body = JSON.parse(bikesCall.body)

  t.is(bikesCall.statusCode, 400)
  t.is(body.status, 'fail')
  t.is(body.data.message, 'No bike with id invalid-id found.')
})

test('Getting a single bike => Returns a 200 when the bike has been found.', async (t) => {
  const bikesModel = new BikesModel()
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .returns({
      findOne () {
        return {
          bikeId: 1,
          name: 'test'
        }
      },
    })

  const bikesCall = await getBike({ pathParameters: {"id": 'invalid-id'}}, bikesModel)
  const body = JSON.parse(bikesCall.body)

  t.is(bikesCall.statusCode, 200)
  t.is(body.data.bikeId, 1)
})