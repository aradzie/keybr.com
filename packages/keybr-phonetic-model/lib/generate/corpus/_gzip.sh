#!/usr/bin/env bash

for file in corpus-*.txt; do
  if [ -f "$file" ]; then
    gzip -9 "$file"
  fi
done
