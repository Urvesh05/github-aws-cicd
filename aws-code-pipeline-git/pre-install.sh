#!/bin/bash

#install PHP and modules
amazon-linux-extras install php8.1

yum install -y httpd mariadb-server php php-xml php-mbstring php-intl

curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
yum install -y nodejs

npm install -g yarn

# php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
# sudo php composer-setup.php -- --install-dir=/home/ec2-user --filename=composer
# sudo rm composer-setup.php

curl -s https://getcomposer.org/installer | php
mv composer.phar /usr/bin/composer

sed -i -r "s/post_max_size = 8M/post_max_size= 100M/g" /etc/php.ini
sed -i -r "s/upload_max_filesize = 2M/upload_max_filesize= 100M/g" /etc/php.ini