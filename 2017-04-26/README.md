```shell
    aws cloudformation create-stack \
        --stack-name vpc-stack \
        --template-body \
        file://vpc.yaml
    aws cloudformation describe-stacks \
        --stack-name vpc-stack
    aws cloudformation describe-stacks \
        --stack-name vpc-stack \
        --query Stacks[0].StackStatus
    aws cloudformation delete-stack \
        --stack-name vpc-stack

    aws cloudformation create-stack \
        --stack-name sg-stack \
        --template-body \
        file://sg.yaml
    aws cloudformation describe-stacks \
        --stack-name sg-stack
    aws cloudformation describe-stacks \
        --stack-name sg-stack \
        --query Stacks[0].StackStatus
    aws cloudformation delete-stack \
        --stack-name sg-stack

    aws cloudformation create-stack \
        --stack-name ec2-stack \
        --template-body \
        file://ec2.yaml
    aws cloudformation describe-stacks \
        --stack-name ec2-stack
    aws cloudformation describe-stacks \
        --stack-name ec2-stack \
        --query Stacks[0].StackStatus
    aws cloudformation delete-stack \
        --stack-name ec2-stack

    aws cloudformation package \
            --template-file periodic.yaml \
            --s3-bucket meetup-stacks \
            --output-template-file new-template.yaml

    aws cloudformation deploy \
            --template-file /Users/matt/Projects/aws-vmx-meetup/2017-04-26/new-template.yaml \
            --stack-name canary-stack \
            --capabilities CAPABILITY_IAM \
            --parameter-overrides NotificationEmail=mattfite@gmail.com

    aws cloudformation delete-stack \
            --stack-name canary-stack

    aws cloudformation package \
        --template-file auto-az.yaml \
        --s3-bucket meetup-stacks \
        --output-template-file new-template.yaml

    aws cloudformation deploy \
        --template-file /Users/matt/Projects/aws-vmx-meetup/2017-04-26/new-template.yaml \
        --stack-name auto-az-stack \
        --capabilities CAPABILITY_IAM \
        --parameter-overrides \
            InstanceType=t2.micro \
            OperatorEMail='mattfite@gmail.com' \
            KeyName='laptop'

    aws cloudformation delete-stack \
            --stack-name auto-az-stack
```
