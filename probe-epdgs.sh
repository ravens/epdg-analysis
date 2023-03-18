#!/bin/bash

if [[ $# -ne 1 ]]; then
    echo "Illegal number of parameters, add the active list of ePDG to scan as a json file" >&2
    exit 2
fi

if ! command -v ike-scan >  /dev/null; then
  echo please install ike-scan first.
  exit 2
fi

if ! command -v jq >  /dev/null; then
  echo please install jq first.
  exit 2
fi

FILE=$1

if ! [ -f $FILE ]; then
   echo "The file '$FILE' in not found."
fi

TARGETS=$(cat $FILE | jq -r '.[].fqdn' | sort -u -s)

for epdg in $TARGETS
do 
  scan_result=$(ike-scan $epdg -q --ikev2 --retry=1 | grep -v "Starting ike-scan" | grep -v "0 returned handshake; 0 returned notify" 2>/dev/null)
  if ! [[ -z "$scan_result" ]]
  then
    echo "$epdg"
fi
done