#!/bin/bash
set -e
./prepare_deploy.sh

cd ../server
ZIP_FILE="C:\Users\murta\OneDrive\Desktop\cegep\Session 5\Transac 2\Finale Project\trackerapp-2024\backend\full.zip"
aws s3 cp "$ZIP_FILE" s3://trackerapp1/full.zip

VERSION_LABEL="v$(date +%Y%m%d%H%M%S)"

echo "New version label $VERSION_LABEL"

aws elasticbeanstalk create-application-version \
    --application-name TrackerApp \
    --version-label $VERSION_LABEL \
    --source-bundle S3Bucket=trackerapp1,S3Key=full.zip \
    --no-cli-pager

aws elasticbeanstalk update-environment \
    --environment-name TrackerApp-env \
    --version-label $VERSION_LABEL \
    --no-cli-pager

echo "Deploy completed successfully"