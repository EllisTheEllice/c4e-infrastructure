exports.handler = async (event) => {
    var AWS = require('aws-sdk');
    var data= event.body.data;
    var status=event.body.statusCode;
    const maxLength=350;

    const responseOk = {
        statusCode: 200,
        body: JSON.stringify('Ok!'),
    };

    const responseFailure={
        statusCode: 400,
        body: data
    };

            //first, check if previous captcha varification was successful
  if (status != 200) {
    return responseFailure;
  }

    var strippedMessage=data.message.replace(/(<([^>]+)>)/gi, "");

    if(strippedMessage.length>maxLength){
      return responseFailure;
    }

    var message=strippedMessage.replace(/(?:\r\n|\r|\n)/g, '<br>');
    var articleId=data.articleId;
    var nickname=data.nickname;



    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var params = {
          TableName: process.env.CommentTable,
          Item: {
            'timestamp' : {N: ""+Date.now()},
            'articleId' : {S: articleId},
            'message':  {S: message},
            'nickname': {S: nickname }
          }
        };




console.log("putting item:");
console.log(params);
// Call DynamoDB to add the item to the table
try{
  var result = await ddb.putItem(params).promise();
  console.log(result);
}catch(err){
  console.log(err);
  return responseFailure;
}

    return responseOk;
};