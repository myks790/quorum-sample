import React, {Component} from 'react';
import PoliceComponent from "./PoliceComponent";
import UserComponent from "./UserComponent";
import MarketComponent from "./MarketComponent";

class MsgQ {
    constructor() {
        this.callback = {
            requestList: function () {
            }
        };
        this.q = {
            requestList: []
        };
    }

    registCallBack = (name, f) => {
        this.callback[name] = f;
    };


    push = (name, data) => {
        if (!!!this.q[name]) this.q[name] = [];
        this.q[name].push(data);
        this._call(name);
    };

    pop = (name) => {
        const data = this.q[name].pop();
        this._call(name);
        return data;
    };

    popWithoutCallback = (name) => {
        this.q[name].pop();
    };

    _call(name) {
        if (!!!this.callback[name])
            console.log('not exist');
        else
            this.callback[name](this.q[name]);
    }
}


class L1R2ScenarioComponent extends Component {

    constructor(props) {
        super(props);
        this.msgQ = new MsgQ();
        this.msgQForMarket = new MsgQ();
    }

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
                <UserComponent msgQ={this.msgQ} msgQForMarket={this.msgQForMarket} {...this.props}/>
                <PoliceComponent msgQ={this.msgQ} {...this.props}/>
                <MarketComponent msgQForMarket={this.msgQForMarket} {...this.props}/>
            </>
        );
    }
}

export default L1R2ScenarioComponent;