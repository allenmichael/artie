const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

let response;

exports.lambdaHandler = async (event, context) => {
    const params = {
        ExpressionAttributeValues: {
            ':id': event.pathParameters.documentId,
            ':v': 'v'
        },
        KeyConditionExpression: 'documentId = :id and begins_with(documentInfo, :v)',
        TableName: tableName
    };
    try {
        const result = await docClient.query(params).promise();
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                count: result.Count,
                versions: result.Items.map(i => i.documentInfo)
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
