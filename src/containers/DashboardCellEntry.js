
import React, {Component} from 'react';
import NestedAccordian from './NestedAccordian';
import { Modal, Horizontal, Button, H2 } from '@bandwidth/shared-components';
import "./TableData.css"
import "./DashboardScenario.css"
class DashboardCellEntry extends Component {

    constructor (props) {
        super(props);
        this.state = {callLegs: "", errorInfo: "", value: "", allCallLegs: "", errorMessage: "", completed: "", nodata: ""};
    }

    getErrorMessage(error){
        return error ? error : ["no error"];
    }

    setAllCallLegs(callLegs){
        let allCallLegs = [];
        let id = "";
        for (let i in callLegs) {
            let eachCallLeg = [];
            const callLeg = callLegs[i];
            const validationResults = callLeg.validationResults;
            id = callLeg.executionId;

            if (validationResults.length == 0) {
                let customLegInformation = {};
                customLegInformation.success = callLeg.completed;
                customLegInformation.startedAt = callLeg.startedAt;
                customLegInformation.executionId = callLeg.executionId;
                customLegInformation.eventType = "No Event Occured";
                customLegInformation.direction = callLeg.callDirection;
                customLegInformation.to = callLeg.to.number;
                customLegInformation.from = callLeg.from.number;
                customLegInformation.callId = callLeg.callId;
                customLegInformation.validationErrors = [this.state.errorMessage];
                customLegInformation.bxml = "No bxml Response";
                eachCallLeg.push(customLegInformation);
            }
            else {
                for (let j in validationResults) {
                    const callbackEvent = validationResults[j];
                    let customLegInformation = {};
                    customLegInformation.success = callbackEvent.valid;
                    customLegInformation.eventType = callbackEvent.callback.event.eventType;
                    customLegInformation.direction =  callbackEvent.callback.event.direction;
                    customLegInformation.to = callbackEvent.callback.event.to;
                    customLegInformation.from = callbackEvent.callback.event.from;
                    customLegInformation.callId = callbackEvent.callback.event.callId;
                    customLegInformation.validationErrors = this.getErrorMessage(callbackEvent.validationErrors);
                    customLegInformation.startedAt = callLeg.startedAt;
                    customLegInformation.executionId = callLeg.executionId;
                    customLegInformation.bxml =callbackEvent.bxml;
                    eachCallLeg.push(customLegInformation);
                }
            }
            allCallLegs.push(eachCallLeg);
        }
        this.setState({allCallLegs: allCallLegs});
    }

    retrieveInfo = async ()=>{
        if (!this.props.exeid) {
            this.setState({nodata: 0});
            return;
        }
        const content = this.props.cellData;
        this.setState({
                            value: content.successful,
                            callLegs: content.callLegs,
                            errorMessage: content.errorMessage,
                            complete: content.completed
        });
        this.setAllCallLegs(content.callLegs);
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
        if (!this.state.complete){
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

        if (this.props.exeid === ""){
            pass_fail_load ="nodata";
        }

        let title = "Execution ID: "+this.props.exeid;
        const toggle = () => this.setState({ show: !this.state.show });
        return (
            <td >
                <div>
                    <button className={pass_fail_load} onClick={toggle}></button>
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
                                <H2 className="modalHeading">Call Legs</H2>
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
export default DashboardCellEntry;
