import React from 'react';
import './Scenario.css';
import TableRow from './TableRow';

import { Table } from 'reactstrap';
import {Link} from '@bandwidth/shared-components';

class Scenario extends React.Component {
    state= {row: [], nestedkeys: [0, 1], col : [], rowid: [], user:"", password: ""}

    async componentDidMount() {

        var u =localStorage.getItem("user");
        var p = localStorage.getItem("pass");

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Credentials', 'true');

        headers.append('GET', 'POST', 'OPTIONS');
        headers.set('Authorization', 'Basic ' + Buffer.from(u + ":" + p).toString('base64'));

        const response = await fetch('http://localhost:8091/scenarios', {method:'GET', headers: headers});
        const body =  await response.json();

        const rows = JSON.stringify(body, null, 1);

        let temp = [];

        Object.values(body).map((key) => (

           temp.push(key["id"])
        ));

        this.setState({row: temp});

        const temp2 = [];
        const exeIds= []

        for (let i in temp) {
            const temp3 = [];
            const exeAndIds =[];
            const url = 'http://localhost:8091/scenarios/' + temp[i] + '/executions';
            temp3.push(temp[i]);
            exeAndIds.push(temp[i]);
            const response2 = await fetch(url, {method: 'GET', headers: headers});
            const body2 = await response2.json();
            for (let i = 0; i < 20; i++) {
                const obj = body2[i];
                temp3.push(obj["successful"]);
                exeAndIds.push(obj["id"]);

            }
            temp2.push(temp3);
            exeIds.push(exeAndIds);

        }
        this.setState({col: temp2});
        this.setState({rowid: exeIds});

    }


    componentDidUpdate(){
        console.log("moy composnet just updated - rerendered");
    }
    renderContent(){

        //have value in row and columns already

    }


    render() {

        return (
            <div style={{padding:"30px"}}>
                <div style={{ padding: '0px' , backgroundColor: '#002a6fe0'}}>

                </div>
                <p><b>List of test Scenarios</b></p>

            <Table style={{backgroundColor:"E0F7FD",color:"#0059b3"}}>
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
                    const x = "http://localhost:8091/scenarios/"+item[0];

                    const page = "http://localhost:3000/"+item[0];
                    return(
                    <tr>
                        <th><Link to={page}>{item[0].toUpperCase()}</Link></th>
                        <TableRow link={x}  exeid={item[1]}/>
                        <TableRow link={x}  exeid={item[2]}/>
                        <TableRow link={x}  exeid={item[3]}/>
                        <TableRow link={x}  exeid={item[4]}/>
                        <TableRow link={x}  exeid={item[5]}/>
                        <TableRow link={x}  exeid={item[6]}/>
                        <TableRow link={x}  exeid={item[7]}/>
                        <TableRow link={x}  exeid={item[8]}/>
                        <TableRow link={x}  exeid={item[9]}/>
                        <TableRow link={x}  exeid={item[10]}/>
                        <TableRow link={x}  exeid={item[11]}/>
                        <TableRow link={x}  exeid={item[12]}/>
                        <TableRow link={x}  exeid={item[13]}/>
                        <TableRow link={x}  exeid={item[14]}/>
                        <TableRow link={x}  exeid={item[15]}/>
                        <TableRow link={x}  exeid={item[16]}/>
                        <TableRow link={x}  exeid={item[17]}/>
                        <TableRow link={x}  exeid={item[18]}/>
                        <TableRow link={x}  exeid={item[19]}/>
                        <TableRow link={x}  exeid={item[20]}/>

                    </tr>)
                })
                }
                </tbody>
            </Table>
            </div>
        );
    }


};

export default Scenario;


