import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import Scenario from "./Scenario.css"

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    gotoScenario = event =>{
        console.log(this.state.email);


        localStorage.clear();
        localStorage.setItem("user", this.state.email);
        console.log(localStorage.getItem("pass"));
        localStorage.setItem("pass", this.state.password);

        if (this.state.email== "test"){
            if (this.state.password =="test"){
                // let path = "./Scenario";
                // this.props.history.push(path);
                // localStorage.setItem("user", this.state.email);
                // localStorage.setItem("pass", this.state.password);
                this.props.history.push({pathname:"./Scenario", data: [this.state.email, this.state.password]});


            }
        }




    }

    render() {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        onClick={this.gotoScenario}
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }
}
