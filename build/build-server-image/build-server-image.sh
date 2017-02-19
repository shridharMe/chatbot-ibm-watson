#!/bin/bash
# Publishes built baseiamge of AWS AMI.
 

sudo yum install -y createrepo
sudo yum install -y rpm-build
sudo yum install -y rpm-sign

sudo  curl  "https://s3-eu-west-1.amazonaws.com/doai-yum-repo/rpm-yum-repo-pub.key" -o "rpm-yum-repo-pub.key"
sudo  curl  "https://s3-eu-west-1.amazonaws.com/doai-yum-repo/rpm-yum-repo-secret.key" -o "rpm-yum-repo-secret.key"

ls -lrt

sudo rpm --import rpm-yum-repo-pub.key


echo "***********List of rpm key is **************************"
echo " ----------------------------------------------------------"

sudo rpm -q gpg-pubkey --qf '%{name}-%{version}-%{release} --> %{summary}\n'

echo " -----------------------------------------------------------"
echo " ***********************************************************"

sudo gpg --import rpm-yum-repo-pub.key

sudo gpg --import rpm-yum-repo-secret.key

sudo gpg --allow-secret-key-import rpm-yum-repo-secret.key


echo "***********List of public key is **************************"
echo " ----------------------------------------------------------"

sudo gpg --list-keys

echo " -----------------------------------------------------------"
echo " ***********************************************************"


echo " **********List of secret key is **************************"
echo " ----------------------------------------------------------"

sudo gpg --list-secret-keys

echo " ------------------------------- --------------------------"
echo " ***********************************************************"
#sudo mkdir -p ~/rpmbuild/{RPMS,SRPMS,BUILD,SOURCES,SPECS,tmp}

#ls -lrt ~/rpmbuild/


sudo unzip /tmp/yum-repo-image.zip -d /tmp/
ls -lrt /tmp/


#sudo cp /tmp/doai.zip ~/rmpbuild/SOURCES/
 

sudo chmod 700 /tmp/yum-repo/promote-rpm.sh

sudo chmod 700 /tmp/yum-repo/publish-rpm.sh

#sudo cat <<EOF >~/.rpmmacros
#%_signature gpg
#%_gpg_name  Shridhar Patil
#EOF