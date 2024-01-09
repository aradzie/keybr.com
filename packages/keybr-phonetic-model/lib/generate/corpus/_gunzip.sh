#!/usr/bin/env bash

for file in corpus-*.txt.gz; do
  if [ -f "$file" ]; then
    gunzip "$file"
  fi
done
