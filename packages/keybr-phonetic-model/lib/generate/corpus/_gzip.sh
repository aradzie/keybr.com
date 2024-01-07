#!/usr/bin/env bash

for file in {*-corpus.txt,*-words.csv}; do
  if [ -f "$file" ]; then
    gzip -9 "$file"
  fi
done
