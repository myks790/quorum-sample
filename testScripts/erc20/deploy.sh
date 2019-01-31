echo "Token 생성과 전송"

transactionAddress=`docker exec -it istanbul_node1_1 geth attach /qdata/dd/geth.ipc --exec "loadScript('/testScripts/erc20/deployToken.js')"`
transactionAddress=${transactionAddress:0:66}
echo "transactionAddress : $transactionAddress"

echo "sleep 30"
sleep 30

getTokenInfoAndTransfer() {
    echo "token info"
    docker exec -it istanbul_node$1_1 geth attach /qdata/dd/geth.ipc \
        --exec "loadScript('/testScripts/erc20/myTokenContract.js');
                var contract = new MyTokenContract('$2');
                console.log(
                    ' token name : ' + contract.name() +
                    '\n symbol : ' + contract.symbol() +
                    '\n totalSupply : ' + contract.totalSupply() +
                    '\n\n transfer 100R to node 7: ' + contract.transfer('0xcc71c7546429a13796cf1bf9228bff213e7ae9cc', 100))"
}

getTokenInfoAndTransfer 1 $transactionAddress