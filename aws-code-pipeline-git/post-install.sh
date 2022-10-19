#!/bin/bash

cd /var/www/html/csc-portal
cp deploy/csc_httpd.conf /etc/httpd/conf.d/csc-portal.conf
systemctl stop httpd.service
systemctl start httpd.service

sudo chmod -R 775 /var/www/html/csc-portal
sudo chown -R apache:apache /var/www/html/csc-portal
sudo echo "Server Up" > /var/www/html/csc-portal/public/test.html
sudo echo "Server Up" > /var/www/html/csc-portal/test.html

# # Change permissions for cache and storage logs
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache
