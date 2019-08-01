import React from 'react';
import './DashboardScenario.css';
import { Table } from 'reactstrap';
import {Link} from '@bandwidth/shared-components';
import FetchRowInfo from "./FetchRowInfo";
import {getAuthHeader} from "./SetCredentials";

class DashboardHomeScenario extends React.Component {
    state= {rowIds:[], user:"", password:"", executions:20};

    retrieveData = async () =>{
        const response = await fetch('/scenarios', {method:'GET', headers: getAuthHeader()});
        const body =  await response.json();
        const ids = Object.values(body).map(key => key.id);
        this.setState({rowIds: ids});
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
        //this.state.executions is a number. The line below creates an array of numbers containing 0,1,2 ...this.state.executions-1
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
                        <th>Failure</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.rowIds.map(function(rowInfo){
                        const linkWithScenarioName = "/scenarios/"+rowInfo+"/executions";
                        const page = "callScenarios/"+rowInfo;
                        const time = new Date();
                        return(
                            <tr key={rowInfo}>
                                <th><Link to={page}>{rowInfo.toUpperCase()}</Link></th>
                                <FetchRowInfo link={linkWithScenarioName} time={time.getTime()}/>
                            </tr>)
                    })
                    }
                    </tbody>
                </Table>
            </div>
        );
    }
}
export default DashboardHomeScenario;


