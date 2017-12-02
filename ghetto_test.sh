#!/bin/bash -x

FIRST_DIR='what'
REMOTE_DIR='tmp'

rm -rf "$REMOTE_DIR/$FIRST_DIR"

if [ -d "$FIRST_DIR" ]; then
  rm -rf "$FIRST_DIR"
fi

DEEP_DIR="$FIRST_DIR/what/what/what"
mkdir -p $DEEP_DIR

touch "$DEEP_DIR/me.txt"

rm -rf  "$FIRST_DIR"