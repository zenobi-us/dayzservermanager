#!/usr/bin/env bash

if [[ $# -eq 0 ]]; then
    /init
else
    cmd="$1"
    rest="${*:2}"
    /init mise run server:dz:"$cmd" "$rest"
fi

