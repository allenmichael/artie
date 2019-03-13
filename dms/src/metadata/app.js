const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

let response;

exports.get = async (event, context) => {
    const params = {
        ExpressionAttributeValues: {
            ':id': event.pathParameters.documentId,
            ':md': 'metadata'
        },
        KeyConditionExpression: 'documentId = :id and begins_with(documentInfo, :md)',
        TableName: tableName
    };
    try {
        const result = await docClient.query(params).promise();
        let md = {};
        if (result.Items > 0) {
            md = result.Items[0].metadata;
        }
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                metadata: md
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};

exports.post = async (event, context) => {
    const id = event.pathParameters.documentId;
    const md = event.body || {};
    const params = {
        Item: {
            documentId: id,
            documentInfo: 'metadata',
            metadata: md
        },
        ConditionExpression: 'attribute_not_exists(metadata)',
        TableName: tableName
    };
    try {
        const result = await docClient.put(params).promise();
        let md = {};
        if (result.Items > 0) {
            md = result.Items[0].metadata;
        }
        response = {
            'statusCode': 201,
            'body': JSON.stringify({
                metadata: md
            })
        }
    } catch (err) {
        console.log(err);
        if (err.code === 'ConditionalCheckFailedException') {
            return {
                'statusCode': '409',
                'body': JSON.stringify({
                    message: `Document ${id} already has metadata.`
                })
            }
        }
        return err;
    }

    return response
};
