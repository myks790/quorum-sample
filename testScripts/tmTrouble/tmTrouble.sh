#!/usr/bin/env bash
echo "1 -> 3로 private contract 생성 된 후"
echo "3번 노드의 tm 데이터가 삭제 됬을 때 => 복구됨"
echo " "

echo "private contract 생성"
transactionAddress=`docker exec -it quorum_node1_1 geth attach /qdata/dd/geth.ipc --exec "loadScript('/testScripts/tmTrouble/privateContractTo3.js')"`
transactionAddress=${transactionAddress:0:66}
echo "transactionAddress : $transactionAddress"

echo "sleep 5"
sleep 5

getNodeData() {
    docker exec -it quorum_node$1_1 geth attach /qdata/dd/geth.ipc \
        --exec "loadScript('/testScripts/tmTrouble/checkPrivate.js');
                var contract = new Contract('$2');
                contract.get();"
}

echo "node1 data"
getNodeData 1 $transactionAddress
echo "node2 data"
getNodeData 2 $transactionAddress
echo "node3 data"
getNodeData 3 $transactionAddress


echo "3번 tm data 삭제"
#docker stop quorum_node3_1
docker exec -it quorum_txmanager3_1 /bin/sh \
    -c "cd qdata/tm
        rm ./*.db"
echo "sleep 3"
sleep 3
echo "3번 tm과 노드 restart"
docker restart quorum_txmanager3_1 > /dev/null
echo "sleep 50"
sleep 50
docker restart quorum_node3_1 > /dev/null
echo "sleep 60"
sleep 60

echo "삭제후 data -----------------------------"
echo "node1 data"
getNodeData 1 $transactionAddress
echo "node2 data"
getNodeData 2 $transactionAddress
echo "node3 data"
getNodeData 3 $transactionAddress