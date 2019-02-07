#!/usr/bin/env bash
echo "1 -> 7로 private contract 생성 된 후"
echo "7번 노드의 tm 데이터가 삭제 됬을 때 => 복구 안됨"
echo " "

echo "private contract 생성"
transactionAddress=`docker exec -it istanbul_node1_1 geth attach /qdata/dd/geth.ipc --exec "loadScript('/testScripts/tmTrouble/privateContractTo7.js')"`
transactionAddress=${transactionAddress:0:66}
echo "transactionAddress : $transactionAddress"

echo "sleep 5"
sleep 5

getNodeData() {
    docker exec -it istanbul_node$1_1 geth attach /qdata/dd/geth.ipc \
        --exec "loadScript('/testScripts/tmTrouble/checkPrivate.js');
                var contract = new Contract('$2');
                contract.get();"
}

echo "node1 data"
getNodeData 1 $transactionAddress
echo "node7 data"
getNodeData 7 $transactionAddress
echo "node2 data"
getNodeData 2 $transactionAddress


echo "7번 tm data 삭제"
#docker stop istanbul_node7_1
docker exec -it istanbul_txmanager7_1 /bin/sh \
    -c "cd qdata/tm
        rm ./*.db"

echo "7번 tm과 노드 restart"
docker restart istanbul_txmanager7_1 > /dev/null
docker restart istanbul_node7_1 > /dev/null

echo "sleep 30"
sleep 30

echo "삭제후 data -----------------------------"
echo "node1 data"
getNodeData 1 $transactionAddress
echo "node7 data"
getNodeData 7 $transactionAddress
echo "node2 data"
getNodeData 2 $transactionAddress