import React, { useEffect, useState } from 'react';
import  {Component} from 'react';
//import {Table} from "reactstrap";
import {Table} from '@bandwidth/shared-components';
import './Gather.css';
import TableData from "./TableData";
import IndividualScenario from "./IndividualScenario";
import Individual from "./IndiScenTemp"
class Gather extends Component {

    render() {

        return (
            <Individual scenario="gather"/>

        );
    }


}

export default Gather;


