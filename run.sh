#!/usr/bin/env bash

args=("$@")
PARA=${args[0]}
if [[ ${PARA} = "up" ]]; then
    docker-compose -f ./quorum/docker-compose.yml up -d
    docker-compose -f ./monitoring/docker-compose.yml up -d
elif [[ ${PARA} = "up-raft" ]]; then
    QUORUM_CONSENSUS=raft docker-compose -f ./quorum/docker-compose.yml up -d
    docker-compose -f ./monitoring/docker-compose.yml up -d
elif [[ ${PARA} = "down" ]]; then
    docker-compose -f ./quorum/docker-compose.yml down -v
    docker-compose -f ./monitoring/docker-compose.yml down -v
elif [[ ${PARA} = "viewer" ]]; then
    npm start --prefix ./sample/viewer-react/
elif [[ ${PARA} = "npm-install" ]]; then
    npm install --prefix ./sample/ray-token/
    npm install --prefix ./sample/viewer-react/
elif [[ ${PARA} = "migrate" ]]; then
    cd ./sample/ray-token/
    ./node_modules/.bin/truffle migrate --network quorum --reset
    cd ./../../
elif [[ ${PARA} = "first-start" ]]; then
    echo "========================================================"
    echo "==== quorum test network 실행(consensus : istanbul) ===="
    ./run.sh up
    echo "======================================================"
    echo "==== viewer와 예제 Contract 관련 npm install 실행 ===="
    ./run.sh npm-install
    echo "==============================================================="
    echo "==== quorum test network가 완전히 실행 될 때까지 30초 대기 ===="
    sleep 30s
    echo "======================="
    echo "==== contract 배포 ===="
    ./run.sh migrate
    echo "====================="
    echo "==== viewer 실행 ===="
    ./run.sh viewer
fi