## Lambda Examples

The commands below can be used to create, bundle, deploy and invoke 
lambda function, index.js.  The update example can change the handler 
to myHandler.js, demonstrate invokation and finally cleanup the
resources.

    sh -x ./example-create.sh 
    sh -x ./example-test.sh > result.json 
    node read.js ./result.json 
    sh -x ./example-update.sh 
    sh -x ./example-test.sh > result.json 
    node read.js ./result.json 
    sh -x ./example-cleanup.sh 
