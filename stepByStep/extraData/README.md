## Istanbul-tool 참조
A : https://github.com/jpmorganchase/istanbul-tools/ <br/>
B : https://github.com/getamis/Istanbul-tools

현재는 jpmorganchase에서 A를 사용하하고 함 <br/>
그러나 빌드를 못해서 B를 사용함

### B 빌드 방법
GOPATH가 ~/go 일 경우 <br/>
`mkdir -p go/src/github.com/getamis`<br/>
`git clone https://github.com/getamis/Istanbul-tools`<br/>
`go get github.com/getamis/Istanbul-tools/cmd/istanbul`<br/>
`cd ~/go/bin`

### encode
`~/go/bin/istanbul extra encode --config ./example-config.toml`

### validators 값?
geth 실행시 nodekey에 따라 coinbase가 변하는데 coinbase주소가 valiator이다.<br/>