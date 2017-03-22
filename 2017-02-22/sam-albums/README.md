## Lambda Examples

The commands below use the Serverless Access Model (SAM) to create
and deploy AWS APIGateway endpoints backed by AWS Lambda functions.

The scripts below expect:
- `aws cli` installed (`pip install --upgrade --user awscli`)
- ~/.aws/credentials and ~/.aws/config setup and configured
- assume you have an S3 bucket that exists with the expected 
directory structure (described below)

## Bucket structure
```
mattfite.com/
|-- albums
    |-- album1
    |-- album2
    |-- ...
    |-- people
    `-- places
```

## Testing
```bash
http https://<ENDPOINT>/<TAG>/albums
http https://<ENDPOINT>/<TAG>/albums/{album1}
```


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
        --s3-bucket meetup-stacks
    aws cloudformation deploy \
        --template-file /Users/matt/Projects/aws-vmx-meetup/2017-02-22/sam-albums/new_hello.yaml \
        --stack-name hello-stack \
        --capabilities CAPABILITY_IAM

    ##### status #####
    aws cloudformation describe-stacks \
        --stack-name hello-stack
    aws cloudformation describe-stacks \
        --stack-name hello-stack \
        --query Stacks[0].StackStatus

    #### test ####
    # http URI/albums
    # http URI/albums/album1
    # e.g., http https://5m6xjt1jfj.execute-api.us-west-2.amazonaws.com/Prod/albums/album1

    ##### delete #####
    aws cloudformation delete-stack \
        --stack-name hello-stack
```
