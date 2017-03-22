```bash
aws cloudformation package \
	--template-file template.yaml \
	--s3-bucket meetup-stacks \
	--output-template-file new-template.yaml
aws cloudformation deploy \
	--template-file /Users/matt/Projects/aws-vmx-meetup/2017-03-22/crud/new-template.yaml \
	--stack-name crud-stack \
	--capabilities CAPABILITY_IAM
aws cloudformation describe-stacks \
	--stack-name crud-stack

http https://qm7b6fx3fg.execute-api.us-west-2.amazonaws.com/Stage/resource/foo
http PUT https://qm7b6fx3fg.execute-api.us-west-2.amazonaws.com/Stage/resource/foo

aws cloudformation delete-stack \
	--stack-name crud-stack
```
