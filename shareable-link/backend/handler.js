'use strict'

export async function hello (event) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event
      },
      null,
      2
    )
  }
}
