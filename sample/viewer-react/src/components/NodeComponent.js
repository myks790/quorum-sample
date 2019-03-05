import React, {Component} from 'react';
import Web3 from "web3";

const ContractsAddress = require('./../contracts/ContractsAddress.json');
const RayToken = require('./../contracts/RayToken.json');
const MyCrowdsale = require('./../contracts/MyCrowdsale.json');
const Ray721Token = require('./../contracts/Ray721Token.json');
const Market = require('./../contracts/Market.json');

class NodeComponent extends Component {
    state = {
        datas: {}
    };

    constructor(props) {
        super(props);
        this.web3 = new Web3(new Web3.providers.HttpProvider(props.accountInfo.url));
        this.ray721Token = new this.web3.eth.Contract(Ray721Token.abi, ContractsAddress.Ray721Token);
        this.rayToken = new this.web3.eth.Contract(RayToken.abi, ContractsAddress.RayToken);
        this.crowdsale = new this.web3.eth.Contract(MyCrowdsale.abi, ContractsAddress.MyCrowdsale);
        this.market = new this.web3.eth.Contract(Market.abi, ContractsAddress.Market);
    }

    getInfo = () => {
        const addr = this.props.accountInfo.addr;
        let promises = [];
        let datas = {};
        promises.push(this.web3.eth.getBalance(addr).then((balance) => {
            datas['balance'] = balance;
        }));
        promises.push(this.rayToken.methods.totalSupply().call({from: addr}, (err, result) => {
            datas['totalSupply'] = result;
        }));
        promises.push(this.rayToken.methods.balanceOf(addr).call({from: addr}, (err, result) => {
            datas['tokenBalance'] = result;
        }));
        promises.push(this.ray721Token.methods.tokensOfOwner().call({from: addr}, (err, result) => {
            if (!!result)
                datas['tokensOfOwner721'] = result.toString();
            // this.ray721Token.methods.tokenURI(res[0]).call({from: addr}, (err, res) => {
            //     datas.push({tokenURI: res});
            // });
        }));
        promises.push(this.ray721Token.methods.totalSupply().call({from: addr}, (err, result) => {
            datas['totalSupply721'] = result;
        }));

        Promise.all(promises).then(() => {
            this.setState({datas: datas});
        })
    };

    onClickMint = () => {
        const addrs = this.props.accountInfo.addr;
        this.crowdsale.methods.buyTokens(addrs).send({from: addrs, value:10000, gas:300000});
        this.ray721Token.methods.createToken("http://test.com/test.json").send({from: addrs, gas: 300000});
    };

    onClickBuy = () => {
        let options = {from: this.props.accountInfo.addr, gas: 3000000};
        if (!!this.tokenIdForBuy)
            this.market.methods.tokenPrice(this.tokenIdForBuy).call(options, (err, tokenPrice) =>{
                this.rayToken.methods.approve(ContractsAddress.Market, tokenPrice).send(options, (err, transctionHash) => {
                    this.market.methods.buy(this.tokenIdForBuy).send(options);
                });
            });
        else
            console.log('require tokenId')
    };

    onClickSell = () => {
        let tokenId = this.tokenIdForSell;
        let price = this.priceForSell;
        const options = {
            from: this.props.accountInfo.addr
        };
        this.market.methods.sell(tokenId, price).send(options, (err, transctionHash) => {
            if (err) {
                console.log('sell : fail');
                return false;
            }
            this.ray721Token.methods.approve(ContractsAddress.Market, tokenId).send(options, (err, transctionHash) => {
                console.log('sell : ' + (err ? 'fail' : 'success'));
            });
        });
    };

    onChangeBuyTokenId = (e) => {
        this.tokenIdForBuy = e.target.value;
    };

    onChangeSellToeknId = (e) => {
        this.tokenIdForSell = e.target.value;
    };

    onChangeSellPrice = (e) => {
        this.priceForSell = e.target.value;
    };

    render() {
        const datas = this.state.datas;

        return (
            <div>
                accounts : {this.props.accountInfo.addr}
                <br/>
                balance : {datas.balance}
                <br/>
                totalSupply : {datas.totalSupply}
                <br/>
                tokenBalance : {datas.tokenBalance}
                <br/>
                721 tokensOfOwner : {datas.tokensOfOwner721}
                <br/>
                721 totalSupply : {datas.totalSupply721}
                <br/>
                721 tokenURI : {datas.tokenURI}
                <br/>
                <button onClick={this.getInfo}>info</button>
                <button onClick={this.onClickMint}>mint</button>
                <p>
                    tokenId : <input onChange={this.onChangeBuyTokenId}/>
                    <button onClick={this.onClickBuy}>buy</button>
                </p>
                <p>
                    tokenId : <input onChange={this.onChangeSellToeknId}/>
                    price : <input onChange={this.onChangeSellPrice}/>
                    <button onClick={this.onClickSell}>sell</button>
                </p>

            </div>
        );
    }
}

export default NodeComponent;
