import React, { useEffect, useState } from 'react';
import './Scenario.css';
import IconDisplay from './constants';
import TableRow from './TableRow';
import ImageList from "./ImageList";
import { Table } from 'reactstrap';
import Routes from "../Routes.js";
import {Logo, Header, Navigation, Link, Label, HeaderBar} from '@bandwidth/shared-components';

class Scenario extends React.Component {
    state= {row: [], nestedkeys: [0, 1], col : [], rowid: [], user:"", password: ""}

    async componentDidMount() {
        // console.log(this.props.location.data[1]);
        //  this.setState({user: this.props.location.data[0]});
        //  console.log(this.state.user);
        // this.setState({password:this.props.location.data[1]});
        var u =localStorage.getItem("user");
        var p = localStorage.getItem("pass");
        //var p = this.props.location.data[1];

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        //const proxyurl = "https://cors-anywhere.herokuapp.com/";
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Credentials', 'true');

        headers.append('GET', 'POST', 'OPTIONS');
        headers.set('Authorization', 'Basic ' + Buffer.from(u + ":" + p).toString('base64'));

        //console.log("before fetching");
        const response = await fetch('http://localhost:8091/scenarios', {method:'GET', headers: headers});
        //console.log("here");
        const body =  await response.json();
        //console.log(body);
        //console.log(" Iam here");
        // //console.log(Object.keys(body[["gather-85506632-a4b5-4455-a772-2e9ad1f871bc"]]));
        //console.log(JSON.stringify(body, null, 1));
        const rows = JSON.stringify(body, null, 1);

        let temp = [];

        Object.values(body).map((key) => (

           temp.push(key["id"])
        ));
        //console.log(temp);
        this.setState({row: temp});
        //this.setState({rowid: temp});

        // this.setState({nestedkeys:Object.keys(body[["gather-85506632-a4b5-4455-a772-2e9ad1f871bc"]])});
        //call another function to get the result of api+key(gather) to return t/f

        //console.log(Object.keys(Object.values(this.state.users)));
        //this.setState({nest: Object.body.values()});
        const temp2 = [];
        const exeIds= []

        for (let i in temp) {
            const temp3 = [];
            const exeAndIds =[];
            //console.log(temp[i]);
            const url = 'http://localhost:8091/scenarios/' + temp[i] + '/executions';
            temp3.push(temp[i]);
            exeAndIds.push(temp[i]);
            const response2 = await fetch(url, {method: 'GET', headers: headers});
            const body2 = await response2.json();
            for (let i = 0; i < 20; i++) {
                const obj = body2[i];
                //console.log(obj["successful"].toString());
                temp3.push(obj["successful"]);
                exeAndIds.push(obj["id"]);
                // this.setState({res: res.push(obj["successful"])});

            }
            //console.log(temp2);
            temp2.push(temp3);
            exeIds.push(exeAndIds);

        }
        //console.log(temp2);
        this.setState({col: temp2});
        this.setState({rowid: exeIds});
        this.setState({user: this.props.location.data[0], password: this.props.location.data[1]});

        //console.log(this.state.col);
        console.log(this.state.user);
        console.log(this.state.password);


    }


    componentDidUpdate(){
        console.log("moy composnet just updated - rerendered");
    }
    renderContent(){

        //have value in row and columns already
        for (let i in this.state.col){

            //console.log(this.state.col[i]);
            <IconDisplay torf={this.state.col[i]}  />
        }

        return <IconDisplay torf={this.state.col}  />



    }
    goto(){

        console.log("blahhhh");
        // var path= "./scenario"+scenario;
        // this.props.history.push({pathname:path})   ;
    }

    render() {
        const user  =this.state.user;
        const pass = this.state.password;
        //var func = this.goto();
        console.log(localStorage.getItem("user"));
        return (
            <div>
                <div style={{ padding: '0px' , backgroundColor: '#002a6fe0'}}>
                    {/*<Navigation>*/}
                    {/*    <Link.Wrap to="/">*/}
                    {/*        <Navigation.Title>Bandwidth Censer</Navigation.Title>*/}
                    {/*    </Link.Wrap>*/}

                    {/*</Navigation>*/}

                </div>


            <Table style={{backgroundColor:"#cce6ff",color:"#0059b3"}}>
                <thead>
                <tr >
                    <th>Scenarios</th>
                    <th class="text-center">1</th>
                    <th class="text-center">2</th>
                    <th class="text-center">3</th>
                    <th class="text-center">4</th>
                    <th class="text-center">5</th>
                    <th class="text-center">6</th>
                    <th class="text-center">7</th>
                    <th class="text-center">8</th>
                    <th class="text-center">9</th>
                    <th class="text-center">10</th>
                    <th className="text-center">11</th>
                    <th className="text-center">12</th>
                    <th className="text-center">13</th>
                    <th className="text-center">14</th>
                    <th className="text-center">15</th>
                    <th className="text-center">16</th>
                    <th className="text-center">17</th>
                    <th className="text-center">18</th>
                    <th className="text-center">19</th>
                    <th className="text-center">20</th>

                </tr>
                </thead>
                <tbody>

                {this.state.rowid.map(function(item){
                    //console.log(item[0]);
                    //console.log("http://192.168.113.58:2080/scenarios/"+item[0]);
                    const x = "http://localhost:8091/scenarios/"+item[0];
                    console.log(x);
                    console.log(user);
                    console.log(pass);
                    const page = "http://localhost:3000/"+item[0];
                    return(
                    <tr>
                        <th><Link to={page}>{item[0].toUpperCase()}</Link></th>
                        <TableRow link={x} username={user} password={pass} exeid={item[1]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[2]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[3]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[4]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[5]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[6]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[7]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[8]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[9]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[10]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[11]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[12]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[13]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[14]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[15]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[16]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[17]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[18]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[19]}/>
                        <TableRow link={x} username={user} password={pass} exeid={item[20]}/>


                    </tr>)
                })
                }


                </tbody>
            </Table>
            </div>
        );
    }


    //
    // render() {
    //         //this.getResponse();
    //
    //     // const res = []
    //     // for (let i in this.state.row){
    //     //     console.log(this.state.row[i]);
    //     //     console.log("sfhgnj");
    //     //     console.log(this.state.col[i]);
    //     //     const str = this.state.row[i] +"   "+this.state.col[i];
    //     //     console.log(str);
    //     //
    //     //     res.push(str);
    //     //
    //     // }
    //     //
    //     // const coins = (res).map((key) => (
    //     //
    //     //     <div className="container">
    //     //         <span className="left">{key}</span>
    //     //         {this.state.col[key]}
    //     //     </div>
    //     //
    //     // ));
    //     // const res = Object.keys(this.state.users).map((key) => (
    //     //
    //     //     <div className="container">
    //     //         <span className="left">{key}</span>
    //     //     </div>
    //     // ));
    //     //Object.keys(this.state.users).map((key) => (this.getContent({key})));
    //     return (
    //         //
    //         // <div className="table">
    //         //     {coins}
    //         // </div>
    //         <div className="border red">
    //             <ImageList images={this.state.col}/>
    //             {/*//{this.renderContent()}*/}
    //         </div>
    //     );
    //
    //
    //
    // }
};

export default Scenario;


