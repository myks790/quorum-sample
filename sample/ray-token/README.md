## 필요 모듈 설치
npm install -g truffle@v4.1.15 <br/>
truffle v5에서 quorum 합의 알고리즘을 raft로 하고 배포 할때 문제 있음(v5.0.4, v5.0.8만 확인)<br/>
v5에서 quorum과 호환성이 깨짐<br/>
issues : https://github.com/trufflesuite/truffle/issues/1657<br/>
[v5.0.9](https://github.com/trufflesuite/truffle/releases/tag/v5.0.9)에서 일부 수정됨(privateFor은 안됨)<br/>
https://truffleframework.com/docs/truffle/getting-started/working-with-quorum



### 사용법
quorum 3node 실행 후
`truffle compile`<br/>
`truffle migrate --network quorum` 실행<br/>
처음부터 재배포 하고 싶으면 : `truffle migrate --network quorum --reset` 실행<br/>
실행하면 배포 후 빌드 된 contract 파일과 주소 json 파일이 viewer-react폴더에 src로 복사됨

### TRUFFLE
https://truffleframework.com/docs/truffle/overview