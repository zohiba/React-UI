import React from 'react';
import './DashboardScenario.css';
import TableEntry from './TableEntry';
import { Table } from 'reactstrap';
import {Link} from '@bandwidth/shared-components';

class HomeScenario extends React.Component {
    state= { rowId: [], user:"", password: "", executions: 20};

    retrieveData = async () =>{

        let user =localStorage.getItem("user");
        let password = localStorage.getItem("pass");
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from(user + ":" + password).toString('base64'));

        const response = await fetch('/scenarios', {method:'GET', headers: headers});
        const body =  await response.json();

        let id = [];
        Object.values(body).map((key) => (
            id.push(key["id"])
        ));
        const exeIds= [];
        for (let i in id) {
            const scenarioExecutionIds =[];
            const url = '/scenarios/' + id[i] + '/executions';
            scenarioExecutionIds.push(id[i]);
            const response = await fetch(url, {method: 'GET', headers: headers});
            const responseBody = await response.json();
            let dataPoint = Math.min(responseBody.length,20);
            for (let i = 0; i < dataPoint; i++) {
                const obj = responseBody[i];
                scenarioExecutionIds.push(obj["id"]);
            }
            exeIds.push(scenarioExecutionIds);
        }
        this.setState({rowId: exeIds});
    };

    getRowExecutions = async(link)=>{
        let user =localStorage.getItem("user");
        let password = localStorage.getItem("pass");
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + Buffer.from(user + ":" + password).toString('base64'));

        const response = await fetch(link, {method:'GET', headers: headers});
        const body =  await response.json();
        return body;
    };

    componentDidMount() {
        this.retrieveData();
        this.pollingHandle = setInterval(this.retrieveData, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.pollingHandle);
    }

    componentDidUpdate(){
        console.log("component updated");
    }

    render() {
        let columnCount = Array.from(Array(this.state.executions).keys());

        return (
            <div className="page">
                <br></br>
                <p><b>List of test Scenarios</b></p>
                <Table className="TableStyle">
                    <thead>
                    <tr >
                        <th>Scenarios</th>
                        {columnCount.map(function(number){
                            return (<th className="text-center">{number+1}</th>)
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.rowId.map(function(rowInfo){
                        const linkWithScenarioName = "/scenarios/"+rowInfo[0];
                        const page = "scenarios/"+rowInfo[0];
                        return(
                            <tr key={rowInfo[0]}>
                                <th><Link to={page}>{rowInfo[0].toUpperCase()}</Link></th>
                                {columnCount.map(function(column){
                                    return ( <TableEntry link={linkWithScenarioName} exeid={rowInfo[column+1]}/>)
                                })}
                            </tr>)
                    })
                    }
                    </tbody>
                </Table>
            </div>
        );
    }
}
export default HomeScenario;



import React, {Component} from 'react';
import NestedAccordian from './NestedAccordian';
import { Modal, Horizontal, Button, H2 } from '@bandwidth/shared-components';

class TableEntry extends Component {

    constructor (props) {
        super(props);
        this.state = {callLegs : "", errorInfo: "", value: "", allCallLegs: "", errorMessage: "", completed: "", exeId: "", nodata:""};
    }

    parser(error){
        if (error == null){
            return ["no error"];
        }
        return error;
    }

    setAllCallLegs(){
        let allCallLegs = [];
        let id = "";
        for (let i in this.state.callLegs) {
            let eachCallLeg = [];
            const callLeg = this.state.callLegs[i];
            const validationResults = callLeg.validationResults;
            id = callLeg.executionId;

            if (validationResults.length == 0) {
                let color = '#A9A9A9';

                if (callLeg["completed"]) {
                    color = '#cff5ce';
                } else {
                    color = '#e8bdbd';
                }

                let jsonObject = {};
                jsonObject.success = callLeg.completed;
                jsonObject.startedAt = callLeg.startedAt;
                jsonObject.executionId = callLeg.executionId;
                jsonObject.eventType = "No Event Occured";
                jsonObject.direction = callLeg.callDirection;
                jsonObject.to = callLeg.to.number;
                jsonObject.from = callLeg.from.number;
                jsonObject.callId = callLeg.callId;
                jsonObject.ValidationErrors = [this.state.errorMessage];  //parseErrors(validationErrors)
                jsonObject.color = color;
                eachCallLeg.push(jsonObject);
            }
            else {

                for (let j in validationResults) {
                    const callbackEvent = validationResults[j];
                    const callbackEventType = callbackEvent.callback.event.eventType;
                    const direction = callbackEvent.callback.event.direction;
                    const to = callbackEvent.callback.event.to;
                    const from = callbackEvent.callback.event.from;
                    const callId = callbackEvent.callback.event.callId;
                    const validationErrors = callbackEvent.validationErrors;
                    let color = '#A9A9A9';

                    if (callbackEvent.valid) {
                        color = '#cff5ce';
                    } else {
                        color = '#e8bdbd';
                    }
                    let jsonObject = {};
                    jsonObject.success = callbackEvent.valid;
                    jsonObject.eventType = callbackEventType;
                    jsonObject.direction = direction;
                    jsonObject.to = to;
                    jsonObject.from = from;
                    jsonObject.callId = callId;
                    jsonObject.ValidationErrors = this.parser(validationErrors);  //parseErrors(validationErrors)
                    jsonObject.color = color;
                    jsonObject.startedAt = callLeg.startedAt;
                    jsonObject.executionId = callLeg.executionId;
                    eachCallLeg.push(jsonObject);
                }
            }
            allCallLegs.push(eachCallLeg);
        }
        this.setState({allCallLegs: allCallLegs});
        this.setState({exeId: id});
    }

    retrieveInfo = async ()=>{

        if (!this.props.exeid) {
            this.setState({nodata: 0});
            return;
        }
        const url = this.props.link + "/executions/" + this.props.exeid;
        let headers = new Headers();
        let user = localStorage.getItem("user");
        let password = localStorage.getItem("pass");
        headers.set('Authorization', 'Basic ' + Buffer.from(user + ":" + password).toString('base64'));

        const response = await fetch(url, {method: 'GET', headers: headers});
        const content = await response.json();

        this.setState({value: content.successful});
        this.setState({callLegs: content.callLegs});
        this.setState({errorMessage: content.errorMessage});
        this.setState({complete: content.completed});
        this.setAllCallLegs();
    };

    async componentDidMount() {
        this.retrieveInfo();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.exeid == prevProps.exeid){
            console.log("same");
        }
        else{
            this.retrieveInfo();
        }
    }

    render () {

        let pass_fail_load;
        if (this.state.complete == false){
            pass_fail_load = "load";
        }
        else{
            if (this.state.value){
                pass_fail_load  = "pass";
            }
            else {
                pass_fail_load = "fail";
            }
        }

        if (this.state.exeId == ""){
            pass_fail_load ="nodata";
        }

        let title = "Execution ID: "+this.state.exeId;
        const toggle = () => this.setState({ show: !this.state.show });
        return (
            <td >
                <div>
                    <button className={pass_fail_load} style={{width:60}} onClick={toggle}></button>
                    {this.state.show && (
                        <Modal
                            title= {title}
                            actionContent={
                                <Horizontal spacing="md" style={{ alignItems: 'center'}}>
                                    <Button icon="delete" onClick={toggle}>Close</Button>
                                </Horizontal>
                            }
                        >
                            <div style={{ fontSize: '14px' }}>
                                <H2 style={{textAlign:"left", paddingLeft:"18px"}}>Call Legs</H2>
                                <NestedAccordian info={this.state.allCallLegs}></NestedAccordian>
                            </div>
                        </Modal>
                    )}
                </div>
            </td>
        );
    }
}

export default TableEntry;


//
// setTableInformation(responseBody){
//     let description = "";
//     const mainInfo = [];
//     for (let i in responseBody) {
//         const obj = responseBody[i];
//         let executionInfo = {};
//         if (obj.successful || obj.completed) {
//             let callLegs = obj.callLegs;
//             executionInfo.num = i;
//             executionInfo.id = obj.id;
//             executionInfo.completed = obj.completed;
//             executionInfo.startedAt = this.formatTime(obj.startedAt);
//             executionInfo.errorMessage = obj.errorMessage;
//             executionInfo.description = obj.scenario.description;
//             description = obj.scenario.description;
//             let jsonCallLegs = [];
//             const numLegs = this.state.tableHeader.length;
//             for (let callIndex in Array.from(Array(numLegs).keys())) {
//                 console.log("I am about to index with "+callIndex);
//
//                 const columns = this.state.tableHeader[callIndex];
//                 let eachCallLeg = callLegs[callIndex];
//                 let validationResults = eachCallLeg.validationResults;
//                 const jsonEvents = [];
//                 for (let events in columns) {
//                     const jsonEvent = {};
//                     if (validationResults[events] != null) {
//                         const callEvent = validationResults[events];
//                         const eventType = callEvent.callback.event.eventType;
//                         const valid = callEvent.valid;
//
//                         let validationErrors = callEvent.validationErrors;
//                         if (validationErrors != null && this.hasProblem(validationErrors)){
//                             executionInfo.prob = "Yes";
//                         }
//                         else {
//                             jsonEvent.event = eventType;
//                             jsonEvent.valid = valid;
//                         }
//
//                     } else {
//                         jsonEvent.event = "empty";
//                         jsonEvent.valid = "false";
//                     }
//                     jsonEvents.push(jsonEvent);
//                 }
//                 jsonCallLegs.push(jsonEvents);
//             }
//             executionInfo.callLegs = jsonCallLegs;
//             if (executionInfo.prob === undefined){
//                 executionInfo.prob = "No";
//             }
//             mainInfo.push(executionInfo);
//         }
//     }
//     this.setState({exeInfo: mainInfo});
//     this.setState({description:description});
//
// }



// getCallLegs() {
//     const callLegs = [];
//     console.log(this.props.info);
//     for (let i = 0; i < this.props.info.length; i++) {
//         const key = i + 1;
//
//         const callLeg = this.props.info[i];  //array of callbacks
//         const to = callLeg[0].to;
//         const from = callLeg[0].from;
//         const callId = callLeg[0].callId;
//         const direction = callLeg[0].direction;
//         let callLegStatus = "callLegPassed";
//         for (let item in callLeg){
//             let eachLeg  = callLeg[item];
//             if (eachLeg.success == false){
//                 callLegStatus = "callLegFailed";
//             }
//         }
//         callLegs.push(
//             <Panel className={callLegStatus}
//                    header={`${direction.toUpperCase()} call from ${from} to ${to}`}
//                    key={key} >
//
//                 {"Call ID: "+callId+" "}
//                     <CopyToClipboard text={callId}><Callout content="Copy!"><Icon style={{color:"blue"}} name="copy" /></Callout></CopyToClipboard>
//
//                 <br></br>
//
//                 {"From: "+from+" "}
//                     <CopyToClipboard text={from}><Callout content="Copy!"><Icon style={{color:"blue"}} name="copy" /></Callout></CopyToClipboard>
//                 {"  To: "+to+" "}
//                     <CopyToClipboard text={to}><Callout content="Copy!"><Icon style={{color:"blue"}} name="copy" /></Callout></CopyToClipboard>
//
//                 <br></br>
//
//                 {"Call Started At: "+callLeg[0].startedAt}
//
//                 {callLeg.map(callbackEvent =>
//                     <Collapse defaultActiveKey="1" >
//                         <Panel className={callbackEvent.success ? "callbackEventPassed" : "callbackEventFailed"}
//                                header={`Callback event ${callbackEvent.eventType} `} key={callbackEvent}>
//                             <div defaultActiveKey="1">
//                                 {<p>{callbackEvent.bxml}</p>}
//                                 {callbackEvent.validationErrors.map(error =>
//                                     <p>{error}</p>)
//                                 }
//                             </div>
//                         </Panel>
//                     </Collapse>
//                 )}
//             </Panel>);
//     }
//     //)
//     return callLegs;
// }
