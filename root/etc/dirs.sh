#!/usr/bin/env bash

if [[ "$(id -u)" != "0" ]]; then
    echo "This script must be run as root." 1>&2
    exit 1
fi

mkdir -p /etc/keybr

chown -R root:root /etc/keybr

mkdir -p /var/lib/keybr
mkdir -p /var/lib/keybr/backups
mkdir -p /var/lib/keybr/sessions
mkdir -p /var/lib/keybr/user_settings
mkdir -p /var/lib/keybr/user_stats

chown -R www-data:www-data /var/lib/keybr
chmod -R u=rwX,g=rX,o=rX /var/lib/keybr
