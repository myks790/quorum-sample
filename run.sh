#!/usr/bin/env bash

args=("$@")
PARA=${args[0]}
if [[ ${PARA} = "up" ]]; then
    docker-compose -f ./istanbul/docker-compose.yml up -d
    docker-compose -f ./monitoring/docker-compose.yml up -d
elif [[ ${PARA} = "up-raft" ]]; then
    QUORUM_CONSENSUS=raft docker-compose -f ./istanbul/docker-compose.yml up -d
    docker-compose -f ./monitoring/docker-compose.yml up -d
elif [[ ${PARA} = "down" ]]; then
    docker-compose -f ./istanbul/docker-compose.yml down -v
    docker-compose -f ./monitoring/docker-compose.yml down -v
elif [[ ${PARA} = "viewer" ]]; then
    npm start --prefix ./sample/viewer-react/
fi