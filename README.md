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


    sh -x ./example-create.sh 
    sh -x ./example-test.sh > result.json 
    node read.js ./result.json 
    sh -x ./example-update.sh 
    sh -x ./example-test.sh > result.json 
    node read.js ./result.json 
    sh -x ./example-cleanup.sh 
