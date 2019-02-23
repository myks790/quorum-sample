#!/usr/bin/env bash
docker build --tag myks790/key-generator .

COUNT=3 #default : 3
args=("$@")
PARA=${args[0]}
echo ${PARA}
if [[ ${PARA:0:5} -eq "COUNT" ]]; then
    COUNT=${PARA:6}
fi


COMMAND="geth --datadir /keys account new --password /keys/pw"
SUB=${COMMAND}
COMMAND2="bootnode --genkey=nodeKey1"
SUB2="bootnode --genkey=nodeKey"
if [[ ${COUNT} -ne "1" ]]; then
    for i in `seq 2 ${COUNT}`
    do
       COMMAND="${COMMAND} && ${SUB}"
       COMMAND2="${COMMAND2} && ${SUB2}${i}"
    done
fi
DIR=`pwd`

docker run --rm -v ${DIR}/keys:/keys myks790/key-generator "${COMMAND} && ${COMMAND2}"
