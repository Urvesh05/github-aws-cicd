# github-aws-cicd
only for Test aws cicd codePipeLine




## PHP Laravel project ##

## Pre Required Installation

## using servelless
npm install -g serverless

## configure aws iam
serverless config credentials --provider aws --key <key> --secret <secret>

## install PHP
sudo apt-get install php8.0

## install composer
curl -sS https://getcomposer.org/installer | php 
sudo mv composer.phar /usr/local/bin/composer 
chmod +x /usr/local/bin/composer
<!-- composer -v -->


## install laravel
composer global require "laravel/installer"
 

## creare bref 
composer require bref/bref


## create serverless.yml 
php artisan vendor:publish --tag=serverless-config


## deploy 
php artisan config:clear
serverless deploy


## deploy cloudFoamation
aws cloudformation package --template-file Lambda.yml(projecrname) --s3-bucket demo-lambda-code-deploy(S3 BucketName)  --output-template-file packaged.yml

aws cloudformation deploy --template-file packaged.yml --stack-name HelloWorld --capabilities CAPABILITY_NAMED_IAM




## codePileLine Deploy 
aws cloudformation package --template-file Lambda.yml(projecrname) --capabilities CAPABILITY_NAMED_IAM --parameter-override GitHubRepository==github-aws-cicd