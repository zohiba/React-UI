import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Scenario from "./containers/Scenario";
import Gather from "./containers/Gather";
import Hangup from "./containers/Hangup";
import PlayAudio from "./containers/PlayAudio";
import ForwardScenario from "./containers/ForwardScenario"


export default () =>
    <Switch>
        <Route path="/" exact component={Home}  />
        { /* Finally, catch all unmatched routes */ }
        <Route path="/login" exact component={Login} />
        <Route path="/scenario" exact component={Scenario} />
        <Route path="/gather" exact component={Gather} />
        <Route path="/playAudio" exact component={PlayAudio} />
        <Route path="/hangup" exact component={Hangup} />
        <Route path="/forwardBxml" exact component={ForwardScenario} />



        <Route component={NotFound} />

    </Switch>;
