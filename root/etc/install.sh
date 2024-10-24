#!/usr/bin/env bash

if [[ "$(id -u)" != "0" ]]; then
    echo "This script must be run as root." 1>&2
    exit 1
fi

export DEBIAN_FRONTEND=noninteractive

function install_packages() {
  apt update -y
  apt install -y --no-install-recommends --no-install-suggests \
    curl \
    gnupg \
    bzip2 \
    ca-certificates \
    mysql-server \
    mysql-client \
    nginx-common \
    nginx-light
}

function install_nodejs() {
  mkdir -p /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --yes
  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
  apt update -y
  apt install -y --no-install-recommends --no-install-suggests \
    nodejs
}

function install_certbot() {
  snap install core
  snap refresh core
  snap install --classic certbot
  ln -f -s /snap/bin/certbot /usr/bin/certbot
}

install_packages
install_nodejs
install_certbot
