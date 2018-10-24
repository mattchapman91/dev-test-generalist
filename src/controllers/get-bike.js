import BikesModel from '../models/bikes'
import Helper from '../models/helper'

/**
 * Get's a single bike by the field bikeId from the bikes collection in the database.
 *
 * @param {Object} event The event passed to Lambda from API gateway
 * @param {Object} bikesModel The bikes model, passed in from the handler for testing purposes
 * 
 * @returns {Object} Returns an object in the format accepted by API gateway, The response format follows
 * the JSEND standard.
 */
const getBike = async (event, bikesModel) => {
  let bikes
  try {
    bikes = await bikesModel.getBike(event.pathParameters.id)
  } catch (error) {
    return Helper.formatError(error)
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
  return getBike(event, bikesModel)
}

export { handler, getBike }
