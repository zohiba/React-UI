import 'string.prototype.repeat';
import Collapse, { Panel } from 'rc-collapse';
import React from 'react';
import ReactDOM from 'react-dom';
import 'rc-collapse/assets/index.css';
import {CopyToClipboard} from 'react-copy-to-clipboard'

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
        from: ""
    }

    onChange = (activeKey) => {
        this.setState({
            activeKey,
        });
    }

    getItems() {
        const items = [];
        for (let i = 0; i < this.props.info.length; i++) {
            //console.log(i);
            //console.log(this.props.info[i]);
            var mapping;
            const key = i + 1;
            const callLeg = this.props.info[i];  //array of callbacks
            const to = callLeg[0]["to"];
            const from = callLeg[0]["from"];
            const callId = callLeg[0]["callId"];
            const direction = callLeg[0]["direction"];
            var color = "lightgreen";
            for (let item in callLeg){
                //callLeg[item] is inbound or outbound
                var eachleg  = callLeg[item];
                if (eachleg["success"] == false){
                    color = '#d89090';//'#d17a7a';//"#ff9999";
                }

            }
            console.log(callLeg);

            var withoutC =[];
            var a = JSON.parse(JSON.stringify(callLeg));
            var list = [];
            for (let i in a){
                var x = a[i];
                list.push(i);
                delete x.color;
                withoutC.push(x);
            }
            console.log(callLeg)
            console.log(withoutC);

            items.push(

            <Panel style={{backgroundColor:color,fontWeight:'bold'}}
                   header={`${direction.toUpperCase()} call from ${from} to ${to}`}
                   key={key} >
                   {/*// extra= {<CopyToClipboard text={`${direction.toUpperCase()} call from ${from} to ${to}`}>*/}
                   {/*//     <i className="fa fa-clipboard"></i></CopyToClipboard>}*/}
                   {/*//     >*/}

                {"Call ID: "+callId+" "}
                <CopyToClipboard text={callId}>
                    <i className="fa fa-clipboard"></i>
                </CopyToClipboard>
                <br></br>
                {"From: "+from+" "}
                <CopyToClipboard text={from}>
                    <i className="fa fa-clipboard"></i>
                </CopyToClipboard>
                {"  To: "+to+" "}
                <CopyToClipboard text={to}>
                    <i className="fa fa-clipboard"></i>
                </CopyToClipboard>
                <br></br>
                {"Call Started At: "+callLeg[0]["startedAt"]}
                {/*{callLeg.map(entry =>*/}
                {/*    <Collapse defaultActiveKey="1" >*/}

                {/*        <Panel className="panel" style={{backgroundColor:entry['color']}}*/}
                {/*         header={`Callback event ${entry["eventType"]} `} key={entry}>*/}
                {/*            <Collapse defaultActiveKey="1">*/}

                {/*                <p>{JSON.stringify(entry, null, 1)}</p>*/}
                {/*            </Collapse>*/}

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
            // const eventType = this.props.info[i]["eventType"];
            // const direction = this.props.info[i]["direction"];
            // const info =   JSON.stringify(this.props.info[i], null, 1);
            // console.log(info);

        }

        return items;
    }

    // setActivityKey = () => {
    //     this.setState({
    //         activeKey: ['2'],
    //     });
    // }

    // reRender = () => {
    //     this.setState({
    //         time: random(),
    //     });
    // }

    toggle = () => {
        this.setState({
            accordion: !this.state.accordion,
        });
    }

    render() {
       // console.log(JSON.stringify(this.props.info.length, null, 1));
        const accordion = this.state.accordion;
        const btn = accordion ? 'Mode: accordion' : 'Mode: collapse';
        const activeKey = this.state.activeKey;
        return (<div style={{ margin: 20, width: 700 }}>
            {/*<button onClick={this.reRender}>reRender</button>*/}
            <button onClick={this.toggle}>{btn}</button>

            {/*<button onClick={this.setActivityKey}>active header 2</button>*/}
            <br/><br/>
            <Collapse
                accordion={accordion}
                onChange={this.onChange}
                activeKey={activeKey}
            >
                {this.getItems()}
            </Collapse>
        </div>);
    }
}

export default NestedAccordian;