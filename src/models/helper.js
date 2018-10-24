export default class Helper {

  /**
   * Format's error objects into a JSEND error format.
   * @param {Object} error An error object passed from another model. 
   */
  static formatError (error) {
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
}