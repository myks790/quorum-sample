import React, {Component} from 'react';
import NodeComponent from "./components/NodeComponent";

const accountInfo = {
    account1: {addr: '0xed9d02e382b34818e88B88a309c7fe71E65f419d', url: 'http://localhost:22000'},
    account2: {addr: '0xca843569e3427144cead5e4d5999a3d0ccf92b8e', url: 'http://localhost:22001'},
    account3: {addr: '0x0fbdc686b912d7722dc86510934589e0aaf3b55a', url: 'http://localhost:22002'},
    account4: {addr: '0x9186eb3d20cbd1f5f992a950d808c4495153abd5', url: 'http://localhost:22003'},
    account5: {addr: '0x0638e1574728b6d862dd5d3a3e0942c3be47d996', url: 'http://localhost:22004'},
    account6: {addr: '0xae9bc6cd5145e67fbd1887a5145271fd182f0ee7', url: 'http://localhost:22005'},
    account7: {addr: '0xcc71c7546429a13796cf1bf9228bff213e7ae9cc', url: 'http://localhost:22006'}
};

class App extends Component {
    state = {
        accounts: null
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <NodeComponent accountInfo={accountInfo.account1}/>
                <NodeComponent accountInfo={accountInfo.account2}/>
                <NodeComponent accountInfo={accountInfo.account3}/>
                <NodeComponent accountInfo={accountInfo.account4}/>
                <NodeComponent accountInfo={accountInfo.account5}/>
                <NodeComponent accountInfo={accountInfo.account6}/>
                <NodeComponent accountInfo={accountInfo.account7}/>
            </div>
        );
    }
}

export default App;
