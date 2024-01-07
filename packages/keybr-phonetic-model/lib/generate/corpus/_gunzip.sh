#!/usr/bin/env bash

for file in {*-corpus.txt.gz,*-words.csv.gz}; do
  if [ -f "$file" ]; then
    gunzip "$file"
  fi
done
