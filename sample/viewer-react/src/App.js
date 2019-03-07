import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NodeComponent from "./components/NodeComponent";
import ERCCheckComponent from "./components/ERCCheckComponent";
import SliderbarComponent from "./components/SliderbarComponent";

const accountInfo = {
    account1: {addr: '0xed9d02e382b34818e88B88a309c7fe71E65f419d', url: 'http://localhost:22000'},
    account2: {addr: '0xca843569e3427144cead5e4d5999a3d0ccf92b8e', url: 'http://localhost:22001'},
    account3: {addr: '0x0fbdc686b912d7722dc86510934589e0aaf3b55a', url: 'http://localhost:22002'}
};

const menuData = [
    {
        title: "상태",
        path: "/",
        contents: () => <>
            <NodeComponent accountInfo={accountInfo.account1}/>
            <NodeComponent accountInfo={accountInfo.account2}/>
            <NodeComponent accountInfo={accountInfo.account3}/>
        </>
    },
    {
        title: "ERC165Test",
        path: '/erc165test',
        contents: () => <ERCCheckComponent accountInfo={accountInfo.account1}/>
    },
];

class App extends Component {
    state = {
        selectedMenu: 0
    };

    changeMenu = (menuNumber) => {
        this.setState({selectedMenu: menuNumber});
    };

    render() {
        return (
            <Router>
                <>
                    <header className="main-header">
                        <a className="logo">
                            <span className="logo-lg"><b>S</b>ampele</span>
                        </a>
                    </header>

                    <SliderbarComponent selectedMenu={this.state.selectedMenu} menu={menuData}
                                        changeMenu={this.changeMenu}/>

                    <div className="content-wrapper">
                        <section className="content-header">
                            <h1>
                                {menuData[this.state.selectedMenu].title}
                            </h1>
                        </section>

                        <section className="content">
                            <Switch>
                                <Route exact path={menuData[0].path} component={menuData[0].contents}/>
                                <Route path={menuData[1].path} component={menuData[1].contents}/>
                            </Switch>
                        </section>
                    </div>
                </>
            </Router>
        );
    }
}

//<Menu selectedMenu={this.state.selectedMenu}/>


export default App;
