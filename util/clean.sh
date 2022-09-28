#!/bin/bash

set -v

aws s3 rm s3://"$(aws s3api list-buckets --query 'Buckets[0].Name' --output text)" --recursive
sleep 2
aws cloudformation delete-stack --stack-name $(aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE --query 'StackSummaries[0].StackName' --output text)
sleep 2
aws cloudformation delete-stack --stack-name $(aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE --query 'StackSummaries[0].StackName' --output text)
