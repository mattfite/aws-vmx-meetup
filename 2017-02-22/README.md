## Lambda Examples

The commands below can be used to create, bundle, deploy and invoke 
lambda function, index.js.  The update example can change the handler 
to myHandler.js, demonstrate invokation and finally cleanup the
resources.

The scripts below expect:
- `AWS_ACCOUNT` environment variable to be set in your shell.  I.e., `export 
AWS_ACCOUNT=1234567890`
- `aws cli` installed (`pip install --upgrade --user awscli`)
- ~/.aws/credentials and ~/.aws/config setup and configured

## Serverless Application Model
Let's start using the [AWS Serverless Application Model (SAM)](https://aws.amazon.com/blogs/compute/introducing-simplified-serverless-application-deplyoment-and-management/).

References:
- [Create Your Own Serverless Application](http://docs.aws.amazon.com/lambda/latest/dg/serverless-deploy-wt.html)
- [Using an automation pipeline](http://docs.aws.amazon.com/lambda/latest/dg/automating-deployment.html)
- [HOWTO on github](https://github.com/awslabs/serverless-application-model/blob/master/HOWTO.md)


```shell
    sh -x ./example-create.sh 
    sh -x ./example-test.sh > result.json 
    node read.js ./result.json 
    sh -x ./example-update.sh 
    sh -x ./example-test.sh > result.json 
    node read.js ./result.json 
    sh -x ./example-cleanup.sh 

    aws cloudformation create-stack \
        --stack-name example-stack \
        --template-body \
        file://example-stack.yaml
    aws cloudformation describe-stacks \
        --stack-name example-stack
    aws cloudformation describe-stacks \
        --stack-name example-stack \
        --query Stacks[0].StackStatus
    aws cloudformation delete-stack \
        --stack-name example-stack

    aws cloudformation package \
        --template-file example-stack.yaml \
        --output-template-file serverless-output.yaml \
        --s3-bucket meetup-stacks
    aws cloudformation deploy \
        --template-file serverless-output.yaml \
        --stack-name example-stack \
        --capabilities CAPABILITY_IAM

```
