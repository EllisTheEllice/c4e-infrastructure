const request = require('request');
const secret = process.env.RECAPTCHA_SECRET

exports.handler = async (event) => {

    return new Promise(function (resolve, reject) {
        try {
            var eventBody = event.body;
            console.log(`Event body: ${eventBody}`)
            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + eventBody.token;
            request.post(verificationUrl, function (err, res, body) {
                let json = JSON.parse(body);
                console.log(json);
                var retVal = undefined;

                if (json.success) {
                    retVal = generateResponse(200, "Ok!", eventBody)
                } else {
                    retVal = generateResponse(500, "Error verifying captcha", json)
                }
                resolve(retVal);
            });
        } catch (err) {
            reject(err)
        }
    });
};


function generateResponse(status, message, data) {
    return {
        statusCode: status,
        data: data,
        message: message,
    }
}