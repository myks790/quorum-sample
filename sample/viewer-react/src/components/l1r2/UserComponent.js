import React, {Component} from 'react';
import Web3 from "web3";

import {CLAIM_SCHEMES, CLAIM_TOPIC, KEY_PURPOSES, KEY_TYPES} from "./CommonVariable"

const ContractsAddress = require('./../../contracts/ContractsAddress.json');
const ClaimHolderV2 = require('./../../contracts/ClaimHolderV2.json');
const LicenseRepository = require('./../../contracts/LicenseRepository.json');


class UserComponent extends Component {
    state = {
        personalHolder: '',
    };

    constructor(props) {
        super(props);
        this.web3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account1.url));
        this.claimHolder = new this.web3.eth.Contract(ClaimHolderV2.abi, ContractsAddress.ClaimHolderV2);
        this.licenseRepository = new this.web3.eth.Contract(LicenseRepository.abi, ContractsAddress.LicenseRepository);
        this.web3_3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account3.url));
    }

    createPersonalHolder = () => {
        console.log("Deploying ClaimHolderV2...");
        const abi = ClaimHolderV2.abi;
        const bytecode = ClaimHolderV2.bytecode;
        const Contract = new this.web3_3.eth.Contract(abi);

        Contract.deploy({
            data: bytecode
        }).send({
            from: this.props.accountsInfo.account3.addr,
            gas: 4000000
        }).then((newContractInstance) => {
            this.personalHolder = newContractInstance;
            this.setState({personalHolder: newContractInstance.options.address});
            console.log('deploy success');
        });
    };

    addPoliceClaimKey = async () => {
        const claimKey = this.web3.utils.keccak256(this.claimHolder.options.address);
        await this.personalHolder.methods.addKey(
            claimKey,
            KEY_PURPOSES.CLAIM_SIGNER_KEY,
            KEY_TYPES.ECDSA,
        ).send({
            from: this.props.accountsInfo.account3.addr,
            gas: 4612388
        });
        console.log('success : add Claim signer Key')
    };

    requestLicense = async () => {
        this.props.msgQ.push('requestList', {
            personalHolderAddr: this.state.personalHolder,
            name: 'ray',
            age: 27
        });
    };

    getLicenseKey = async () => {
        const driverLicenseClaimIDs = await this.personalHolder.methods.getClaimIdsByTopic(CLAIM_TOPIC.DRIVING_LICENSE).call();
        const claim = await this.personalHolder.methods.getClaim(driverLicenseClaimIDs[0]).call();
        return claim.data;
    };

    viewLicense = async () => {
        const licenseKey = await this.getLicenseKey();
        const license = await this.licenseRepository.methods.getLicense(licenseKey).call({from: this.personalHolder.options.address});
        console.log(license)
    };


    addClaim = async (personalHolderAddr, signature, data) => {
        const addClaimABI = await this.claimHolder.methods
            .addClaim(
                CLAIM_TOPIC.DRIVING_LICENSE,
                CLAIM_SCHEMES.CUSTOM_LICENSE,
                personalHolderAddr,
                signature,
                data,
                "https://www.test.com/test/",
            ).encodeABI();

        const result = await this.personalHolder.methods.execute(
            personalHolderAddr,
            0,
            0,
            addClaimABI
        ).send({
            gas: 4612388,
            from: this.props.accountsInfo.account3.addr,
        });
        console.log('success : addClaim');
        return result.events.ClaimAdded.returnValues.claimId;
    };

    sign = async (holderAddr, hexedData) => {
        const hashedDataToSign = this.web3.utils.soliditySha3(
            holderAddr,
            CLAIM_TOPIC.DRIVING_LICENSE,
            hexedData,
        );
        const signature = await this.web3.eth.sign(hashedDataToSign, this.props.accountsInfo.account1.addr);
        return signature;
    };

    issueAndDelivery = async () => {
        const licenseKey = await this.getLicenseKey();

        // const hexedData = this.web3.utils.asciiToHex(`{
        //     LicenseKey:${licenseKey},
        //     selectedInfo:"age",
        //     ExpirationDate:"9999-12-01"
        //     }`);

        //hacking
        const hexedData = this.web3.eth.abi.encodeParameters(['bytes32', 'string', 'string'],[licenseKey, 'age', "9999-12-01"]);

        const sig = await this.sign(this.state.personalHolder, hexedData);

        const claimId = await this.addClaim(this.state.personalHolder, sig, hexedData);
        this.props.msgQForMarket.push('claims',{holderAddr:this.state.personalHolder, claimId:claimId});
    };

    render() {
        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">이용자(account3)</h3>
                </div>
                <div className="box-body">
                    {!!this.state.personalHolder ?
                        <span>personalHolder addr : {this.state.personalHolder}</span> :
                        <span><button onClick={this.createPersonalHolder}>personalHolder 생성</button> : erc725 + erc734 + erc735</span>
                    }<br/>
                    <button onClick={this.addPoliceClaimKey}>경찰청에 claim 추가 권한 주기</button>
                    <br/>
                    holder주소 : 위와 같음, 이름 : ray, 나이 : 27 <button onClick={this.requestLicense}>발급 요청</button>
                    <br/>
                    <button onClick={this.viewLicense}>라이센스 보기</button>
                    <br/>
                    나이만 포함된 Claim : <button onClick={this.issueAndDelivery}>자체 발행 & 마켓에 전달</button>
                </div>
            </div>
        );
    }
}

export default UserComponent;