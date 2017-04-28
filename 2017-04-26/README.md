### Let's Talk About CloudFormation

The following help demonstrate some of the capabilities of CloudFormation (CF).  We start
with a small stack, VPC, to illustrate some CF concepts and then build upon them.

CF templates are used to create `stacks`

A CF template has the following sections

```yaml
---
AWSTemplateFormatVersion: "version date"

Description:
  String

Metadata:
  template metadata

Parameters:
  set of parameters

Mappings:
  set of mappings

Conditions:
  set of conditions

Transform:
  set of transforms

Resources:
  set of resources

Outputs:
  set of outputs
```

The only sections that are required are:
- AWSTemplateFormatVersion
- Resources

all other sections are optional.

## Example 1: Create a VPC


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
```

## Example 2: Create a Security Group
Building on the previous example, create a security group that allows ingress and 
egress for:
- HTTP: port 80
-  SSH: port 22

This stack depends on the previous stack `vpc-stack` to have been created

```shell
    aws cloudformation create-stack \
        --stack-name sg-stack \
        --template-body file://sg.yaml \
        --parameters ParameterKey=VPCStack,ParameterValue=vpc-stack,UsePreviousValue=false

    aws cloudformation describe-stacks \
        --stack-name sg-stack
    aws cloudformation describe-stacks \
        --stack-name sg-stack \
        --query Stacks[0].StackStatus
    aws cloudformation delete-stack \
        --stack-name sg-stack
```

## Example 3: Create an EC2 Instance

```shell
    aws cloudformation create-stack \
        --stack-name ec2-stack \
        --template-body file://ec2.yaml \
        --parameters '[
                       {
                        "ParameterKey": "VPCStack",
                        "ParameterValue": "vpc-stack",
                        "UsePreviousValue": false
                       },
                       {
                        "ParameterKey": "SGStack",
                        "ParameterValue": "sg-stack",
                        "UsePreviousValue": false
                       }
                      ]'

    aws cloudformation describe-stacks \
        --stack-name ec2-stack
    aws cloudformation describe-stacks \
        --stack-name ec2-stack \
        --query Stacks[0].StackStatus
    aws cloudformation delete-stack \
        --stack-name ec2-stack
```

## Example 4: Run a periodic function

```shell
    aws cloudformation package \
            --template-file periodic.yaml \
            --s3-bucket meetup-stacks \
            --output-template-file new-template.yaml

    aws cloudformation deploy \
            --template-file /Users/matt/Projects/aws-vmx-meetup/2017-04-26/new-template.yaml \
            --stack-name canary-stack \
            --capabilities CAPABILITY_IAM \
            --parameter-overrides NotificationEmail=mattfite-auto@gmail.com

    aws cloudformation delete-stack \
            --stack-name canary-stack
```

## Example 5: Create an load-balanced, auto-scaling, multi-AZ Web Server

This example creates an load-balanced, auto-scaling, multi-AZ web server that
runs an Apache web server with a custom page.

```shell
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
            OperatorEMail='mattfite-auto@gmail.com' \
            KeyName='laptop'

    aws cloudformation delete-stack \
            --stack-name auto-az-stack
```

## Example 6: Lambda 'Chaos Primate'
This example helps validate that instances created in the auto-az stack will 
self-heal, because it will terminate instances it finds.

This creates a lambda function that looks for untagged instances and turns them off.

Improvements:
- accept an input for VPC
- validate the rate parameter input with a RegExp
- accept an input for what tags it should or should not look for to 
determine if it should terminate or not
- consider introducing random termination


```shell
    aws cloudformation package \
            --template-file terminate.yaml \
            --s3-bucket meetup-stacks \
            --output-template-file new-template.yaml

    aws cloudformation deploy \
            --template-file /Users/matt/Projects/aws-vmx-meetup/2017-04-26/new-template.yaml \
            --stack-name terminate-stack \
            --capabilities CAPABILITY_IAM \
            --parameter-overrides Rate='rate(2 minutes)'

    aws cloudformation delete-stack \
            --stack-name terminate-stack

```
