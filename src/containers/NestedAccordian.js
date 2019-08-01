import 'string.prototype.repeat';
import Collapse, { Panel } from 'rc-collapse';
import React from 'react';
import 'rc-collapse/assets/index.css';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {Callout, Icon} from '@bandwidth/shared-components';
import "./NestedAccordian.css"

class NestedAccordian extends React.Component {
    state = {
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

    getCallLegs() {
        if (!this.props.info) {
            return [];
        }
        return this.props.info.map((callLeg, index) =>{
            const key= index+1;
            const to = callLeg[0].to;
            const from = callLeg[0].from;
            const callId = callLeg[0].callId;
            const direction = callLeg[0].direction;
            const callLegStatus = callLeg.find(leg => !leg.success) ? "callLegFailed" : "callLegPassed";
            return (
                <Panel className={callLegStatus}
                       header={`${direction.toUpperCase()} call from ${from} to ${to}`}
                       key={key} >

                    {"Call ID: "+callId+" "}
                    <CopyToClipboard text={callId}><Callout content="Copy!"><Icon style={{color:"blue"}} name="copy" /></Callout></CopyToClipboard>

                    <br></br>

                    {"From: "+from+" "}
                    <CopyToClipboard text={from}><Callout content="Copy!"><Icon style={{color:"blue"}} name="copy" /></Callout></CopyToClipboard>
                    {"  To: "+to+" "}
                    <CopyToClipboard text={to}><Callout content="Copy!"><Icon style={{color:"blue"}} name="copy" /></Callout></CopyToClipboard>

                    <br></br>

                    {"Call Started At: "+callLeg[0].startedAt}

                    {callLeg.map(callbackEvent =>
                        <Collapse defaultActiveKey="1" >
                            <Panel className={callbackEvent.success ? "callbackEventPassed" : "callbackEventFailed"}
                                   header={`Callback event ${callbackEvent.eventType} `} key={callbackEvent}>
                                <div defaultActiveKey="1">
                                    {<p>{callbackEvent.bxml}</p>}
                                    {callbackEvent.validationErrors.map(error =>
                                        <p>{error}</p>)
                                    }
                                </div>
                            </Panel>
                        </Collapse>
                    )}
                </Panel>);
        })
    }

    render() {
        const accordion = this.state.accordion;
        const activeKey = this.state.activeKey;
        return (<div className="panelWidth">
            <Collapse accordion={accordion} onChange={this.onChange} activeKey={activeKey}>
                {this.getCallLegs()}
            </Collapse>
        </div>);
    }
}
export default NestedAccordian;


