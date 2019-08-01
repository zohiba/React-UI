import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import DashboardHomeScenario from "./containers/DashboardScenario";

import Page from "./containers/Page";

export default () =>
    <Switch>
        <Route path="/" exact component={Home}  />
        <Route path="/login" exact component={Login} />
        <Route path="/callScenarios" exact component={DashboardHomeScenario} />
        <Route path="/callScenarios/:Type" component={Page}/>
        { /* Finally, catch all unmatched routes */ }
        <Route component={NotFound} />
    </Switch>;

