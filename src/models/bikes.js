import MongoClient from 'mongodb'

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
   * Queries the database for all bikes and formats them into an array format.
   *
   * @returns {Array} An array containing all bikes
   * @throws Either a 500 when the error is unexpected or a 400 when there are no bikes found.
   */
  async getAllBikes (database) {
    if (!database) {
      const database = await this.init()
    }
    
    let bikes

    try {
      bikes = await database.find({}).toArray()
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
