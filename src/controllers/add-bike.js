import BikesModel from '../models/bikes'
import Helper from '../models/helper'

/**
 * Get's all available bikes from the bikes collection in the database.
 *
 * @param {Object} event The event passed to Lambda from API gateway
 * @param {Object} bikesModel The bikes model, passed in from the handler for testing purposes
 * 
 * @returns {Object} Returns an object in the format accepted by API gateway, The response format follows
 * the JSEND standard.
 * 
 * If the insert is sucessful the object will contain the new bike's document, if not an error/fail message.
 * 
 */
const addBike = async (event, bikesModel) => {
  let newBike
  try {
    await bikesModel.validateNewBike(event)
    newBike = await bikesModel.addBike(event)
  } catch (error) {
    return Helper.formatError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({status: 'success', data: newBike}),
    headers: {}
  }
}

/**
 * Handler function, instances the BikesModel and calls the addBike function.
 *
 * @returns {Promise} Returns a promise to API gateway
 */
const handler = async (event) => {
  const bikesModel = new BikesModel()
  return addBike(event, bikesModel)
}

export { handler, addBike }
