
aws cloudformation package \
	--template-file deploy.yaml \
	--output-template-file serverless-output.yaml \
	--s3-bucket meetup-stacks

aws cloudformation deploy \
	--template-file /Users/matt/Projects/lambda/kinesis/serverless-output.yaml \
	--stack-name kinesis-stack \
	--capabilities CAPABILITY_IAM

aws cloudformation delete-stack \
	--stack-name kinesis-stack

