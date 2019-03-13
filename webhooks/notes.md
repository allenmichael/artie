sam package --template-file template.yaml --s3-bucket amsxbg-sar --output-template out.yaml

sam publish -t out.yaml

aws sqs send-message --queue-url 'https://sqs.us-west-2.amazonaws.com/812570870442/serverlessrepo-amsxbg-webhooks-WebhooksQueue-I752NRH5KDLJ' --message-body '{"serviceName":"petunia-cli"}'

# SAM Templates

sam deploy --template-file out.yaml --stack-name STACK --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND