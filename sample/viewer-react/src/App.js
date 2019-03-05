import React, {Component} from 'react';
import NodeComponent from "./components/NodeComponent";
import ERCCheckComponent from "./components/ERCCheckComponent";

const accountInfo = {
    account1: {addr: '0xed9d02e382b34818e88B88a309c7fe71E65f419d', url: 'http://localhost:22000'},
    account2: {addr: '0xca843569e3427144cead5e4d5999a3d0ccf92b8e', url: 'http://localhost:22001'},
    account3: {addr: '0x0fbdc686b912d7722dc86510934589e0aaf3b55a', url: 'http://localhost:22002'}
};

class App extends Component {
    render() {
        return (
            <div>
                <ERCCheckComponent accountInfo={accountInfo.account1}/>
                <br/>
                <br/>
                <NodeComponent accountInfo={accountInfo.account1}/>
                <NodeComponent accountInfo={accountInfo.account2}/>
                <NodeComponent accountInfo={accountInfo.account3}/>
            </div>
        );
    }
}

export default App;
