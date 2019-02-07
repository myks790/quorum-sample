echo "Token 생성 및 geth 접속"

docker exec -it istanbul_node1_1 geth attach /qdata/dd/geth.ipc --preload "/testScripts/erc20/wallet.js"
