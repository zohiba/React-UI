import React from 'react';
import  {Component} from 'react';
import './IndividualScenario.css';
import Individual from "./IndividualScenario";

class Page extends Component {

    render() {
        return (
            <Individual scenario={this.props.match.params.Type}/>
        );
    }
}
export default Page;


