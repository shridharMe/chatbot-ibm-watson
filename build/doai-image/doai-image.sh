#!/bin/bash
# Prerequiste for doAI image build.
sudo  wget  "https://s3-eu-west-1.amazonaws.com/doai-yum-repo/rpm-yum-repo-pub.key" -o "rpm-yum-repo-pub.key"
ls -lrt
sudo rpm --import rpm-yum-repo-pub.key	
sudo  wget "https://s3-eu-west-1.amazonaws.com/doai-yum-repo/development/development.repo" -O "/etc/yum.repos.d/development.repo"
sudo yum install -y chatbot_ibm_watson
cd /opt/doai
sudo npm update
#sudo node bin/bot

ls -lrt

sudo cp /opt/doai/install-scripts/doai.service /usr/lib/systemd/system

#systemctl enable doai