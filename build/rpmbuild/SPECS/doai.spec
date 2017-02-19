Name:           chatbot_ibm_watson
Version:        1.0
Release:        1%{?dist}
Summary:        RMP package for chatbot-ibm-watson

Group:          DevOps/Tools
License:        GPL
URL:            None
Source0:        doai.zip
BuildRoot:      /tmp/%{name}-%{version}   

%description
RMP package for chatbot-ibm-watson

%prep
%setup -n doai

echo "$RPM_BUILD_ROOT"

%install
rm -rf "$RPM_BUILD_ROOT"
mkdir -p "$RPM_BUILD_ROOT/opt/doai"
cp -R * "$RPM_BUILD_ROOT/opt/doai"

%files
/opt/doai


%clean
rm -rf "$RPM_BUILD_ROOT"