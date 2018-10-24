import BikesModel from '../models/bikes'

/**
 * Get's all available bikes from the bikes collection in the database.
 *
 * @param {Object} event The event passed to Lambda from API gateway
 * @param {Object} bikesModel The bikes model, passed in from the handler for testing purposes
 * 
 * @returns {Object} Returns an object in the format accepted by API gateway, The response format follows
 * the JSEND standard.
 */
const getBikes = async (event, bikesModel) => {
  let bikes
  try {
    bikes = await bikesModel.getAllBikes()
  } catch (error) {
    const statusCode = error.statusCode ? error.statusCode : 400
    const status = String(statusCode)[0] === '5' ? 'error' : 'fail'
    let message = error.message ? error.message : 'Something went wrong'

    let responseBody = { status: status }

    if (status === 'error') {
      responseBody.message = message
    } else {
      responseBody.data = { message }
    }

    return {
      statusCode,
      body: JSON.stringify(responseBody),
      headers: {}
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({status: 'success', data: bikes}),
    headers: {}
  }
}

/**
 * Handler function, instances the BikesModel and calls the getBikes function.
 *
 * @returns {Promise} Returns a promise to API gateway
 */
const handler = async (event) => {
  const bikesModel = new BikesModel()
  return getBikes(event, bikesModel)
}

export { handler, getBikes }
