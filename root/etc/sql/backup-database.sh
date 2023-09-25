#!/usr/bin/env bash

# To restore the database:
# $ cat dumpfilename.sql | mysql -u root keybr
# or
# $ bzcat dumpfilename.sql.bz2 | mysql -u root keybr

mysqldump -u root keybr | bzip2 -c > /var/lib/keybr/backups/database.sql.bz2
