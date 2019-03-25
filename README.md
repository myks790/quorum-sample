# quorum-sample
## Quick start
프로젝트 루트에서<br/>
`./run.sh first-start` 명령어 실행<br/>
위 명령어는 아래 명령어를 순차 실행<br/>
* `./run.sh up` :  quorum과 monitoring 폴더의 docker-compose 실행 
* `./run.sh npm-install` : sample 하위 폴더(viewer, ray-token)에 npm install을 실행
* `./run.sh migrate` : truffle을 이용해 배포
* `./run.sh viewer` : create-react-app을 이용해 만든 viewer 실행

### 실행 환경
node version : v10.7.0<br/>
npm version :  v6.8.0<br/>
docker version : 18.09.2<br/>
docker-compose version : 1.23.2

## 폴더 소개
### quorum 폴더
`docker-compose up`으로 실행<br/>
테스트 노드 실행 관련 파일이 존재<br/>
* #### 3nodes
genesis 파일과 각 노드에서 쓰이는 계정 키값 존재<br/>
허가한 노드 정보 파일 존재
* #### nodeKeys
특정한 노드 생성에 쓰이는 nodeKey 존재<br/>
gath에 쓰임 <br/>

---
### sample 폴더
* #### [ray-token](./sample/ray-token)
truffle, openzeppelin 사용<br/>
erc20, 721, 725v1 생성, 배포<br/>
* #### [viewer-react](./sample/viewer-react)
ray-token에서 생성한 토큰 정보 확인, 교환 기능 등 제공<br/>
3000번 포트

---
### stepByStep 폴더
테스트 노드 없이 처음부터 생성하는 방법 관련 
* #### [keyGenerator](./stepByStep/keyGenerator)
nodeKey와 geth 계정 생성 관련<br/> 
* #### [extraData](./stepByStep/extraData)
genesis 파일 생성에 쓰이는 extraData 관련<br/>

---
### testScripts 폴더
* #### erc20
erc20 토큰 생성
* #### tmTrouble
transacion manager에서 장애가 났을 경우 복구 확인
* #### viewTMdb
transaction manager인 tessera의 db내용 확인
* #### viewLevelDB
quorum chain 내용 확인 관련

---
### monitoring 폴더
실행 중인 docker cpu, ram, network 사용량 확인<br/>
grafana, prometheus, cadvisor 사용 <br/>
grafana : 9090번 포트<br/>
prometheus : 9091번 포트<br/>
cadvisor : 9092번 포트

---
## 참고
quorum 폴더 : [quorum-examples](https://github.com/jpmorganchase/quorum-examples) <br/>
ray-token 폴더 :
* [openzeppelin](https://docs.openzeppelin.org/docs/get-started.html) 
* [truffle](https://truffleframework.com/docs/truffle/overview)