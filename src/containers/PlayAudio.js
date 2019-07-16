import React, { useEffect, useState } from 'react';
import  {Component} from 'react';
import {Table} from "reactstrap";
import './Gather.css';
import TableData from "./TableData";
class PlayAudio extends Component {
    state= {tableHeader: [], exeInfo:[], allrows: []}

    countofHeaders(){
        var count = 0;
        for (let i in this.state.tableHeader){
            var list = this.state.tableHeader[i];
            for (let j in list){
                count+=1;
            }
        }
        return count;

    }
    hasproblem(validationErrors){
        var prob  =false;
        if (validationErrors == null){
            return prob;
        }

        for (let i in validationErrors){
            var eacherror = validationErrors[i];
            if (eacherror.includes("Unexpected callback")){
                prob = true;
                return prob;
            }
        }
        return prob;

    }

    async componentDidMount() {
        var u = localStorage.getItem("user");
        var p = localStorage.getItem("pass");

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Credentials', 'true');

        headers.append('GET', 'POST', 'OPTIONS');
        headers.set('Authorization', 'Basic ' + Buffer.from(u + ":" + p).toString('base64'));

        //console.log("before fetching");
        const response = await fetch('http://localhost:8091/scenarios/playAudio/executions', {
            method: 'GET',
            headers: headers
        });
        const body = await response.json();

        for (let i in body) {
            const obj = body[i];
            if (obj["successful"] || obj["completed"]) {
                let callLegs = obj["callLegs"];
                let calllegCount = obj["callLegs"].length;
                let alllegheader = [];
                let headcount = 0;
                let jsoncallLegs = [];
                for (let callIndex in callLegs) {
                    //callIndex tells which number of callLeg we are in (there can be more than 2 CallLegs)
                    var count = callIndex;

                    let legheader = [];
                    let eachcallleg = callLegs[callIndex];
                    let validationResults = eachcallleg["validationResults"];
                    let callDirection = eachcallleg["callDirection"];
                    let validationcount = validationResults.length;
                    let directionEvents = [];
                    for (let eventIndex in validationResults) {
                        let jsonevent = {}
                        const event = validationResults[eventIndex];
                        headcount += 1;
                        let eventName = event["callback"]["event"]["eventType"];
                        var validationErrors = event["validationErrors"];
                        if (validationErrors != null && this.hasproblem(validationErrors)){

                            console.log("problem");
                        }
                        else {
                            legheader.push(eventName);
                        }


                    }
                    jsoncallLegs.push(directionEvents);
                    //console.log(jsoncallLegs);
                    alllegheader.push(legheader);
                    //console.log(alllegheader);
                    if (headcount > this.countofHeaders()) {
                        this.setState({tableHeader: alllegheader})
                    }
                    //console.log(this.state.tableHeader);
                }
            }
        }
        console.log(this.state.tableHeader);
        var maininfo = []
        for (let i in body) {
            const obj = body[i];
            let exeInfo = {};
            if (obj["successful"] || obj["completed"]) {
                let callLegs = obj["callLegs"];
                exeInfo.num = i;
                exeInfo.id = obj["id"];
                exeInfo.completed = obj["completed"];
                exeInfo.startedAt = obj["startedAt"];
                exeInfo.errorMessage = obj["errorMessage"];
                let headcount = 0;
                let jsoncallLegs = [];
                //console.log("Blahrthyrthy");
                var numlegs = this.state.tableHeader.length;
                for (let callIndex in Array.from(Array(numlegs).keys())) {
                    // console.log(callIndex);
                    var columns = this.state.tableHeader[callIndex];
                    let eachcallleg = callLegs[callIndex];
                    let validationResults = eachcallleg["validationResults"];
                    var jsonevents = []
                    for (let events in columns) {
                        var jsonevent = {};
                        var event = columns[events];
                        if (validationResults[events] != null) {
                            var callEvent = validationResults[events];
                            //console.log(callEvent);
                            var eventType = callEvent["callback"]["event"]["eventType"];
                            var valid = callEvent["valid"];

                            var validationErrors = callEvent["validationErrors"];
                            //console.log(validationErrors);
                            if (validationErrors != null && this.hasproblem(validationErrors)){

                                exeInfo.prob = "Y";

                            }
                            else {
                                jsonevent.event = eventType;
                                jsonevent.valid = valid;
                                // console.log(jsonevent);
                            }

                        } else {
                            jsonevent.event = "empty";
                            jsonevent.valid = "false";
                            // console.log(jsonevent);

                        }
                        jsonevents.push(jsonevent);
                        //console.log(jsonevents);

                    }
                    jsoncallLegs.push(jsonevents);

                    //callIndex tells which number of callLeg we are in (there can be more than 2 CallLegs)


                }
                exeInfo.callLegs = jsoncallLegs;
                if (exeInfo.prob == undefined){
                    exeInfo.prob = "N";
                }
                //console.log(exeInfo);
                maininfo.push(exeInfo);


            }
        }
        //console.log(maininfo);
        this.setState({exeInfo: maininfo});
    }


    render() {
        //console.log("moy composnet just updated - rerendered");
        let legs = [];
        for (let i in this.state.tableHeader){
            legs.push(i);
        }
        const headers = this.state.tableHeader;

        return (

            <Table style={{backgroundColor:"#cce6ff",color:"#0059b3"}}>
                <thead>
                <tr >
                    <th className="text-center">Execution</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Unexpected Callback</th>


                    {legs.map(function(item){
                        return (
                            <th className="text-center" colSpan={headers[item].length.toString()}>{"Call Leg"+item}
                                <table style={{width:"100%"}}>
                                    {headers[item].map(function(head){
                                        return (<th className="text-center" style={{ width: 400 }}>{head}</th>)
                                    })}
                                </table>
                            </th>)})
                    }
                </tr>
                </thead>
                <tbody>

                {this.state.exeInfo.map(function(execution){
                    var count  = 0;
                    return (

                        <tr>
                            {/*<td>{execution["num"]}</td>*/}

                            <TableData link={"http://localhost:8091/scenarios/playAudio"} exeid={execution["id"]} icon={execution["id"]}/>
                            <td>{execution["startedAt"]}</td>
                            <td className={execution['prob']}>{execution["prob"]}</td>

                            {legs.reduce((allColumns, index) => {
                                const allevents = execution['callLegs'][index];
                                //console.log(allevents);

                                return  [

                                    ...allColumns,
                                    ...headers[index].reduce((headerColumns, head) => {
                                        //console.log(head);
                                        var gotit = 0;
                                        count = 0;

                                        return [

                                            ...headerColumns,
                                            ...allevents.map((event) => {
                                                //console.log(event);
                                                count += 1;
                                                //console.log(count);
                                                if (event.event === head) {


                                                    gotit = 1;
                                                    return <td className={event.valid.toString()}>{event.valid.toString()}</td>;
                                                }
                                                if (headers[index].length === count && gotit ===0){
                                                    count =0;
                                                    return <td >missing</td>
                                                }

                                            })
                                        ];

                                    }, [])

                                ];
                            }, [])}

                        </tr>
                    );}

                )}

                </tbody>
            </Table>
        );
    }


}

export default PlayAudio;


