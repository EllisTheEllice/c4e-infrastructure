This repository contains a set of Cloudformation Stacks to create the infrastructure for a website hosted by static website hosting on AWS S3. Although it is static website hosting, it also supports dynamic context to a certain extend by using API Gateway in combination with Lambda. See [this blog post](https://www.cloud4engineers.com/posts/2020/10/website-setup-part-1-configure-s3-for-static-website-hosting/) for more details.
To create the infrastructure, follow along with this readme.

- Prerequisites
  - [Install AWS cli](#install-aws-cli)
  - [SSL certificate](#create-or-import-ssl-certificate)
  - [IAM role](#Create-IAM-user-and-role)
  - [S3 bucket](#create-s3-bucket)
  - [AWS credentials](#configure-aws-cli)
  - [Recaptcha secret](#generate-recaptcha-secret)
- [Infrastructure creation](#infrastructure-creation)
  - [Use CloudFormation from a Windows environment](#use-cloudformation-from-a-windows-environment)
  - [Use CloudFormation from a Linux environment](#use-cloudformation-from-a-linux-environment)
- [Last steps](#last-steps)


# Prerequisites

## Install AWS cli

The machine executing the CloudFormation script requires the AWS cli to be installed. Follow [these steps](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) to install the cli.

## Create or import SSL certificate

This cfn stack assumes that you want to provide your website content in an encrypted manner. To do so, you require two things:
1. A registered domain
2. An SSL certificate

If you do already have a SSL certificate, follow [these steps](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html) to import the certificate to the certificate manager. Make sure you import the certificate in the US East (N. Virginia) region in order to use this within CloudFront.

If you do not have a certificate, but want to create one using AWS Certificate manager, follow [these steps](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html).

## Create IAM user and role

The deployment scripts use an IAM user with a policy assigned to create the infrastructure. So follow [these steps](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user.html) to create a new IAM user with a policy. Make sure you add the following permissions to the policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "states:*",
                "cloudfront:*",
                "cloudwatch:*",
                "ses:*",
                "apigateway:*",
                "s3:*",
                "lambda:*",
                "route53:*",
                "dynamodb:*"
            ],
            "Resource": "*"
        }
    ]
}
```

## Create S3 bucket

CloudFormation requires a S3 bucket for uploading the generated files. This has to be created manually by following [these steps](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html). Note down the S3 bucket name, as this will be required during setup.

## Configure AWS cli

Now the AWS cli installed previously has to be configured. To do so, type in your bash/cmd ```aws condfigure ``` and provide the API key and secret key of the IAM user created earlier. Make sure you do not configure the default profile, but [create a new one](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html).

## Generate recatpcha secret

As this stack uses recaptcha to validate incoming data from the comment functionality as well as from the contact form, it is required to create a recaptcha key as described [here](https://cloud.google.com/recaptcha-enterprise/docs/create-key).

# Infrastructure creation

Now you are good to go and the actual rollout can happen. To do so, you have to fill in the configuration file first.

## Fill configuration file

Rename the [parameters.template.json](parameters.template.json) file to parameters.json and fill in the information you gathered from the previous steps.

## Use CloudFormation from a Windows environment

To execute the CloudFormation stack, I have created a [powershell file](deploy.ps1). Before executing the file, it must also be adapted. Right at the top you´ll find 4 parameters which you have to adapt to meet your setup.

## Use CloudFormation from a Linux environment

To execute the CloudFormation stack, I have created a [bash script](deploy.sh). Before executing the file, it must also be adapted. Right at the top you´ll find 4 parameters which you have to adapt to meet your setup.

# Last steps

After the infrastructure has been set up, you should have received an email to the email adress provided in the parameters.json file. To make email delivery work, you have to confirm the subscription by clicking the link in the mail.
