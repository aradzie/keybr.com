#!/usr/bin/env bash

#
# To configure TLS for the local dev server:
#
# 1. Install mkcert from https://github.com/FiloSottile/mkcert
#
# mkcert is a simple tool for making locally-trusted development certificates.
# It requires no configuration.
#
# mkcert automatically creates and installs a local CA in the system root store,
# and generates locally-trusted certificates. mkcert does not automatically
# configure servers to use the certificates, though.
#
# 2. Create a local CA.
#
# 3. Create a server certificate.
#
# 4. Copy the generated certificate to the server.
#

set -e

source "${BASH_SOURCE%/*}/vars.sh"

project_dir="$(realpath "${BASH_SOURCE%/*}/../..")"

if [[ "$(id -u)" == "0" ]]; then
  echo "This script must NOT be run as root." 1>&2
  exit 1
fi

KEY_FILE="${MACHINE}-key.pem"
CERT_FILE="${MACHINE}.pem"
FULL_CHAIN_FILE="${MACHINE}-fullchain.pem"

mkcert -install

mkcert -key-file $KEY_FILE -cert-file $CERT_FILE \
  "${MACHINE}" "*.${MACHINE}" localhost 127.0.0.1 ::1

cat $CERT_FILE > $FULL_CHAIN_FILE
cat "$(mkcert -CAROOT)/rootCA.pem" >> $FULL_CHAIN_FILE

PREFIX=$ROOT/etc/letsencrypt/live/keybr.com
sudo mkdir -p $PREFIX
sudo cp $KEY_FILE $PREFIX/privkey.pem
sudo cp $FULL_CHAIN_FILE $PREFIX/fullchain.pem
