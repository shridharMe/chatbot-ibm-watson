#!/bin/bash
# Promotes an RPM from one repo to another (e.g. dev -> prod)
set -e
if [ ! -z "${DEBUG}" ]; then
  set -x
fi

SCRIPT_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
SRC_BASE="${SCRIPT_DIR}/../.."

DEPENDENCIES=("aws" "createrepo")
REGION="eu-west-1"

while getopts "s:t:r:" opt; do
  case $opt in
    r) RPM_MATCH=$OPTARG ;;
    s) SOURCE_BUCKET=$OPTARG ;;
    t) TARGET_BUCKET=$OPTARG ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

for dep in "${DEPENDENCIES[@]}"
do
  if [ ! $(which ${dep}) ]; then
      echo "${dep} must be available."
      exit 1
  fi
done

if [ -z "${RPM_MATCH}" ]; then
  echo "RPM match string must be specified."
  exit 1
fi

if [ -z "${SOURCE_BUCKET}" ]; then
  echo "Source bucket must be specified."
  exit 1
fi

if [ -z "${TARGET_BUCKET}" ]; then
  echo "Target bucket must be specified."
  exit 1
fi

SOURCE_DIR="/tmp/${SOURCE_BUCKET}"
TARGET_DIR="/tmp/${TARGET_BUCKET}"

# make sure we're operating on the latest data in the source bucket
mkdir -p $SOURCE_DIR
aws --region "${REGION}" s3 sync "s3://${SOURCE_BUCKET}" $SOURCE_DIR

# make sure we're operating on the latest data in the target bucket
mkdir -p $TARGET_DIR
aws --region "${REGION}" s3 sync "s3://${TARGET_BUCKET}" $TARGET_DIR

# copy the RPM in and update the repo
mkdir -pv $TARGET_DIR/x86_64/
cp -rv $SOURCE_DIR/x86_64/$RPM_MATCH.x86_64.rpm $TARGET_DIR/x86_64/
UPDATE=""
if [ -e "${TARGET_DIR}/noarch/repodata/repomd.xml" ]; then
  UPDATE="--update "
fi
for a in $TARGET_DIR/x86_64 ; do createrepo -v $UPDATE --deltas $a/ ; done

# sync the repo state back to s3
aws --region "${REGION}" s3 sync $TARGET_DIR s3://$TARGET_BUCKET