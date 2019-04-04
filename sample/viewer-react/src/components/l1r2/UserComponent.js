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
    "PERSON_IN_CHANGE": 3,
    "DRIVING_LICENSE": 4
};

const KEY_TYPES = {
    "ECDSA": 1
};

class L1R2ScenarioComponent extends Component {
    state = {
        licenseKey: '',
        personalHolder: '',
        myHolderAddr: null,
        holderBalance: 0,
        signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        hexedData: '0x00',
        requestList: [],
        keyList: []
    };

    constructor(props) {
        super(props);
        this.web3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account1.url));
        this.claimHolder = new this.web3.eth.Contract(ClaimHolderV2.abi, ContractsAddress.ClaimHolderV2);
        this.licenseRepository = new this.web3.eth.Contract(LicenseRepository.abi, ContractsAddress.LicenseRepository);
        this.web3_3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account3.url));

        props.msgQ.registCallBack('issueResult', (result) => {
            console.log(result)
            this.addClaim(result[0].issuer, result[0].sig, result[0].hexedData);
            // props.msgQ.popWithoutCallback('issueResult')
        })
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

    addIssuer = async () => {
        if (!this.checkHolder()) return;
        console.log("Adding RAY_TOKEN claim on personal ClaimHolder...");
        const claimIssuer = this.claimHolder.options.address;
        const addClaimABI = await this.personalHolder.methods
            .addClaim(
                CLAIM_TOPIC.DRIVING_LICENSE,
                CLAIM_SCHEMES.ECDSA,
                claimIssuer,
                this.state.signature,
                this.state.hexedData,
                "https://www.test.com/test/",
            ).encodeABI();

        const aa = await this.personalHolder.methods.execute(
            this.personalHolder.options.address,
            0,
            0,
            addClaimABI
        ).send({
            gas: 4612388,
            from: this.props.accountsInfo.account3.addr,
        });
        console.log(aa)
        console.log("add success");
    };

    checkHolder = () => {
        if (!!!this.personalHolder) {
            alert('holder가 없습니다.');
            return false;
        }
        return true;
    };

    sign = async (holderAddr, licenseKey) => {
        const hexedData = this.web3.utils.asciiToHex(licenseKey);
        this.setState({hexedData: hexedData});
        const hashedDataToSign = this.web3.utils.soliditySha3(
            holderAddr,
            CLAIM_TOPIC.DRIVING_LICENSE,
            hexedData,
        );
        const signature = await this.web3.eth.sign(hashedDataToSign, this.props.accountsInfo.account1.addr);
        this.setState({signature: signature});
        return signature;
    };

    addClaim = async (claimIssuer, signature, hexedData) => {
        const addClaimABI = await this.personalHolder.methods
            .addClaim(
                CLAIM_TOPIC.DRIVING_LICENSE,
                CLAIM_SCHEMES.ECDSA,
                claimIssuer,
                signature,
                hexedData,
                "https://www.test.com/test/",
            ).encodeABI();

        await this.personalHolder.methods.execute(
            this.personalHolder.options.address,
            0,
            0,
            addClaimABI
        ).send({
            gas: 4612388,
            from: this.props.accountsInfo.account3.addr,
        });
        console.log('success : addClaim')
    };

    addPoliceClaimKey = async () => {
        const claimKey = this.web3.utils.keccak256(this.claimHolder.options.address);
        if (await this.existClaimKey2(claimKey)) {
            console.log('The key already exists...');
            console.log('key : ' + claimKey);
        } else {
            await this.personalHolder.methods.addKey(
                claimKey,
                KEY_PURPOSES.MANAGEMENT,
                KEY_TYPES.ECDSA,
            ).send({
                from: this.props.accountsInfo.account3.addr,
                gas: 4612388
            });
            console.log('success : addClaimKey')
        }
    };

    existClaimKey2 = async (claimKey) => {
        const keyData = await this.personalHolder.methods.getKey(claimKey).call();
        return keyData.key === claimKey;
    };

    requestLicense = async () => {
        this.props.msgQ.push('requestList', {
            personalHolderAddr: this.state.personalHolder,
            name: 'ray',
            age: 27
        });
    };

    viewLicense = async () => {
        const driverLicenseClaimIDs = await this.personalHolder.methods.getClaimIdsByTopic(CLAIM_TOPIC.DRIVING_LICENSE).call();
        const claim = await this.personalHolder.methods.getClaim(driverLicenseClaimIDs[0]).call();
        const license = await this.licenseRepository.methods.getLicense(claim.data).call({from:this.personalHolder.options.address});
        console.log(license)
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
                    holder주소 : 위와 같음, 이름 : ray, 나이 : 27 <button onClick={this.requestLicense}>발급 요청</button>
                    <br/>
                    <button onClick={this.viewLicense}>라이센스 보기</button>
                </div>
            </div>
        );
    }
}

export default L1R2ScenarioComponent;