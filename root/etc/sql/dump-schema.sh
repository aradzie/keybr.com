#!/usr/bin/env bash

mysqldump -u keybr \
    --verbose \
    --no-data \
    keybr | sed 's/ AUTO_INCREMENT=[0-9]*//g' > "$(dirname $0)/create-schema.sql"
