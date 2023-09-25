#!/usr/bin/env bash

set -e

source "${BASH_SOURCE%/*}/vars.sh"

project_dir="$(realpath "${BASH_SOURCE%/*}/../..")"

if [[ "$(id -u)" != "0" ]]; then
  echo "This script must be run as root." 1>&2
  exit 1
fi

systemd-nspawn --machine "${MACHINE}" --boot --bind /home
