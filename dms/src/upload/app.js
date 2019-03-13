const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.lambdaHandler = async (event, context) => {
    console.log(event);
    console.log(event.Records);
    console.log(event.Records[0]);
    console.log(event.Records[0].s3);
    console.log(event.Records[0].userIdentity);
}