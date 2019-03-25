#!/usr/bin/env bash

cd ../
if [ ! -d "db" ];then
    mkdir db
fi

if [ ! -d "db/element-react" ];then
    git clone https://github.com/ElemeFE/element-react db/element-react
else
    cd db/element-react
    git pull
    cd ../..
fi

