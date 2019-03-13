const cryptoLib = require('./crypto/index');
const _ = require('lodash');
const AWSXRay = require('aws-xray-sdk');

class Petunia {
    hi() {
        console.log('hi');
        console.log(_.random(40));
    }
    
    encrypt(hashlock, body) {
        return cryptoLib.encrypt(hashlock, body);
    }

    async log(evt, service) {
        const pathParams = evt.pathParameters || {};
        const serviceName = service || 'petunia';
        console.log(serviceName);
        console.log(pathParams);
    }

    wrapAWSSDK() {
        return AWSXRay.captureAWS(require('aws-sdk'));
    }
}
module.exports = new Petunia();