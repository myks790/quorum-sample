#!/usr/bin/env bash

args=("$@")
PARA=${args[0]}
if [[ ${PARA:0:2} = "up" ]]; then
    docker-compose -f ./istanbul/docker-compose.yml up -d
    docker-compose -f ./monitoring/docker-compose.yml up -d

elif [[ ${PARA} = "down" ]]; then
    docker-compose -f ./istanbul/docker-compose.yml down -v
    docker-compose -f ./monitoring/docker-compose.yml down -v
fi