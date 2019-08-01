import React, { Component } from "react";
import {Navigation, Link} from '@bandwidth/shared-components';
import "./App.css";
import Routes from "./Routes";

class App extends Component {
    render() {
        return (
            <div>
                <Navigation>
                    <Link.Wrap to="/">
                        <Navigation.Title >Bandwidth Censer</Navigation.Title>
                    </Link.Wrap>
                    <Navigation.ItemListStack>
                        <Navigation.ItemList>
                        <Link.Wrap to="/login">
                            <Navigation.Item>Login</Navigation.Item>
                        </Link.Wrap>
                        </Navigation.ItemList>
                        <Navigation.ItemList>
                        <Link.Wrap to="/callScenarios">
                            <Navigation.Item>Scenario</Navigation.Item>
                        </Link.Wrap>
                        </Navigation.ItemList>
                    </Navigation.ItemListStack>
                </Navigation>
                <Routes />
            </div>
        );
    }
}
export default App;
