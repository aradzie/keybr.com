#!/usr/bin/env bash

set -e

source "${BASH_SOURCE%/*}/vars.sh"

project_dir="$(realpath "${BASH_SOURCE%/*}/../..")"

if [[ "$(id -u)" != "0" ]]; then
  echo "This script must be run as root." 1>&2
  exit 1
fi

function install() {
  #
  # Create the container directory.
  #

  debootstrap ${DISTRO} ${ROOT} ${MIRROR}
}

function configure() {
  #
  # Update the sources list in the container.
  #

  cat <<EOT >${ROOT}/etc/apt/sources.list
deb ${MIRROR} ${DISTRO} main restricted
deb ${MIRROR} ${DISTRO}-updates main restricted
deb ${MIRROR} ${DISTRO} universe
deb ${MIRROR} ${DISTRO}-updates universe
deb ${MIRROR} ${DISTRO} multiverse
deb ${MIRROR} ${DISTRO}-updates multiverse
deb http://security.ubuntu.com/ubuntu ${DISTRO}-security main restricted
deb http://security.ubuntu.com/ubuntu ${DISTRO}-security universe
deb http://security.ubuntu.com/ubuntu ${DISTRO}-security multiverse
EOT

  #
  # Configure apt to ignore the installation of suggested and recommended packages.
  #

  cat <<EOT >${ROOT}/etc/apt/apt.conf.d/01lean
APT::Install-Suggests "false";
APT::Install-Recommends "false";
APT::AutoRemove::SuggestsImportant "false";
APT::AutoRemove::RecommendsImportant "false";
EOT

  #
  # Configure networking in the container.
  #

  echo ${HOSTNAME} >${ROOT}/etc/hostname

  cat <<EOT >${ROOT}/etc/hosts
127.0.0.1       localhost ${HOSTNAME}
::1             localhost ${HOSTNAME} ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
EOT

  #
  # Make sure the container knows it runs in a chroot environment.
  #

  echo ${HOSTNAME} >${ROOT}/etc/debian_chroot

  #
  # Get rid of annoying warnings.
  #

  systemd-nspawn --machine ${MACHINE} locale-gen en_US.UTF-8

  #
  # Make users password-less in the container.
  #

  systemd-nspawn --machine ${MACHINE} passwd -d root
}

if [[ -d ${ROOT} ]]; then
  echo "Container '${MACHINE}' already exists in '${ROOT}'." 1>&2
  echo ""
else
  install
  configure
fi

echo "Container info:"
echo ""
machinectl show-image ${MACHINE}
echo ""
echo "To start the container:"
echo ""
echo "  sudo systemd-nspawn --machine '${MACHINE}' --boot"
echo ""
echo "To archive the container:"
echo ""
echo "  sudo machinectl export-tar '${MACHINE}' '/tmp/${MACHINE}.tar.gz'"
echo ""
echo "To restore the archived container:"
echo ""
echo "  sudo machinectl import-tar '/tmp/${MACHINE}.tar.gz' '${MACHINE}'"
echo ""
echo "To delete the container image:"
echo ""
echo "  sudo machinectl remove '${MACHINE}'"
echo ""
