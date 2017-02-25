## Lambda Examples

The commands below use the Serverless Access Model (SAM) to create
and deploy AWS APIGateway endpoints backed by AWS Lambda functions.

The scripts below expect:
- `aws cli` installed (`pip install --upgrade --user awscli`)
- ~/.aws/credentials and ~/.aws/config setup and configured

## Serverless Application Model
Let's start using the [AWS Serverless Application Model (SAM)](https://aws.amazon.com/blogs/compute/introducing-simplified-serverless-application-deplyoment-and-management/).

References:
- [Create Your Own Serverless Application](http://docs.aws.amazon.com/lambda/latest/dg/serverless-deploy-wt.html)
- [Using an automation pipeline](http://docs.aws.amazon.com/lambda/latest/dg/automating-deployment.html)
- [HOWTO on github](https://github.com/awslabs/serverless-application-model/blob/master/HOWTO.md)


```shell
    ##### start here #####
    aws cloudformation package \
        --template-file sam-albums.yaml \
        --output-template-file new_hello.yaml \
        --s3-bucket www.zrofux.com
    aws cloudformation deploy \
        --template-file /Users/matt/presentation/sam-albums/new_hello.yaml \
        --stack-name hello-stack \
        --capabilities CAPABILITY_IAM

    ##### status #####
    aws cloudformation describe-stacks \
        --stack-name example-stack
    aws cloudformation describe-stacks \
        --stack-name example-stack \
        --query Stacks[0].StackStatus
    ##### delete #####
    aws cloudformation delete-stack \
        --stack-name example-stack
```
