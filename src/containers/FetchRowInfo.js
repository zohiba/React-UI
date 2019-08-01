import React from 'react';
import  {Component} from 'react';
import DashboardCellEntry from "./DashboardCellEntry";
import {getAuthHeader} from "./SetCredentials";
class FetchRowInfo extends Component {

    state= { executions:20, cellData:[], percentageFailed:0};

    getPercentageFailed(responseBody) {
        let count =0;
        let totalCount = 0;
        responseBody.forEach(function (execution) {
            if (execution.completed){
                count += execution.successful ? 0 : 1;
                totalCount += 1;
            }
        });
        const value = (count/totalCount)*100;
        return value.toFixed(3);
    }

    retrieveInfo= async()=> {
        const link = this.props.link;
        const response = await fetch(link, {method:'GET', headers: getAuthHeader()});
        const responseBody =  await response.json();
        let dataPoint = this.state.executions;
        let cellData = [];
        let percentageFailed = this.getPercentageFailed(responseBody);
        for (let i = 0; i < dataPoint; i++) {
            cellData.push(responseBody[i]);
        }
        this.setState({cellData:cellData, percentageFailed:percentageFailed});
    };

    componentDidMount(){
        this.retrieveInfo();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.time - prevProps.time)<25000){
            console.log("same");
        }
        else{
            this.retrieveInfo();
        }
        }

    render() {
        let columnCount = Array.from(Array(this.state.executions).keys());
        let linkWithScenarioName = this.props.link;
        let cellData = this.state.cellData;
        return (
            <React.Fragment >
                    {columnCount.map(function(index){
                        let cellInfo = cellData[index];
                        if (!cellInfo){
                            return (<DashboardCellEntry link={linkWithScenarioName} exeid={""} cellData={""}/>)
                        }
                        else {
                            return (
                                <DashboardCellEntry link={linkWithScenarioName} exeid={cellInfo.id} cellData={cellInfo}/>)
                        }
                    })}
                    <td>{this.state.percentageFailed}%</td>
            </React.Fragment>
        );
    }
}
export default FetchRowInfo;


