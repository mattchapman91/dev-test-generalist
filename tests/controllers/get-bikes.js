import test from 'ava'
import sinon from 'sinon'
import * as bikes from '../../src/controllers/get-bikes'
import BikesModel from '../../src/models/bikes'

const bikesHandler = bikes.handler
const getBikes = bikes.getBikes

test.beforeEach((t) => {
  t.context.sandbox = sinon.sandbox.create()
})

test.afterEach((t) => {
  t.context.sandbox.restore()
})

test('Get all Bikes => The handler function should return a 200 with all the bikes found.', async (t) => {
  const handler = await bikesHandler()

  const body = JSON.parse(handler.body)
  t.is(handler.statusCode, 200)
  t.true(typeof body.data === 'object')
  t.true(body.data[0].hasOwnProperty('bikeId'))
})

test('Get all Bikes => Should return 500 with a generic error message when unable to connect to MongoDB.', async (t) => {
  const bikesModel = new BikesModel()
  const error = new Error();
  error.statusCode = 500
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .rejects(error)

  const bikesCall = await getBikes({}, bikesModel)
  const body = JSON.parse(bikesCall.body)

  t.true(initSpy.calledOnce)
  t.is(bikesCall.statusCode, 500)
  t.is(body.message, 'Something went wrong')
})

test('Get all Bikes => Returns a 400 when there are no bikes found.', async (t) => {
  const bikesModel = new BikesModel()
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .returns({
      find () {
        return {
          sort () {
            return { toArray: () => Promise.resolve([]) }
          }
        }
      },
    })


  const bikesCall = await getBikes({}, bikesModel)
  const body = JSON.parse(bikesCall.body)

  t.true(initSpy.calledOnce)
  t.is(bikesCall.statusCode, 400)
  t.is(body.data.message, 'No bikes found.')
})

test('Get all Bikes => Returns a 200 when bikes are found.', async (t) => {
  const bikesModel = new BikesModel()
  const initSpy = t.context.sandbox.stub(bikesModel, 'init')
    .returns({
      find () {
        return {
          sort () {
            return { toArray: () => Promise.resolve([{}, {}]) }
          }
        }
      }
    })

  const bikesCall = await getBikes({}, bikesModel)
  const body = JSON.parse(bikesCall.body)
  t.true(initSpy.calledOnce)
  t.is(bikesCall.statusCode, 200)
  t.true(body.data.length > 0)
})
