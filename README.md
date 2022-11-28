## S3 Bucket Upload File To Lambda Trigger And GitPush this uploaded file 

# S3-Upload-GitHub
S3 File Upload to Lambda trigger And GitHub Push with Store Upload File in GitHub Repository

## Use File in 
1.Serverless.yml
2.git-api.js

## Reference 
https://docs.github.com/en/rest/git/blobs#create-a-blob (Show Api)

https://octokit.github.io/rest.js/v19#git

http://docs2.lfe.io/v3/git/blobs/

https://dev.to/bro3886/create-a-folder-and-push-multiple-files-under-a-single-commit-through-github-api-23kc (url use)

## S3 upload to lambda trigger
https://www.youtube.com/watch?v=vQSs-kBcipk


# Pre-requisites dependencies
npm i aws-sdk
npm i aws-s3
npm i request


# Deploy 
serverless deploy


# S3 Bucket File Upload manually
select S3 Bucket 
upload file manually
go to github repository and show uploaded file 




## Step -1
# Create Blobs
POST : https://api.github.com/repos/Urvesh05/github-aws-cicd/git/blobs

https://api.github.com/repos/{owner-Git-UserName}/{repo-Name}/git/blobs (url hint to create blobl and body output sha key)


## Step -2 
# Create Tree
POST : https://docs.github.com/en/rest/git/trees#create-a-tree

https://api.github.com/repos/Urvesh05/github-aws-cicd/git/trees


## Step -3 
# Get Reference 
GET : https://docs.github.com/en/rest/git/refs#get-a-reference

https://api.github.com/repos/Urvesh05/github-aws-cicd/git/refs/heads/S3Store


# Step -4
# Create Commit
POST: https://docs.github.com/en/rest/git/commits#create-a-commit

https://api.github.com/repos/Urvesh05/github-aws-cicd/git/commits


# Step-5 
#  Create Push 
POST :

https://api.github.com/repos/Urvesh05/github-aws-cicd/git/refs/heads/S3Store

