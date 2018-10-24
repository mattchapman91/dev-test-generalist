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

test('Get Bike by ID => Should return a 200 with the requested bike if it exists.', async (t) => {
  const event = { pathParameters: {"id": 1} }
  const bikesModel = new BikesModel()

  const handler = await bikesHandler(event, bikesModel)

  const body = JSON.parse(handler.body)
  t.is(handler.statusCode, 200)
  t.true(typeof body.data === 'object')
  t.true(body.data.hasOwnProperty('bikeId'))
  t.is(body.data.bikeId, 1)
})

test('Get Bike by ID => Should return 500 with a generic error message when unable to connect to MongoDB.', async (t) => {
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

test('Get Bike by ID => Returns a 400 when no bike with the inputted ID exists.', async (t) => {
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

test('Get Bike by ID => Should return a 200 with the requested bike\'s document.', async (t) => {
  const bikesModel = new BikesModel()
  t.context.sandbox.stub(bikesModel, 'init')
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