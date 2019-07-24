import 'string.prototype.repeat';
import Collapse, { Panel } from 'rc-collapse';
import React from 'react';
import ReactDOM from 'react-dom';
import 'rc-collapse/assets/index.css';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Callout} from '@bandwidth/shared-components';
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

function random() {
    return parseInt(Math.random() * 10, 10) + 1;
}

class NestedAccordian extends React.Component {
    state = {
        time: random(),
        accordion: false,
        activeKey: ['4'],
        to: "",
        from: "",
        id: ""
    }

    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    }

    getItems() {
        const items = [];
        for (let i = 0; i < this.props.info.length; i++) {
            const key = i + 1;
            const callLeg = this.props.info[i];  //array of callbacks
            const to = callLeg[0]["to"];
            const from = callLeg[0]["from"];
            const callId = callLeg[0]["callId"];
            const direction = callLeg[0]["direction"];
            //const id = callLeg[0]["executionId"];
            var color = "lightgreen";
            for (let item in callLeg){
                //callLeg[item] is inbound or outbound
                var eachleg  = callLeg[item];
                if (eachleg["success"] == false){
                    color = '#d89090';//'#d17a7a';//"#ff9999";
                }

            }
            var withoutC =[];
            var a = JSON.parse(JSON.stringify(callLeg));
            var list = [];
            for (let i in a){
                var x = a[i];
                list.push(i);
                delete x.color;
                withoutC.push(x);
            }

            items.push(
                <Panel style={{backgroundColor:color,fontWeight:'bold'}}
                       header={`${direction.toUpperCase()} call from ${from} to ${to}`}
                       key={key} >

                    {"Call ID: "+callId+" "}
                    <CopyToClipboard text={callId}>
                        <Callout content="Copy!"><button className="fa fa-clipboard" ></button></Callout>
                    </CopyToClipboard>
                    <br></br>
                    {"From: "+from+" "}
                    <CopyToClipboard text={from}>
                        <Callout content="Copy!"><button className="fa fa-clipboard" ></button></Callout>
                    </CopyToClipboard>
                    {"  To: "+to+" "}
                    <CopyToClipboard text={to}>
                        <Callout content="Copy!"><button className="fa fa-clipboard" ></button></Callout>
                    </CopyToClipboard>
                    <br></br>
                    {"Call Started At: "+callLeg[0]["startedAt"]}


                    {list.map(entry =>
                        <Collapse defaultActiveKey="1" >
                            <Panel style={{backgroundColor:callLeg[entry]['color']}}
                                   header={`Callback event ${callLeg[entry]["eventType"]} `} key={callLeg[entry]}>
                                <Collapse defaultActiveKey="1">
                                    {callLeg[entry]["ValidationErrors"].map(item =>
                                        <p>{item}</p>)
                                    }
                                </Collapse>

                            </Panel>
                        </Collapse>
                    )}

                </Panel>);
        }
        return items;
    }


    toggle = () => {
        this.setState({
            accordion: !this.state.accordion,
        });
    }

    render() {

        const accordion = this.state.accordion;
        const btn = accordion ? 'Mode: accordion' : 'Mode: collapse';
        const activeKey = this.state.activeKey;
        return (<div style={{ margin: 20, width: 700 }}>
            <button onClick={this.toggle}>{btn}</button>

            <br/><br/>
            <Collapse
                accordion={accordion}
                onChange={this.onChange}
                activeKey={activeKey}
            >
                {/*<h3>Call Legs</h3>*/}
                {/*<div>Execution ID: {this.props.info[0][0]["executionId"]+" "}*/}
                {/*<CopyToClipboard text={this.props.info[0][0]["executionId"]}>*/}
                {/*    <Callout content="Copy!"><button className="fa fa-clipboard" ></button></Callout>*/}
                {/*</CopyToClipboard>*/}
                {/*</div>*/}
                {this.getItems()}
            </Collapse>
        </div>);
    }
}

export default NestedAccordian;