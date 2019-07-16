
import React, {Component} from 'react';
import Popup from "reactjs-popup";
import NestedAccordian from './NestedAccordian';
import { Button } from '@bandwidth/shared-components';
class TableRow extends Component {
    constructor (props) {
        super(props);
        this.state = {callLegs : "", errorInfo: "", inboundErrorInfo: "", outboundErrorInfo: "",
            value: "", inbound:"", outbound: "", inboundValidationSet: "", outboundValidationSet: "",
        allCallLegs: "",
        errorMessage: "",
        completed: ""};

    }
    parser(error){

        var new_error = "";

        if (error == null){
            return ["no error"];
        }
        //
        // for (let i in error){
        //     //error[i].replaceAll("\\n",",");
        //     console.log(error[i]);
        //     new_error += error[i]+" ";
        // }
        // //
        // // for (let i in new_error){
        // //     console.log(new_error[i]);
        // // }
        // var new_errors =new_error.replace(/\r?\n/g, " ");//new_error.replace(/\\n/g, "Hello")
        // console.log(new_errors);
        return error;

    }

    async componentDidMount() {
        console.log(this.props);
        const url = this.props.link+"/executions/"+this.props.exeid;
        console.log(url);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //const proxyurl = "https://cors-anywhere.herokuapp.com/";
        headers.append('Access-Control-Allow-Origin', 'http://localhost:33215');
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
        for (let i in this.state.callLegs){
            var eachcallleg = [];
            const temp = this.state.callLegs[i];
            const validationResults = temp["validationResults"];
            if (validationResults.length ==0){
                console.log("ValidationResults is empty");
                var color = '#A9A9A9';
                if (temp["completed"]) {
                    color = '#cff5ce';
                } else {
                    color = '#e8bdbd';//'#d89090';//'#ffb3b3';//'#f1c4b5';
                }

                var jsonObject = {};
                jsonObject.success = temp["completed"];
                jsonObject.startedAt = temp["startedAt"];
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
                    eachcallleg.push(jsonObject);

                }
            }
            allcalllegs.push(eachcallleg);


        }

        this.setState({allCallLegs: allcalllegs});

        console.log(this.state.allCallLegs);





    }

    // showpopup(value){
    //
    //     //console.log(this.props);
    //     //console.log(value);
    //     return (<Popup  trigger={<button> Trigger</button>} position="right center">
    //         <div>Popup content here !!</div>
    //     </Popup>);
    // }




    render () {
        //console.log(this.state.errorInfo);
        //console.log(JSON.stringify(this.state.errorInfo, null, 1));
        var icon;
        if (this.state.value) {
            icon ="✔" }
        else{
            icon = "✖";
        }
        var pass_fail_load;
        console.log(this.state.complete);
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
        return (
            <td class="text-center">
            <Popup
                trigger={<button className={pass_fail_load} style={{width:60}}> {icon} </button>}
                modal
                closeOnDocumentClick
            >
                {close =>(
                    <div>
                        <a className="close" onClick={close}>
                        &times;
                        </a>
                        <NestedAccordian info={this.state.allCallLegs}></NestedAccordian>

                    </div>
                    )}
            </Popup>
            </td>

            //<td value={this.state.errorInfo} onClick={() => this.showpopup(this.state.errorInfo)}>{this.state.value.toString()} </td>
        );
    }
}

export default TableRow;
