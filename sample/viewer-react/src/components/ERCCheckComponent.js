import React, {Component} from 'react';
import Web3 from "web3";

const ContractsAddress = require('./../contracts/ContractsAddress.json');
const IERC165 = require('./../contracts/IERC165.json');

class ERCCheckComponent extends Component {
    state = {
        myCrowdsaleIsERC165: null,
        ray721TokenIsERC165: null,
        ray721TokenIsERC721: null
    };

    constructor(props) {
        super(props);
        this.web3 = new Web3(new Web3.providers.HttpProvider(props.accountInfo.url));
        this.ERC165 = new this.web3.eth.Contract(IERC165.abi);
    }

    componentDidMount() {
        this.checkERC165(ContractsAddress.Ray721Token, 'ray721TokenIs');
        this.checkERC165(ContractsAddress.MyCrowdsale, 'myCrowdsaleIs');
    }

    checkERC165 = (contractAddress, saveName) => {
        let obj = {};
        this.web3.eth.sendTransaction({
            from: this.props.accountInfo.addr,
            to: contractAddress,
            data: '0x01ffc9a701ffc9a700000000000000000000000000000000000000000000000000000000', //contract.supportsInterface(0x01ffc9a7)
            gas: 30000
        }).on('receipt', (receipt) => {
            this.ERC165.options.address = contractAddress;
            this.ERC165.methods.supportsInterface('0xffffffff').call({
                from: this.props.accountInfo.addr,
                to: contractAddress
            }, (err, isSupported) => {
                if (isSupported === false) {
                    obj[saveName + 'ERC165'] = 'true';
                    this.setState(obj);
                    this.checkERC721(contractAddress, saveName + 'ERC721')
                }
            });
        }).on('error', (err) => {
            obj[saveName + 'ERC165'] = 'false';
            this.setState(obj);
        })

    };

    checkERC721 = (contractAddress, saveName) => {
        let obj = {};
        this.ERC165.options.address = contractAddress;
        this.ERC165.methods.supportsInterface('0x80ac58cd').call({
            from: this.props.accountInfo.addr,
            to: contractAddress
        }, (err, isSupported) => {
            if (isSupported === true) {
                obj[saveName] = 'true';
                this.setState(obj);
            }
        })
    };

    render() {
        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">erc165 구현 검사</h3>
                </div>
                <div className="box-body">
                    myCrowdsale is ERC165 ? : {this.state.myCrowdsaleIsERC165}
                    <br/>
                    ray721token is ERC165 ? : {this.state.ray721TokenIsERC165}
                    <br/>
                    ray721token is ERC721 ? : {this.state.ray721TokenIsERC721}
                </div>
            </div>
        );
    }
}

export default ERCCheckComponent;
