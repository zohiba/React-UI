
import React, {Component} from 'react';
import Popup from "reactjs-popup";
import NestedAccordian from './NestedAccordian';
import { Modal, Horizontal, toggle, Button, H2, Link } from '@bandwidth/shared-components';
class TableRow extends Component {
    constructor (props) {
        super(props);
        this.state = {callLegs : "", errorInfo: "", inboundErrorInfo: "", outboundErrorInfo: "",
            value: "", inbound:"", outbound: "", inboundValidationSet: "", outboundValidationSet: "",
        allCallLegs: "",
        errorMessage: "",
        completed: "",
        exeId: ""};

    }
    parser(error){

        if (error == null){
            return ["no error"];
        }
        return error;

    }

    retrieveInfo = async ()=>{
        const url = this.props.link+"/executions/"+this.props.exeid;
        //console.log(url);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('GET', 'POST', 'OPTIONS');
        var u = localStorage.getItem("user");
        var p = localStorage.getItem("pass");
        headers.set('Authorization', 'Basic ' + Buffer.from(u + ":" + p).toString('base64'));

        const response = await fetch(url, {method:'GET', headers: headers});
        const content = await response.json();
        //console.log(content);
        //console.log(content["completed"]);
        this.setState({value:content["successful"]});
        this.setState({callLegs: content["callLegs"]});
        //console.log(this.state.callLegs);
        // there are 2 call legs, Inbound, Outbound
        for (let i in this.state.callLegs){
            const temp = this.state.callLegs[i];
            if (temp["callDirection"]== "outbound"){
                this.setState({outbound: temp});
            }
            else{
                this.setState({inbound:temp});
            }
        }

        this.setState({errorMessage: content["errorMessage"]});
        this.setState({complete: content["completed"]});

        //there can actually be multiple callLegs in, out, out , in, out  etc

        var allcalllegs = [];
        var id = "";
        for (let i in this.state.callLegs){
            var eachcallleg = [];
            const temp = this.state.callLegs[i];
            const validationResults = temp["validationResults"];
            id = temp["executionId"];
            //console.log(temp);
            if (validationResults.length ==0){
                //console.log("ValidationResults is empty");
                var color = '#A9A9A9';
                if (temp["completed"]) {
                    color = '#cff5ce';
                } else {
                    color = '#e8bdbd';//'#d89090';//'#ffb3b3';//'#f1c4b5';
                }

                var jsonObject = {};
                jsonObject.success = temp["completed"];
                jsonObject.startedAt = temp["startedAt"];
                jsonObject.executionId = temp["executionId"];

                jsonObject.eventType = "No Event Occured";
                jsonObject.direction =  temp["callDirection"];
                jsonObject.to = temp["to"]["number"];
                jsonObject.from = temp["from"]["number"];
                jsonObject.callId = temp["callId"];
                jsonObject.ValidationErrors = [this.state.errorMessage];  //parseErrors(validationErrors)
                jsonObject.color = color;
                eachcallleg.push(jsonObject);
            }
            else {

                for (let j in validationResults) {
                    const callback = validationResults[j];
                    const callbackEventType = callback["callback"]["event"]["eventType"];
                    const direction = callback["callback"]["event"]["direction"];
                    const to = callback["callback"]["event"]["to"];
                    const from = callback["callback"]["event"]["from"];
                    const callId = callback["callback"]["event"]["callId"];
                    const validationErrors = callback["validationErrors"];
                    var color = '#A9A9A9';
                    if (callback["valid"]) {
                        color = '#cff5ce';
                    } else {
                        color = '#e8bdbd';//'#d89090';//'#ffb3b3';//'#f1c4b5';
                    }

                    var jsonObject = {};
                    jsonObject.success = callback["valid"];
                    jsonObject.eventType = callbackEventType;
                    jsonObject.direction = direction;
                    jsonObject.to = to;
                    jsonObject.from = from;
                    jsonObject.callId = callId;
                    jsonObject.ValidationErrors = this.parser(validationErrors);  //parseErrors(validationErrors)
                    jsonObject.color = color;
                    jsonObject.startedAt = temp["startedAt"];
                    jsonObject.executionId = temp["executionId"];
                    eachcallleg.push(jsonObject);

                }
            }
            allcalllegs.push(eachcallleg);


        }


        this.setState({allCallLegs: allcalllegs});
        this.setState({exeId:id});


    }

    async componentDidMount() {
        //console.log(this.props);
        //this.retrieveInfo();
        const url = this.props.link+"/executions/"+this.props.exeid;
        //console.log(url);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Credentials', 'true');
        headers.append('GET', 'POST', 'OPTIONS');
        var u = localStorage.getItem("user");
        var p = localStorage.getItem("pass");
        headers.set('Authorization', 'Basic ' + Buffer.from(u + ":" + p).toString('base64'));

        const response = await fetch(url, {method:'GET', headers: headers});
        const content = await response.json();
        //console.log(content);
        //console.log(content["completed"]);
        this.setState({value:content["successful"]});
        this.setState({callLegs: content["callLegs"]});
        //console.log(this.state.callLegs);
        // there are 2 call legs, Inbound, Outbound
        for (let i in this.state.callLegs){
            const temp = this.state.callLegs[i];
            if (temp["callDirection"]== "outbound"){
                this.setState({outbound: temp});
            }
            else{
                this.setState({inbound:temp});
            }
        }

        this.setState({errorMessage: content["errorMessage"]});
        this.setState({complete: content["completed"]});

        //there can actually be multiple callLegs in, out, out , in, out  etc

        var allcalllegs = [];
        var id = "";
        for (let i in this.state.callLegs){
            var eachcallleg = [];
            const temp = this.state.callLegs[i];
            const validationResults = temp["validationResults"];
            id = temp["executionId"];
            //console.log(temp);
            if (validationResults.length ==0){
                //console.log("ValidationResults is empty");
                var color = '#A9A9A9';
                if (temp["completed"]) {
                    color = '#cff5ce';
                } else {
                    color = '#e8bdbd';//'#d89090';//'#ffb3b3';//'#f1c4b5';
                }

                var jsonObject = {};
                jsonObject.success = temp["completed"];
                jsonObject.startedAt = temp["startedAt"];
                jsonObject.executionId = temp["executionId"];

                jsonObject.eventType = "No Event Occured";
                jsonObject.direction =  temp["callDirection"];
                jsonObject.to = temp["to"]["number"];
                jsonObject.from = temp["from"]["number"];
                jsonObject.callId = temp["callId"];
                jsonObject.ValidationErrors = [this.state.errorMessage];  //parseErrors(validationErrors)
                jsonObject.color = color;
                jsonObject.bxml= "No bxml Response";
                eachcallleg.push(jsonObject);
            }
            else {

                for (let j in validationResults) {
                    const callback = validationResults[j];
                    const callbackEventType = callback["callback"]["event"]["eventType"];
                    const direction = callback["callback"]["event"]["direction"];
                    const to = callback["callback"]["event"]["to"];
                    const from = callback["callback"]["event"]["from"];
                    const callId = callback["callback"]["event"]["callId"];
                    const validationErrors = callback["validationErrors"];
                    const bxml = callback["bxml"];

                    var color = '#A9A9A9';
                    if (callback["valid"]) {
                        color = '#cff5ce';
                    } else {
                        color = '#e8bdbd';//'#d89090';//'#ffb3b3';//'#f1c4b5';
                    }

                    var jsonObject = {};
                    jsonObject.success = callback["valid"];
                    jsonObject.eventType = callbackEventType;
                    jsonObject.direction = direction;
                    jsonObject.to = to;
                    jsonObject.from = from;
                    jsonObject.callId = callId;
                    jsonObject.ValidationErrors = this.parser(validationErrors);  //parseErrors(validationErrors)
                    jsonObject.color = color;
                    jsonObject.startedAt = temp["startedAt"];
                    jsonObject.executionId = temp["executionId"];
                    jsonObject.bxml = bxml;
                    eachcallleg.push(jsonObject);

                }
            }
            allcalllegs.push(eachcallleg);


        }


        this.setState({allCallLegs: allcalllegs});
        this.setState({exeId:id});


    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.exeid == prevProps.exeid){
            console.log("same");
        }
        else{
            this.retrieveInfo();
        }

    }

    // componentDidUpdate() {
    //     //this.retrieveInfo();
    //     console.log("Intablerow componet did update called");
    //     //this.retrieveInfo();
    //
    //
    //
    // }



    render () {

        //var icon;
        // if (this.state.value) {
        //     icon ="✔" }
        // else{
        //     icon = "✖";
        // }
        var pass_fail_load;
        //console.log(this.state.complete);
        if (this.state.complete == false){
            pass_fail_load = "load";
        }
        else{
            if (this.state.value){
                pass_fail_load  = "pass";
            }
            else{
                pass_fail_load = "fail";
            }

        }


        var title = "Execution ID: "+this.state.exeId;

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
        {/*    <Popup*/}
        {/*        trigger={<button className={pass_fail_load} style={{width:60}}></button>}*/}
        {/*        <Modal*/}
        {/*        title="Comprehensive Modal"*/}
        {/*        actionContent={*/}
        {/*            <Horizontal spacing="md" style={{ alignItems: 'center'}}>*/}
        {/*                <Link icon="delete" onClick={toggle}>Cancel</Link>*/}
        {/*            </Horizontal>*/}
        {/*        }*/}
        {/*    >*/}
        {/*        <div style={{ fontSize: '14px' }}>*/}
        {/*            <H2>Modal Description</H2>*/}
        {/*            This modal displays the intended use case.*/}
        {/*            <br />*/}
        {/*            H2 should be the largest header used in a Modal.*/}
        {/*            <br />*/}
        {/*            There should be a maximum of 1 primary button, 1 secondary button*/}
        {/*            and one anchor link (for destructive items like cancel)*/}
        {/*        </div>*/}
        {/*    </Modal>*/}
        {/*        closeOnDocumentClick*/}
        {/*    >*/}
        {/*        {close =>(*/}
        {/*            <div>*/}
        {/*                <a className="close" onClick={close}>*/}
        {/*                &times;*/}
        {/*                </a>*/}
        {/*                <NestedAccordian info={this.state.allCallLegs}></NestedAccordian>*/}

        {/*            </div>*/}
        {/*            )}*/}
        {/*</Popup>*/}
            </td>

        );
    }
}

export default TableRow;
