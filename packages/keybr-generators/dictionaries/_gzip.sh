#!/usr/bin/env bash

for file in dictionary-*.csv; do
  if [ -f "$file" ]; then
    gzip --force -9 "$file"
  fi
done
