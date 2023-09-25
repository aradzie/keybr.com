#!/usr/bin/env bash

find /var/lib/keybr/sessions -type f -mtime +14 -exec rm {} \;
