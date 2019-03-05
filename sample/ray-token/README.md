## 필요 모듈 설치
npm install -g truffle

### 사용법
quorum 3node 실행 후
`truffle compile`<br/>
`truffle migrate --network quorum` 실행<br/>
처음부터 재배포 하고 싶으면 : `truffle migrate --network quorum --reset` 실행<br/>
실행하면 배포 후 빌드 된 contract 파일과 주소 json 파일이 viewer-react폴더에 src로 복사됨

### TRUFFLE
https://truffleframework.com/docs/truffle/overview