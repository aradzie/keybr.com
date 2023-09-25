#!/usr/bin/env bash

mysql -v -u root -D keybr < "$(dirname $0)/create-schema.sql"
