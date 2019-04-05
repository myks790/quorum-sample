import React, {Component} from 'react';
import Web3 from "web3";

const ContractsAddress = require('./../../contracts/ContractsAddress.json');
const ClaimHolderV2 = require('./../../contracts/ClaimHolderV2.json');
const LicenseRepository = require('./../../contracts/LicenseRepository.json');

const CLAIM_TOPIC = {
    "RAY_TOKEN": 7,
    "DRIVING_LICENSE": 8,
};

const CLAIM_SCHEMES = {
    "ECDSA": 1,
    "RSA": 2
};

const KEY_PURPOSES = {
    "MANAGEMENT": 1,
    "EXECUTION": 2,
    "CLAIM_SIGNER_KEY": 3
};

const KEY_TYPES = {
    "ECDSA": 1
};

class PoliceComponent extends Component {

    state = {
        requestList: [],
        keyList: []
    };

    constructor(props) {
        super(props);
        this.web3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account1.url));
        this.claimHolder = new this.web3.eth.Contract(ClaimHolderV2.abi, ContractsAddress.ClaimHolderV2);
        this.licenseRepository = new this.web3.eth.Contract(LicenseRepository.abi, ContractsAddress.LicenseRepository);
        props.msgQ.registCallBack('requestList', (data) => {
            this.setState({requestList: data});
        })
    }

    sign = async (holderAddr, licenseKey, hexedData) => {
        const hashedDataToSign = this.web3.utils.soliditySha3(
            holderAddr,
            CLAIM_TOPIC.DRIVING_LICENSE,
            hexedData,
        );
        const signature = await this.web3.eth.sign(hashedDataToSign, this.props.accountsInfo.account1.addr);
        this.setState({signature: signature});
        return signature;
    };

    addClaimKey = async (key) => {
        const claimKey = this.web3.utils.keccak256(key);
        if (await this.existClaimKey(claimKey)) {
            console.log('The key already exists...');
            console.log('key : ' + claimKey);
        } else {
            await this.claimHolder.methods.addKey(
                claimKey,
                KEY_PURPOSES.MANAGEMENT,
                KEY_TYPES.ECDSA,
            ).send({
                from: this.props.accountsInfo.account1.addr,
                gas: 4612388,
            });
            console.log('success : addClaimKey')
        }
    };

    existClaimKey = async (claimKey) => {
        const keyData = await this.claimHolder.methods.getKey(claimKey).call();
        return keyData.key.toLowerCase() === claimKey.toLowerCase();
    };

    removeClaimKey = async () => {
        const claimKey = this.web3.utils.keccak256(this.state.keyList[this.state.keyList.length - 1]);
        if (!await this.existClaimKey(claimKey)) {
            console.log('Not exists key');
        } else {
            await this.claimHolder.methods.removeKey(
                claimKey,
                KEY_PURPOSES.MANAGEMENT
            ).send({
                from: this.props.accountsInfo.account1.addr,
                gas: 4612388,
            });
            this.state.keyList.pop()
            this.setState({keyList: this.state.keyList.concat()});
            console.log('success : removeClaimKey')
        }
    };

    addClaim = async (personalHolderAddr, signature, hexedData) => {
        const addClaimABI = await this.claimHolder.methods
            .addClaim(
                CLAIM_TOPIC.DRIVING_LICENSE,
                CLAIM_SCHEMES.ECDSA,
                this.claimHolder.options.address,
                signature,
                hexedData,
                "https://www.test.com/test/",
            ).encodeABI();

        await this.claimHolder.methods.execute(
            personalHolderAddr,
            0,
            0,
            addClaimABI
        ).send({
            gas: 4612388,
            from: this.props.accountsInfo.account1.addr,
        });
        console.log('success : addClaim')
    };

    registLicense = async (driverInfo) => {
        let result = await this.licenseRepository.methods.addLicense(driverInfo.personalHolderAddr, driverInfo.name, driverInfo.age).send({
            gas: 46123880,
            from: this.props.accountsInfo.account1.addr
        });
        return result.events.licenseAdded.returnValues.key;
    };

    issue = async () => {
        const driverInfo = this.props.msgQ.pop('requestList');
        const licenseKey = await this.registLicense(driverInfo);
        // const hexedData = this.web3.utils.asciiToHex("legit " + licenseKey);
        const hexedData = licenseKey;

        await this.addClaimKey(driverInfo.personalHolderAddr);

        const sig = await this.sign(driverInfo.personalHolderAddr, licenseKey, hexedData);
        await this.addClaim(driverInfo.personalHolderAddr, sig, hexedData);
        this.setState({keyList: this.state.keyList.concat([driverInfo.personalHolderAddr])});
    };

    render() {
        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">경찰청(account1)</h3>
                </div>
                <div className="box-body">
                    발급 요청 목록:<br/>
                    {this.state.requestList.map((item, idx) => {
                        return <p key={idx}>{item.personalHolderAddr + ',   ' + item.name + ',   ' + item.age}</p>
                    })}
                    <hr/>
                    발급된 licenseKey:<br/>
                    {this.state.keyList.map(item => {
                        return item
                    })}
                </div>
                <div className="box-footer">
                    자격 확인 후 <button onClick={this.issue}>발급</button><br/>
                    <button onClick={this.removeClaimKey}>removeClaimKey</button>
                    : 발급된 라이센스 키 삭제<br/>
                    <br/>
                </div>
            </div>
        );
    }
}

export default PoliceComponent;