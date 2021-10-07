### Log in to the account via commandline login

$stackname =  "c4e-stack"
$configfile = "file://parameters.json"
$bucketname = "c4eartifactsbucket"
$aws_profile    = "c4e"

# Upload the required ses sources to S3
aws s3 sync ./prereqs/ s3://$bucketname/ --profile $aws_profile

# build the node_modules for the lambdas
cd .\progresscommentfunction\code
npm install

cd ..\..\recaptchaverifyfunction\code
npm install

cd ..\..\submitformfunction\code
npm install

cd ..\..

aws cloudformation package --template-file websitestack.yaml --s3-bucket $bucketname --output-template-file packaged_infrastructure.yaml --profile $aws_profile

# ` will require always a protruding space for the next parameter
aws cloudformation deploy --template-file packaged_infrastructure.yaml `
    --stack-name $stackname `
    --parameter-overrides $configfile `
    --capabilities CAPABILITY_NAMED_IAM `
    --profile $aws_profile `
