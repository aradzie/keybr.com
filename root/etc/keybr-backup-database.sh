#!/usr/bin/env bash

DIR=/var/lib/keybr/backups
FILE=database-$(date +"%F-%T").sql.bz2

mkdir -p $DIR

mysqldump -u root keybr | bzip2 -c > $DIR/$FILE

ls -tr $DIR/database-*.sql.bz2 | head -n -5 | xargs -I '{}' rm -- '{}'
