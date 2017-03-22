#!/bin/bash

. example-defines.sh

lambda_execution_role_arn=$(aws iam create-role \
  --role-name "$lambda_execution_role_name" \
  --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "",
          "Effect": "Allow",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }' \
  --output text \
  --query 'Role.Arn'
)
echo lambda_execution_role_arn=$lambda_execution_role_arn

aws iam put-role-policy \
  --role-name "$lambda_execution_role_name" \
  --policy-name "$lambda_execution_access_policy_name" \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "logs:*"
        ],
        "Resource": "arn:aws:logs:*:*:*"
      }
    ]
  }'

/usr/bin/zip $function index.js

sleep 5

aws lambda create-function \
	--region $region \
	--function-name $function \
	--zip-file fileb://$function.zip \
	--role arn:aws:iam::$account:role/$lambda_execution_role_name \
	--handler index.handler \
	--runtime nodejs4.3 \
	--profile default

