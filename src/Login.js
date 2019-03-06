import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({userId: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const {userId} = this.state;
        axios.post('http://localhost:5000/login', {userId: userId})
        .then((response) => {
            this.setState({error: ''});
            this.props.handleLogin(response.data.username, response.data.token)
        })
        .catch((error) => {
            this.setState({error: "unauthorized user"});
        });
    }

    render() {
        const {error} = this.state;
        return(
            <div>
                <form onSubmit={this.handleSubmit} >
                    <label>
                        UserId:
                        <input type="text" value={this.state.userId} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Login" />
                </form>
                <p>{error}</p>
            </div>
    )};
}

export default Login;