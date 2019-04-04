import React, {Component} from 'react';
import Web3 from "web3";

const ContractsAddress = require('./../../contracts/ContractsAddress.json');
const ClaimHolderV2 = require('./../../contracts/ClaimHolderV2.json');
const LicenseRepository = require('./../../contracts/LicenseRepository.json');
const KeyManager = require('./../../contracts/KeyManager.json');

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
        keyList:[]
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

        const aa  = await this.personalHolder.methods.execute(
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

    sign = async (holderAddr, licenseKey) => {
        const hexedData = this.web3.utils.asciiToHex("legit " + licenseKey);
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

    addClaimKey = async (licenseKey) => {
        const claimKey = this.web3.utils.keccak256(licenseKey);
        if (await this.existClaimKey(claimKey)) {
            console.log('The key already exists...');
            console.log('key : ' + claimKey);
        } else {
            await this.claimHolder.methods.addKey(
                claimKey,
                KEY_PURPOSES.DRIVING_LICENSE,
                KEY_TYPES.ECDSA,
            ).send({
                from: this.props.accountsInfo.account1.addr,
                gas: 4612388,
            });
            this.setState({keyList:[claimKey]});
            console.log('success : addClaimKey')
        }
    };

    addClaim = async (licenseKey) => {
        const hexedData = licenseKey;
        const hashedDataToSign = this.web3.utils.soliditySha3(
            this.personalHolder.options.address,
            CLAIM_TOPIC.DRIVING_LICENSE,
            hexedData,
        );
        const signature = await this.web3.eth.sign(hashedDataToSign, this.props.accountsInfo.account1.addr);

        const claimIssuer = this.claimHolder.options.address;
        const addClaimABI = await this.personalHolder.methods
            .addClaim(
                CLAIM_TOPIC.RAY_TOKEN,
                CLAIM_SCHEMES.ECDSA,
                claimIssuer,
                signature,
                hexedData,
                "https://www.test.com/test/",
            ).encodeABI();

        await this.claimHolder.methods.execute(
            this.claimHolder.options.address,
            0,
            0,
            addClaimABI
        ).send({
            gas: 4612388,
            from: this.props.accountsInfo.account1.addr,
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


    existClaimKey = async (claimKey) => {
        const keyData = await this.claimHolder.methods.getKey(claimKey).call();
        return keyData.key === claimKey;
    };

    existClaimKey2 = async (claimKey) => {
        const keyData = await this.personalHolder.methods.getKey(claimKey).call();
        return keyData.key === claimKey;
    };

    removeClaimKey = async () => {
        const claimKey = this.web3.utils.keccak256(this.state.licenseKey);
        if (!await this.existClaimKey(claimKey)) {
            console.log('Not exists key');
        } else {
            await this.claimHolder.methods.removeKey(
                claimKey,
                KEY_PURPOSES.DRIVING_LICENSE
            ).send({
                from: this.props.accountsInfo.account1.addr,
                gas: 4612388,
            });
            this.setState({licenseKey: ''});
            console.log('success : removeClaimKey')
        }
    };

    requestLicense = async () => {
        this.setState({requestList: [{personalHolderAddr: this.state.personalHolder, name: 'ray', age: 27}]})
    };

    registLicense = async () => {
        const driverInfo = this.state.requestList[0];
        let result = await this.licenseRepository.methods.addLicense(driverInfo.personalHolderAddr, driverInfo.name, driverInfo.age).send({
            gas: 46123880,
            from: this.props.accountsInfo.account1.addr
        });
        let key = result.events.licenseAdded.returnValues.key;

        this.setState({requestList: [], licenseKey: key});
        return key;
    };

    issue = async () => {
        const licenseKey = await this.registLicense();
        await this.addClaimKey(licenseKey);
        const sig = this.sign(this.state.personalHolder, licenseKey);
    };

    viewLicense = async () => {
        if (this.state.personalHolder !== "") {
            const driverLicenseClaimIDs = await this.personalHolder.methods.getClaimIdsByTopic(CLAIM_TOPIC.DRIVING_LICENSE).call();
            console.log(driverLicenseClaimIDs)
            const claim = await this.personalHolder.methods.getClaim(driverLicenseClaimIDs[0]).call();
            console.log(claim)
            // const licenseKeys = await this.personalHolder.methods.getKeysByPurpose(KEY_PURPOSES.DRIVING_LICENSE).call();
            // console.log('licenseKeys')
            // console.log(licenseKeys)
            // const licenseKey = await this.personalHolder.methods.getKey(licenseKeys[0]).call();
            // console.log('licenseKey')
            // const key = this.personalHolder.options.address
            // const license = await this.licenseRepository.methods.getLicense(key).call();
            // const aa = await this.existClaimKey(this.state.licenseKey);
            // console.log(aa)
            // console.log(license)
        }
    };

    render() {
        return (
            <>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">L.1 R.2 use-cases</h3>
                    </div>
                    <div className="box-body">
                        https://w3c.github.io/vc-use-cases/
                    </div>
                </div>
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
                        <button onClick={this.addIssuer}>Adding claim Issuer</button>
                        <br/>
                        <button onClick={this.viewLicense}>라이센스 보기</button>
                    </div>
                </div>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">경찰청(account1)</h3>
                    </div>
                    <div className="box-body">
                        발급 요청 목록:<br/>
                        {this.state.requestList.map(item => {
                            return item.personalHolderAddr + ',   ' + item.name + ',   ' + item.age
                        })}
                        <hr/>
                        발급된 claimKey:<br/>
                        {this.state.keyList.map(item => {
                            return item
                        })}
                    </div>
                    <div className="box-footer">
                        자격 확인 후 <button onClick={this.issue}>발급</button> : {this.state.licenseKey}<br/>
                        sig :{this.state.signature} <br/>
                        <button onClick={this.removeClaimKey}>removeClaimKey</button>
                        : 발급된 라이센스 키 삭제<br/>
                        <br/>
                    </div>
                </div>
            </>
        );
    }
}

export default L1R2ScenarioComponent;