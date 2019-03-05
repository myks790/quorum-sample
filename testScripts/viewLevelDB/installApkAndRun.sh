# docker exec -it istanbul_node3_1 /bin/sh
# 로 접속 후 실행
# main.js 파일에 블록 번호 변경 필요
apk add --update py-pip
apk add --update npm
apk add --update make
apk add --update g++
apk add --update git

cd /testScripts/viewer
cp -r /qdata/dd/geth ./

npm install

node main.js