#!/usr/bin/env bash

for file in words-*.csv.gz; do
  if [ -f "$file" ]; then
    gunzip "$file"
  fi
done
