#!/bin/bash
# Publishes built baseiamge of AWS AMI.

sudo yum install -y wget
sudo yum install -y curl
sudo yum install -y telnet
sudo yum install -y unzip
sudo yum install -y epel-release
sudo yum install -y nodejs
sudo yum install -y java-1.8.0-openjdk
sudo yum install -y git
sudo yum install -y python27
curl 'https://s3.amazonaws.com/aws-cli/awscli-bundle.zip' -o 'awscli-bundle.zip'
unzip awscli-bundle.zip
sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws
sudo ln -s /usr/local/bin/aws /usr/bin/aws