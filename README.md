#quorum-sample
consensus : istanbul <br/>
참고 : https://github.com/jpmorganchase/quorum-examples 
<br/><br/>
## 폴더 소개

### istanbul
`docker-compose up`으로 실행<br/>
테스트 노드 실행 관련 파일이 존재<br/>
#### 3nodes 폴더
genesis 파일과 각 노드에서 쓰이는 계정 키값 존재<br/>
허가한 노드 정보 파일 존재
#### nodeKeys
특정한 노드 생성에 쓰이는 nodeKey 존재<br/>
gath에 쓰임 <br/>

### sample
#### ray-token
truffle, openzeppelin 사용<br/>
erc20, 721 생성, 배포<br/>
#### viewer-react
ray-token에서 생성한 토큰 정보 확인, 교환 기능 제공<br/>


### stepByStep
테스트 노드 없이 처음부터 생성하는 방법 관련 
#### keyGenerator
nodeKey와 geth 계정 생성 관련<br/> 
#### extraData
genesis 파일 생성에 쓰이는 extraData 관련<br/>

### testScripts
#### erc20
erc20 토큰 생성
#### tmTrouble
transacion manager에서 장애가 났을 경우 복구 확인
#### viewTMdb
transaction manager인 tessera의 db내용 확인
#### viewLevelDB
quorum chain 내용 확인 관련
