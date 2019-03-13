const AWS = require('aws-sdk');
const QUEUE_URL = process.env.QUEUE;
const sqs = new AWS.SQS();
exports.lambdaHandler = async (event, context) => {
    const record = (event.Records && event.Records.length > 0) ? event.Records[0] : null;
    if (record) {
        const params = {
            MessageAttributes: {
                "Service": {
                    DataType: "String",
                    StringValue: record.eventSource
                },
                "Region": {
                    DataType: "String",
                    StringValue: record.awsRegion
                },
                "EventType": {
                    DataType: "String",
                    StringValue: record.eventName
                }
            },
            MessageBody: JSON.stringify({ serviceName: `petunia-files::${record.eventName}` }),
            QueueUrl: QUEUE_URL
        };
        const result = await sqs.sendMessage(params).promise();
        console.log(result);
    }
    return;

}