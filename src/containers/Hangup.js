// import React from 'react';
// import  {Component} from 'react';
// import IndividualScenario from "./IndividualScenario";
// import IndiScenTemp from "./IndiScenTemp"
// class Hangup extends Component {
//
//     render() {
//
//         return (
//             <IndiScenTemp scenario="hangup"/>
//
//         );
//     }
//
//
// }
//
// export default Hangup;

import React from 'react';
import  {Component} from 'react';
import Individual from "./IndiScenTemp";
class Hangup extends Component {

    render() {

        return (
            <Individual scenario="hangup"/>

        );
    }


}

export default Hangup;



