import React, {Component} from 'react';
import Web3 from 'web3';

const ContractsAddress = require('./contracts/ContractsAddress.json');
const RayToken = require('./contracts/RayToken.json');
const MyCrowdsale = require('./contracts/MyCrowdsale.json');
const Ray721Token = require('./contracts/Ray721Token.json');

class App extends Component {
    state = {
        accounts: null
    };

    constructor(props) {
        super(props)
        this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22001"));
        this.ray721Token = new this.web3.eth.Contract(Ray721Token.abi, ContractsAddress.Ray721Token);
        this.rayToken = new this.web3.eth.Contract(RayToken.abi, ContractsAddress.RayToken);
        this.crowdsale = new this.web3.eth.Contract(MyCrowdsale.abi,ContractsAddress.MyCrowdsale);
    }

    componentDidMount() {
    }

    onClickRunBtn = () =>{
        this.web3.eth.getAccounts((error, addrs) => {
            this.setState({accounts:addrs});

            this.web3.eth.getBalance(addrs[0]).then((balance) => {
                this.setState({
                    balance: balance
                });
            });
            this.rayToken.methods.totalSupply().call({from: addrs[0]}, (err, res) => {
                this.setState({
                    totalSupply: res
                });
            });
            this.rayToken.methods.balanceOf(addrs[0]).call( {from: addrs[0]}, (err, res) => {
                this.setState({
                    tokenBalance: res
                });
            });
            this.crowdsale.methods.mintOnce().send({from: addrs[0]});

            this.ray721Token.methods.createToken("http://test.json").send({from: addrs[0], gas:300000}, (err, transactionHash) => {
                console.log(err)
                console.log(transactionHash)
            });
        })
    }

    render() {

        return (
            <div>
                accounts : {this.state.accounts}
                <br/>
                balance : {this.state.balance}
                <br/>
                totalSupply : {this.state.totalSupply}
                <br/>
                tokenBalance : {this.state.tokenBalance}
                <button onClick={this.onClickRunBtn}>run</button>
            </div>
        );
    }
}

export default App;
