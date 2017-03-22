#!/bin/bash

. example-defines.sh

/usr/bin/zip myHandler myHandler.js

aws lambda update-function-code \
	--region $region \
	--function-name $function \
	--zip-file fileb://myHandler.zip \
	--profile default

aws lambda update-function-configuration \
	--function-name $function \
	--handler myHandler.handler
