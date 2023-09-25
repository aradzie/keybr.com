#!/usr/bin/env bash

mysql -v -u root < "$(dirname $0)/create-database.sql"
