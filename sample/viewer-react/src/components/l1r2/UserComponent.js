import React, {Component} from 'react';
import Web3 from "web3";

const ContractsAddress = require('./../../contracts/ContractsAddress.json');
const ClaimHolderV2 = require('./../../contracts/ClaimHolderV2.json');
const LicenseRepository = require('./../../contracts/LicenseRepository.json');

const CLAIM_TOPIC = {
    "RAY_TOKEN": 7,
    "DRIVING_LICENSE": 8,
};

const KEY_PURPOSES = {
    "MANAGEMENT": 1,
    "EXECUTION": 2,
    "CLAIM_SIGNER_KEY": 3
};

const KEY_TYPES = {
    "ECDSA": 1
};

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

    viewLicense = async () => {
        const driverLicenseClaimIDs = await this.personalHolder.methods.getClaimIdsByTopic(CLAIM_TOPIC.DRIVING_LICENSE).call();
        const claim = await this.personalHolder.methods.getClaim(driverLicenseClaimIDs[0]).call();
        const license = await this.licenseRepository.methods.getLicense(claim.data).call({from: this.personalHolder.options.address});
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
                    <button onClick={this.addPoliceClaimKey}>경찰청에 claim 추가 권한 주기</button>
                    <br/>
                    holder주소 : 위와 같음, 이름 : ray, 나이 : 27 <button onClick={this.requestLicense}>발급 요청</button>
                    <br/>
                    <button onClick={this.viewLicense}>라이센스 보기</button>
                </div>
            </div>
        );
    }
}

export default UserComponent;