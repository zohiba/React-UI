import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { BandwidthProvider } from '@bandwidth/shared-components';
import '@bandwidth/shared-components/fonts/fonts.css';
import App from './App';
import './index.css';
import Scenario from './containers/Scenario';

ReactDOM.render(
    <BandwidthProvider>
    <Router>
        <App />
    </Router>
    </BandwidthProvider>,
    document.getElementById("root")
);
