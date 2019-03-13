import React, {Component} from 'react';
import Web3 from "web3";


const ContractsAddress = require('./../contracts/ContractsAddress.json');
const IERC165 = require('./../contracts/IERC165.json');
const Ray721Token = require('./../contracts/Ray721Token.json');

class StressTestComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.web3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account1.url));
        this.web3_2 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account2.url));
        this.web3_3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account3.url));
        this.ray721Token = new this.web3.eth.Contract(Ray721Token.abi, ContractsAddress.Ray721Token);
        this.ray721Token_2 = new this.web3_2.eth.Contract(Ray721Token.abi, ContractsAddress.Ray721Token);
        this.ray721Token_3 = new this.web3_3.eth.Contract(Ray721Token.abi, ContractsAddress.Ray721Token);

        this.ERC165 = this.web3.eth.Contract(IERC165.abi);

        this.timerId = -1;
        this.sendCount = 0;
        this.interval = 1000;
    }

    componentDidMount(){
        this.getInfo();
    }

    onClickStart = () => {
        if (this.timerId !== -1) {
            alert('이미 실행 중...')
        } else {
            this.startTime = new Date();
            this.endTime = this.startTime;
            this.sendCount = 0;
            this.totalSupply721AtStart = this.state.totalSupply721;
            this.timerId = setInterval(() => {
                this.ray721Token.methods.createToken("http://test.com/test.json").send({
                    from: this.props.accountsInfo.account1.addr,
                    gas: 300000
                });
                this.ray721Token_2.methods.createToken("http://test.com/test.json").send({
                    from: this.props.accountsInfo.account2.addr,
                    gas: 300000
                });
                this.sendCount += 2;
                if((new Date() - this.startTime) % 2000 < 100)
                    this.getInfo();
            }, this.interval);
        }
    };

    getInfo = () => {
        this.ray721Token_3.methods.totalSupply().call({from: this.props.accountsInfo.account1.addr}, (err, result) => {
            this.setState({totalSupply721: result});
        });
    };

    onClickStop = () => {
        if (this.timerId === -1) {
            alert('이미 정지됨')
        } else {
            this.endTime = new Date();
            clearInterval(this.timerId);
            this.timerId = -1;
            let failCnt = 0;
            let createdCount = 0;
            const getInformation = () => {
                let beforeCnt = createdCount;
                createdCount = this.state.totalSupply721 - this.totalSupply721AtStart;
                this.getInfo();
                if(failCnt === 20){
                    alert('전송 개수와 생성 개수가 다릅니다.')
                }else if(Number(createdCount) !== Number(this.sendCount)){
                    setTimeout(getInformation, 3000);
                    if(beforeCnt === createdCount)
                        failCnt += 1;
                }else{
                    console.log('success!!')
                }
            };
            setTimeout(getInformation, 3000)
        }
    };

    onChangeInterval = (e) => {
        this.interval = Number(e.target.value);
    };

    render() {
        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">contract 생성</h3>
                </div>
                <div className="box-body">
                    721 totalSupply : {this.state.totalSupply721}
                    <br/>
                    totalSupply721AtStart : {this.totalSupply721AtStart}
                    <br/>
                    createdCount : {this.state.totalSupply721 - this.totalSupply721AtStart}
                    <br/>
                    sendCount : {this.sendCount}
                    <br/>
                    진행 시간 : {(this.endTime - this.startTime)/1000}s
                </div>

                <div className="box-footer">
                    <button onClick={this.getInfo}>info</button>
                    <input placeholder={'send interval'} onChange={this.onChangeInterval}/>
                    <button onClick={this.onClickStart}>start</button>
                    <button onClick={this.onClickStop}>stop</button>
                </div>
            </div>
        )
    }
}

export default StressTestComponent;
