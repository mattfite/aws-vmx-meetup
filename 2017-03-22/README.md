### Encryption/Decryption with KMS

References:
- [AWS SAM Examples](https://github.com/awslabs/serverless-application-model/tree/master/examples/2016-10-31/encryption_proxy)


```bash
zip -r encryption_proxy.zip decryption.py encryption.py

aws s3 cp encryption_proxy.zip s3://meetup-stacks

aws cloudformation package \
        --template-file template.yaml \
        --s3-bucket meetup-stacks \
        --output-template-file new-template.yaml

aws cloudformation deploy \
        --template-file /Users/matt/Downloads/serverless-application-model-master/examples/2016-10-31/encryption_proxy/new-template.yaml \
        --stack-name encryption-stack \
        --capabilities CAPABILITY_IAM

encryptURL=$(aws cloudformation describe-stacks --stack-name encryption-stack --query 'Stacks[].Outputs[?OutputKey==`EncryptURL`].OutputValue' --output text)

echo $encryptURL

curl -H 'Content-Type: application/json' -X POST -d 'Here it is my super secret data...' ${encryptURL}

decryptURL=$(aws cloudformation describe-stacks --stack-name encryption-stack --query 'Stacks[].Outputs[?OutputKey==`DecryptURL`].OutputValue' --output text)

curl -H 'Content-Type: application/json' -X POST -d '{ "data": "AQECAHhQpIbZpZf48F7/38YaXmyVp7OmIYwIc6Zi+eDt2+vWfAAAAIAwfgYJKoZIhvcNAQcGoHEw\nbwIBADBqBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDKKmJrJoFTaGwZ+GKgIBEIA9vy+fHZTS\nZzAdLNiXkrke/AT6FI2ln49DpHBlbTEfh6cPKmIeqC8j0mM5/f5ZgstNl7dWEkMq9FcozGHozg==\n"}' ${decryptURL}

echo "wow.  this is a test" | http POST ${encryptURL}
http POST ${decryptURL} data="..."


aws cloudformation delete-stack \
        --stack-name encryption-stack

```
