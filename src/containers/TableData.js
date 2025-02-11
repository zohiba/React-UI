
import React, {Component} from 'react';
import NestedAccordian from './NestedAccordian';
import {Button, H2, Horizontal, Modal} from "@bandwidth/shared-components";
import {getAuthHeader} from "./SetCredentials";
import "./TableData.css"
class TableData extends Component {

    constructor (props) {
        super(props);
        this.state = {callLegs : "", errorInfo: "", inboundErrorInfo: "", outboundErrorInfo: "",
            value: "", inbound:"", outbound: "", inboundValidationSet: "", outboundValidationSet: "",
            allCallLegs: "",
            errorMessage: "",
            completed: ""};
    }

    getErrorMessage(error){
        return error ? error : ["no error"];
    }

    async customizeModalData() {
        const url = this.props.link+"/executions/"+this.props.exeid;
        const response = await fetch(url, {method:'GET', headers: getAuthHeader()});
        const content = await response.json();

        this.setState({
            value: content.successful,
            callLegs: content.callLegs,
            errorMessage: content.errorMessage,
            complete: content.completed
        });

        let allCallLegs = [];
        for (let index in this.state.callLegs){
            let eachCallLeg = [];
            const callLeg = this.state.callLegs[index];
            const validationResults = callLeg.validationResults;
            if (validationResults.length ==0){
                let customLegInformation = {};
                customLegInformation.success = callLeg.completed;
                customLegInformation.startedAt = callLeg.startedAt;
                customLegInformation.eventType = "No Event Occured";
                customLegInformation.direction =  callLeg.callDirection;
                customLegInformation.to = callLeg.to.number;
                customLegInformation.from = callLeg.from.number;
                customLegInformation.callId = callLeg.callId;
                customLegInformation.executionId = callLeg.executionId;
                customLegInformation.validationErrors = [this.state.errorMessage];
                customLegInformation.bxml = "No bxml Response";
                customLegInformation.errorMessage=callLeg.errorMessage;
                eachCallLeg.push(customLegInformation);
            }
            else {

                for (let indexValidationResults in validationResults) {
                    const callbackEvent = validationResults[indexValidationResults];
                    let customLegInformation = {};
                    customLegInformation.success = callbackEvent.valid;
                    customLegInformation.eventType = callbackEvent.callback.event.eventType;
                    customLegInformation.direction = callbackEvent.callback.event.direction;
                    customLegInformation.to = callbackEvent.callback.event.to;
                    customLegInformation.from = callbackEvent.callback.event.from;
                    customLegInformation.callId = callbackEvent.callback.event.callId;
                    customLegInformation.executionId = callLeg.executionId;
                    customLegInformation.validationErrors = this.getErrorMessage(callbackEvent.validationErrors);
                    customLegInformation.startedAt = callLeg.startedAt;
                    customLegInformation.bxml = callbackEvent.bxml;;
                    customLegInformation.errorMessage = callLeg.errorMessage;
                    eachCallLeg.push(customLegInformation);
                }
            }
            allCallLegs.push(eachCallLeg);
        }
        this.setState({allCallLegs: allCallLegs});
    }


    render () {
        let title = "Execution ID: "+this.props.exeid;

        const toggle = () => {
            this.setState({ show: !this.state.show });
            this.customizeModalData();
        };

        return (
            <td >
                <div>
                    <button className="tableDataButton" onClick={toggle}> {this.props.icon}</button>
                    {this.state.show && (
                        <Modal
                            title= {title}
                            actionContent={
                                <Horizontal>
                                    <Button icon="delete" onClick={toggle}>Close</Button>
                                </Horizontal>
                            }
                        >

                            <div>
                                <H2  className="modalHeading">Call Legs</H2>
                                <div className="modalHeading">{this.state.errorMessage}</div>
                                <NestedAccordian info={this.state.allCallLegs}></NestedAccordian>
                            </div>
                        </Modal>
                    )}
                </div>
            </td>

        );
    }
}

export default TableData;
