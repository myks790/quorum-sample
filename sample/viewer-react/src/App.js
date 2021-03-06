import React, {Component} from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import NodeComponent from "./components/NodeComponent";
import ERCCheckComponent from "./components/ERCCheckComponent";
import SliderbarComponent from "./components/SliderbarComponent";
import StressTestComponent from "./components/StressTestComponent";
import ERC725Component from "./components/ERC725Component";
import L1R2ScenarioComponent from "./components/l1r2/L1R2ScenarioComponent";


const accountInfo = {
    account1: {addr: '0xed9d02e382b34818e88B88a309c7fe71E65f419d', url: 'http://localhost:22000'},
    account1_2: {addr: '0x90b9aa7ed7c850e92cd4ee8a10a1f3925deb069f', url: 'http://localhost:22000'},
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
    {
        title: "StressTest",
        path: '/stressTest',
        contents: () => <StressTestComponent accountsInfo={accountInfo}/>
    },
    {
        title: "ERC725",
        path: '/erc725',
        contents: () => <ERC725Component accountsInfo={accountInfo}/>
    },
    {
        title: "L1 R2 Scenario",
        path: '/l1r2Scenario',
        contents: () => <L1R2ScenarioComponent accountsInfo={accountInfo}/>
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
            <BrowserRouter>
                <>
                    <header className="main-header">
                        <Link className="logo" to={'/'}>
                            <span className="logo-lg"><b>Q</b>uorum</span>
                        </Link>
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
                                <Route path={menuData[2].path} component={menuData[2].contents}/>
                                <Route path={menuData[3].path} component={menuData[3].contents}/>
                                <Route path={menuData[4].path} component={menuData[4].contents}/>
                            </Switch>
                        </section>
                    </div>
                </>
            </BrowserRouter>
        );
    }
}



export default App;
