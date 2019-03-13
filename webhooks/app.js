
const axios = require('axios')
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
let response;

exports.lambdaHandler = async (event, context) => {
    const records = event.Records;
    const params = {
        TableName: tableName
    };
    try {
        const result = await docClient.scan(params).promise();
        const notify = [];
        const notifications = [];
        result.Items.forEach(item => {
            console.log(item);
            if (item.url) {
                notify.push(item.url);
            }
        });
        records.forEach(record => {
            try {
                const message = JSON.parse(record.body);
                notify.forEach(url => {
                    notifications.push(axios.post(url, { 'service': message.serviceName }));
                })
            } catch (e) {
                console.log(e);
            }
        });
        const finished = await Promise.all(notifications);

        console.log(finished);

    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
