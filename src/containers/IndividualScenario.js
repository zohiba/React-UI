import React from 'react';
import  {Component} from 'react';
import {Table} from '@bandwidth/shared-components';
import './IndividualScenario.css';
import TableData from "./TableData";
import {getAuthHeader} from "./SetCredentials";
class Individual extends Component {

    state= {tableHeader: [], exeInfo:[], description: ""}

    countOfHeaders(){
        return this.state.tableHeader
            .reduce((sum, header) => sum + header.length, 0);
    }

    hasProblem(validationErrors) {
        return validationErrors != null && validationErrors.find(e => e.includes("Unexpected callback"));
    }

    formatTime(time){
        return time.split(".")[0];
    }

    setTableHeaders(responseBody){
        for (let i in responseBody) {
            const executionInfo = responseBody[i];
            if (executionInfo.successful || executionInfo.completed) {
                let callLegs = executionInfo.callLegs;
                let allLegHeader = [];
                let headerCount = 0;
                callLegs.forEach((callLeg) =>{
                    let callLegHeaders = [];
                    let validationResults = callLeg.validationResults;
                    validationResults.forEach((event)=> {
                        headerCount += 1;
                        let eventName = event.callback.event.eventType;
                        let validationErrors = event.validationErrors;
                        if (this.hasProblem(validationErrors)) {
                            //don't do anything
                        } else {
                            callLegHeaders.push(eventName);
                        }
                    });
                    allLegHeader.push(callLegHeaders);
                    if (headerCount > this.countOfHeaders()) {
                        this.setState({tableHeader: allLegHeader});
                    }
                });
            }
        }
    }

    setTableInformation(responseBody){
        const mainInfo = responseBody
            .filter(execution => execution.successful || execution.completed)
            .map((execution, index) => this.buildExecutionInformation(execution, index));

        let description = mainInfo.length === 0 ? "" : mainInfo[0].description;
        this.setState({exeInfo: mainInfo});
        this.setState({description:description});
    }

    buildExecutionInformation(execution, index) {
        const executionInfo = {};
        executionInfo.num = index;
        executionInfo.id = execution.id;
        executionInfo.completed = execution.completed;
        executionInfo.startedAt = this.formatTime(execution.startedAt);
        executionInfo.errorMessage = execution.errorMessage;
        executionInfo.description = execution.scenario.description;

        let allCallLegs = [];
        let callLegs = execution.callLegs;
        this.state.tableHeader.forEach((columns, callIndex) => {
            let validationResults = callLegs[callIndex].validationResults;
            const callLegEvents = columns.map((col, index) => {
                const callbackEventTypeStatus = {};
                if (validationResults[index] != null) {
                    const callbackEvent = validationResults[index];
                    const eventType = callbackEvent.callback.event.eventType;
                    const valid = callbackEvent.valid;
                    let validationErrors = callbackEvent.validationErrors;
                    if (validationErrors != null && this.hasProblem(validationErrors)) {
                        executionInfo.problem = true;
                    } else {
                        callbackEventTypeStatus.event = eventType;
                        callbackEventTypeStatus.valid = valid;
                    }
                } else {
                    callbackEventTypeStatus.event = "empty";
                    callbackEventTypeStatus.valid = "false";
                }
                return callbackEventTypeStatus;
            });
            allCallLegs.push(callLegEvents);
        });
        executionInfo.callLegs = allCallLegs;
        if (executionInfo.problem === undefined) {
            executionInfo.problem = false;
        }
        return executionInfo;
    }

    async componentDidMount() {

        const response = await fetch('/scenarios/'+this.props.scenario+'/executions', {
            method: 'GET',
            headers: getAuthHeader()
        });
        const responseBody = await response.json();
        this.setTableHeaders(responseBody);
        this.setTableInformation(responseBody);
    }


    render() {
        const scenario = this.props.scenario;
        let legs = [];
        for (let i in this.state.tableHeader){
            legs.push(i);
        }
        const headers = this.state.tableHeader;
        return (
            <div className="table-responsive"><h3 className="scenarioName">{scenario.toUpperCase()}</h3><p><i>{this.state.description}</i></p>
                <Table
                    headers={
                        <React.Fragment>
                            <Table.Row>
                                <Table.Header className="headerWidth">Execution</Table.Header>
                                <Table.Header className="headerWidth">Time</Table.Header>
                                <Table.Header className="headerWidth">Unexpected<br/>Callback</Table.Header>
                                    {legs.map(function(item){
                                        return (
                                            <Table.Header className="callLegs" colSpan={headers[item].length.toString()}>{"Call Leg"+item}</Table.Header>
                                        )})}
                            </Table.Row>
                            <Table.Row>
                                <Table.Header  colSpan={"3"}></Table.Header>
                                    {legs.map(function(item){
                                        return (
                                                <React.Fragment>
                                                    {headers[item].map(function(head){
                                                        return (<Table.Header >{head}</Table.Header>)
                                                    })}
                                                </React.Fragment>
                                            )})
                                    }
                            </Table.Row>
                        </React.Fragment>
                }>

                    {this.state.exeInfo.map(function(execution){
                        let problem = execution.problem ? "Yes" : "No";
                        let count = 0;
                        return (

                            <Table.Row>
                                <TableData link={"/scenarios/"+scenario} exeid={execution["id"]} icon={execution["num"]}/>
                                <Table.Cell>{execution["startedAt"]}</Table.Cell>
                                <Table.Cell className={execution.problem ? "callFailed" : "callPassed"}>{problem}</Table.Cell>

                                {legs.reduce((allColumns, index) => {
                                    const allEvents = execution['callLegs'][index];
                                    return  [

                                        ...allColumns,
                                        ...headers[index].reduce((headerColumns, head) => {
                                            let gotit = 0;
                                            count = 0;

                                            return [

                                                ...headerColumns,
                                                ...allEvents.map((event) => {
                                                    count += 1;
                                                    if (event.event === head) {
                                                        gotit = 1;
                                                        let result= (event.valid == true) ? "passed" : "failed";
                                                        return <Table.Cell className={result}></Table.Cell>;
                                                    }
                                                    if (headers[index].length === count && gotit ===0){
                                                        count =0;
                                                        return <Table.Cell className="missing">missing</Table.Cell>
                                                    }
                                                })
                                            ];

                                        }, [])
                                    ];
                                }, [])}

                            </Table.Row>
                        );}
                    )}
                </Table>
            </div>
        );
    }
}
export default Individual;


