import React, {Component} from "react";
import Web3 from "web3";


const ContractsAddress = require('./../../contracts/ContractsAddress.json');
const LicenseRepository = require('./../../contracts/LicenseRepository.json');

class MarketComponent extends Component {
    state = {
        claims: []
    };

    constructor(props) {
        super(props);
        this.web3 = new Web3(new Web3.providers.HttpProvider(props.accountsInfo.account2.url));
        this.licenseRepository = new this.web3.eth.Contract(LicenseRepository.abi, ContractsAddress.LicenseRepository);
        props.msgQForMarket.registCallBack('claims', (data) => {
            this.setState({claims: data});
        })
    }

    validate = async () => {
        const result = await this.licenseRepository.methods.getLicense(this.state.claims[0].holderAddr, this.state.claims[0].claimId).call();
        console.log(result)
    };

    render() {
        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">마켓</h3>
                </div>
                <div className="box-body">
                    {this.state.claims.map((item, idx) => {
                        return <p key={idx}>{'holderAddr : ' + item.holderAddr + ',  claimId : ' + item.claimId}</p>
                    })}
                    <button onClick={this.validate}>검증</button>
                </div>
            </div>
        )
    }
}

export default MarketComponent;