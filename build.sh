#!/usr/bin/env bash

set -e

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# Create empty build directory to prevent npm EEXIST error with build.sh
mkdir -p "${project_dir}/build"

# Use SQLite for tests to avoid MySQL dependency
export DATABASE_CLIENT=sqlite

rm -fr "${project_dir}/node_modules"
npm --prefix "${project_dir}" install
npm --prefix "${project_dir}" run clean
npm --prefix "${project_dir}" run compile
npm --prefix "${project_dir}" run lint
npm --prefix "${project_dir}" run stylelint
npm --prefix "${project_dir}" run build
npm --prefix "${project_dir}" run test
