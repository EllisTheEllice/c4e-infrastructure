/*
  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict'

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 */

const { saveFormData } = require('./dynamodb')
const { sendEmail } = require('./ses')


// Main Lambda entry point
exports.handler = async (event) => {
  console.log('event:');
  console.log(event);
  console.log('event.body:')
  console.log(event.body);
  var payload = event.body;
  const formData = payload.data;
  const status = payload.statusCode;

  if (status != 200) {
    return generateResponse(500, payload.message);
  }

  try {
    // Send email and save to DynamoDB in parallel using Promise.all
    await Promise.all([sendEmail(formData), saveFormData(formData)])

    return generateResponse(200, "Ok!");
  } catch (err) {
    console.error(`handler error: ${err.message}`)
    return generateResponse(500, err.message);
  }
}

function generateResponse(status, message) {
  return {
    statusCode: status,
    message: message
  }
}