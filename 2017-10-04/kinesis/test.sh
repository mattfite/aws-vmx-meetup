#!/bin/sh

stream=$(aws cloudformation describe-stacks \
    --stack-name kinesis-stack \
    --query 'Stacks[0].Outputs[?OutputKey==`Stream`].OutputValue' \
    --output text)

echo "stream: $stream"

aws kinesis put-record \
    --stream-name $stream \
    --data "This is a test. final" \
    --partition-key shardId-000000000000 \
    --region us-west-2 \
    --profile admin

# should be able to verify that lambda has executed 1 time
