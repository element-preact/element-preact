#!/usr/bin/env bash

if [ ! -d "output" ];then
    git clone https://github.com/element-preact/element-preact.github.io ./output
else
    cd output
    git pull origin master
fi
