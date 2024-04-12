#!/usr/bin/env bash

for file in dictionary-*.csv; do
  if [ -f "$file" ]; then
    gzip -9 "$file"
  fi
done
