#!/bin/bash

. example-defines.sh

aws lambda invoke \
	--invocation-type RequestResponse \
	--function-name $function \
	--region $region \
	--log-type Tail \
	--payload file://$function-data.json \
	outputfile.txt
