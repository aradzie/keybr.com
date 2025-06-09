#!/usr/bin/env bash

set -e

project_dir="$(realpath "${BASH_SOURCE%/*}")"

rm -fr "${project_dir}/node_modules"
npm --prefix "${project_dir}" install
npm --prefix "${project_dir}" run clean
npm --prefix "${project_dir}" run compile
npm --prefix "${project_dir}" run lint
npm --prefix "${project_dir}" run stylelint
npm --prefix "${project_dir}" run build
npm --prefix "${project_dir}" run test
