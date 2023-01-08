#!/bin/bash



#!/bin/bash

STACK_NAME="Test-Project"

# The name of an S3 bucket on your account to hold deployment artifacts.
BUILD_ARTIFACT_BUCKET="demo-codepipeline-code-deploy"

#Output file Name
OUTPUT_TEMPLATE_FILE="package1.yml"

# Create Packege File
aws cloudformation package --template-file CodePipeline.yml --s3-bucket "$BUILD_ARTIFACT_BUCKET" --output-template-file "$OUTPUT_TEMPLATE_FILE"

echo "Executing aws cloudformation deploy..."

# Deploy CodePipeline
aws cloudformation deploy --template-file "$OUTPUT_TEMPLATE_FILE" --stack-name "$STACK_NAME" --capabilities CAPABILITY_NAMED_IAM



### Git Commit

# git status

# git add .

# git commit -m "msg"

# branchName = "master"

# git push origin $branchName

# STACK_NAME=$1
# REGION=$2

# echo "====================="
# echo STACK_NAME = $STACK_NAME REGION = $REGION
# echo validate stack status ...
# STACK_STATUS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION | jq -r '.Stacks[] .StackStatus')

# # if [[ "$STACK_STATUS" =~ ^(UPDATE_COMPLETE|CREATE_COMPLETE|IMPORT_COMPLETE)$ ]]; then
# #     echo "$STACK_STATUS: stack status is healthy"
# # else
# #     echo "$STACK_STATUS: stack status is NOT healthy";
# #     exit 1;
# # fi


# if [[ $STACK_STATUS =~ ^(UPDATE_COMPLETE|CREATE_COMPLETE|IMPORT_COMPLETE)$ ]]; then echo $STACK_STATUS: stack status is healthy; else echo $STACK_STATUS: stack status is NOT healthy; exit 1; fi
