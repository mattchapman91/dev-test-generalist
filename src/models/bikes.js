import MongoClient from 'mongodb'
import Joi from 'joi'

export default class BikesModel {
  /**
   * Creates a connection to the mongo database
   *
   * @throws Throws an error when unable to connect to the database.
   */
  async init () {
    let bikesCollection
    try {
      const connection = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
      const db = connection.db('test')
      bikesCollection = db.collection('bike')
    } catch (error) {
      let errorObject = new Error()
      errorObject.statusCode = 500
      throw errorObject
    }

    return bikesCollection
  }

  /**
   * Validates the new bike against the schema of allowed data for bikes.
   *
   * @return {Boolean} Returns true if the enrolment data matches the schema
   *
   * @throws {Error} The reason why the bike doesn't validate the schema
   */
  async validateNewBike(event) {
    const body = JSON.parse(event.body)

    const schema = {
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().integer().min(0).max(9999)
    }

    try {
      await Joi.validate(body, schema)
    } catch (error) {
      throw new Error(error.details[0].message)
    }

    return true
  }

  /**
   * Add's a new bike to the mongo database
   * @param {Object} event The event object passed into the lambda function containing the body.
   * 
   * 
   * @throws {Error} The reason why the bike doesn't validate the schema
   *
   */
  async addBike (event) {
    const newBike = JSON.parse(event.body)
    const database = await this.init()
    let insertedBike
    
    try {
      const allBikes = await this.getAllBikes(database)
      newBike.bikeId  = ++allBikes[0].bikeId
      insertedBike = await database.insertOne(newBike)
    } catch (e) {
      let errorObject = new Error()
      errorObject.statusCode = 500
      throw errorObject
    }

    if (insertedBike.insertedCount === 1) {
      return insertedBike.ops[0]
    }

    let errorObject = new Error('Unable to insert new bike.')
    throw errorObject
  }


  async getBike (bikeId) {
    const database = await this.init()
    let bike

    try {
      bike = await database.findOne({ bikeId: parseInt(bikeId) })
    } catch (error) {
      let errorObject = new Error()
      errorObject.statusCode = 500
      throw errorObject
    }

    if (bike === null) {
      throw new Error('No bike with id ' + bikeId + ' found.')
    }

    return bike
  }

  /**
   * Queries the database for all bikes and formats them into an array format.
   *
   * @returns {Array} An array containing all bikes
   * @throws Either a 500 when the error is unexpected or a 400 when there are no bikes found.
   */
  async getAllBikes (database) {
    if (!database) {
      database = await this.init()
    }
    let bikes

    try {
      bikes = await database.find({}).sort({ 'bikeId': -1 }).toArray()
    } catch (error) {
      let errorObject = new Error()
      errorObject.statusCode = 500
      throw errorObject
    }

    if (bikes.length === 0) {
      throw new Error('No bikes found.')
    }

    return bikes
  }
}
