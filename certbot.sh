#!/bin/bash

echo "Install dependencies"
sudo apt install -y aws-cli certbot openssl

echo "Creates the CloudFlare Credentials"

# This command calls certbot for Let's Encrpypt. This example uses CloudFlare DNS for validation. Let's Encrypt supports many different DNS providers
# https://certbot.eff.org/docs/using.html?highlight=dns#dns-plugins
# Configure cerbot to use your DNS provider. Web-based providers are not possible using this method.
# Also, you may want to use the --staging flag while working in development.

echo "Renews the certificates"
sudo certbot certonly --dns-route53 -d $DOMAIN -d www.$DOMAIN

# Certbot runs as root, so it creates all the files as root. This changes the permissions so that other utilities can read the file.
echo "Set file permissions"
sudo chmod -R 777 ./*

echo "Creates a PFX for Azure"
openssl pkcs12 -inkey ./live/$DOMAIN/privkey.pem -in live/$DOMAIN/fullchain.pem -export -out $DOMAIN.pfx -passout pass:pwd123

echo "Login to AWS and renew in CM"
# todo: Implement logic

ls -l

echo "Cleans Up Files"
rm ./cftoken
rm $DOMAIN.pfx

exit 0
