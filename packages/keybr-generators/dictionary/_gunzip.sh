#!/usr/bin/env bash

for file in dictionary-*.csv.gz; do
  if [ -f "$file" ]; then
    gunzip "$file"
  fi
done
