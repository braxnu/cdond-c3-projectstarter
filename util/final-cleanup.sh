#!/bin/bash

if [ -z "$CIRCLE_WORKFLOW_ID" ]; then
  echo "CIRCLE_WORKFLOW_ID not set"
  exit 1
fi


BUCKET_NAME_LIST=$(aws s3api list-buckets \
  --query 'Buckets[*].Name' \
  --output text)

for BUCKET_NAME in $BUCKET_NAME_LIST; do
  if [[ "$BUCKET_NAME" != *"$CIRCLE_WORKFLOW_ID"* ]]; then
    echo "Deleteing the obsolete bucket $BUCKET_NAME"
    aws s3 rm s3://$BUCKET_NAME --recursive
  fi
done


STACK_NAME_LIST=$(aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE DELETE_FAILED \
  --query 'StackSummaries[*].StackName' \
  --output text)

for STACK_NAME in $STACK_NAME_LIST; do
  if [[ "$STACK_NAME" != *"$CIRCLE_WORKFLOW_ID"* ]]; then
    echo "Deleteing the obsolete stack $STACK_NAME"
    aws cloudformation delete-stack --stack-name $STACK_NAME
  fi
done
