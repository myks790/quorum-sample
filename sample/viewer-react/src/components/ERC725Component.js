import React, {Component} from 'react';
import Web3 from "web3";

const ContractsAddress = require('./../contracts/ContractsAddress.json');
const ClaimHolder = require('./../contracts/ClaimHolder.json');
const RayToken = require('./../contracts/RayToken.json');
const MyCrowdsaleWithHolder = require('./../contracts/MyCrowdsaleWithHolder.json');

const CLAIM_TOPIC = {
    "RAY_TOKEN": 7
};

const CLAIM_SCHEMES = {
    "ECDSA": 1,
    "RSA": 2
};

class ERC725Component extends Component {
    state = {
        myHolderAddr: null,
        holderBalance: 0,
        signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        hexedData: '0x00'
    };

    constructor(props) {
        super(props);
        this.web3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account1.url));
        this.claimHolder = new this.web3.eth.Contract(ClaimHolder.abi, ContractsAddress.ClaimHolder);
        this.rayToken = new this.web3.eth.Contract(RayToken.abi, ContractsAddress.RayToken);
        this.crowdsale = new this.web3.eth.Contract(MyCrowdsaleWithHolder.abi, ContractsAddress.MyCrowdsaleWithHolder);
        this.web3_3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account3.url));
    }

    createPersonalHolder = () => {
        console.log("Deploying myHolder...");
        const abi = ClaimHolder.abi;
        const bytecode = ClaimHolder.bytecode
            .replace(/_+KeyHolderLibrary_+/g, ContractsAddress.KeyHolderLibrary.replace("0x", ""))
            .replace(/_+ClaimHolderLibrary_+/g, ContractsAddress.ClaimHolderLibrary.replace("0x", ""));
        const Contract = new this.web3_3.eth.Contract(abi);

        Contract.deploy({
            data: bytecode
        }).send({
            from: this.props.accountsInfo.account3.addr,
            gas: 3000000
        }).then((newContractInstance) => {
            this.personalHolder = newContractInstance;
            this.setState({myHolderAddr: newContractInstance.options.address});
            console.log('deploy success');
        });
    };

    addIssuer = async () => {
        if (!this.checkHolder()) return;
        console.log("Adding RAY_TOKEN claim on personal ClaimHolder...");
        const claimIssuer = this.claimHolder.options.address;
        const addClaimABI = await this.personalHolder.methods
            .addClaim(
                CLAIM_TOPIC.RAY_TOKEN,
                CLAIM_SCHEMES.ECDSA,
                claimIssuer,
                this.state.signature,
                this.state.hexedData,
                "https://www.test.com/test/",
            ).encodeABI();

        await this.personalHolder.methods.execute(
            this.personalHolder.options.address,
            0,
            addClaimABI,
        ).send({
            gas: 4612388,
            from: this.props.accountsInfo.account3.addr,
        });
        console.log("add success");
    };

    buyToken = async () => {
        if (!this.checkHolder()) return;
        const buyTokens = this.crowdsale.methods.buyTokens(
            this.personalHolder.options.address
        ).encodeABI();

        console.log('buying...');
        const ammount = 100;
        await this.personalHolder.methods.execute(
            this.crowdsale.options.address,
            ammount,
            buyTokens,
        ).send({
            gas: 46123880,
            from: this.props.accountsInfo.account3.addr,
            value: ammount,
        });
        const balance = await this.rayToken.methods.balanceOf(this.personalHolder.options.address).call();
        console.log("result : personalHolder balance:", balance);
        this.setState({holderBalance: balance})
    };
    checkHolder = () => {
        if (!!!this.personalHolder) {
            alert('holder가 없습니다.');
            return false;
        }
        return true;
    };

    sign = async () => {
        if (!this.checkHolder()) return;
        const hexedData = this.web3.utils.asciiToHex("legit");
        this.setState({hexedData: hexedData});
        const hashedDataToSign = this.web3.utils.soliditySha3(
            this.personalHolder.options.address,
            CLAIM_TOPIC.RAY_TOKEN,
            hexedData,
        );
        const signature = await this.web3.eth.sign(hashedDataToSign, this.props.accountsInfo.account1.addr);
        this.setState({signature: signature});
    };

    render() {
        return (
            <>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">순서</h3>
                    </div>
                    <div className="box-body">
                        holder생성 -> Sign -> Adding claim Issuer -> buyToken
                    </div>
                </div>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">이용자(account3)</h3>
                    </div>
                    <div className="box-body">
                        {!!this.state.myHolderAddr ?
                            <span>holder addr : {this.state.myHolderAddr}</span> :
                            <button onClick={this.createPersonalHolder}>holder 생성</button>
                        }<br/>
                        <button onClick={this.addIssuer}>Adding claim Issuer</button>
                        <br/>
                        <button onClick={this.buyToken}>buyToken</button>
                        <br/>
                        holderBalance : {this.state.holderBalance}
                    </div>
                </div>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Issuer(account1)</h3>
                    </div>
                    <div className="box-body">
                        <button onClick={this.sign}>Sign</button>
                        <br/>
                        signature : {this.state.signature}
                        <br/>
                        hexedData : {this.state.hexedData}
                    </div>
                </div>
            </>
        );
    }
}

export default ERC725Component;