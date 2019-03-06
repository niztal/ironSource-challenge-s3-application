import React, { Component } from 'react';
import axios from 'axios';

class Delete extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleFileQueryChange = this.handleFileQueryChange.bind(this);
        this.handleAccessTokenChange = this.handleAccessTokenChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getDeleteMessage = this.getDeleteMessage.bind(this);
    }

    handleFileQueryChange(event) {
        this.setState({fileQuery: event.target.value});
    }

    handleAccessTokenChange(event) {
        this.setState({accessToken: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();        
        const {token} = this.props;
        const {fileQuery, accessToken} = this.state;

        const headers = {'Authorization': `Bearer ${token}`};
        const data = !accessToken ? {fileName: fileQuery} : {access_token: accessToken};
        const url = 'http://localhost:5000/delete';
        axios.delete(!accessToken ? url : `${url}/${fileQuery}`, {headers, data})
        .then(() => {
            this.setState({isValid: true, error: ''});
        })
        .catch((error) => {
            const message = error.response.data? error.response.data.message : "error in delete file!";
            this.setState({isValid: false, error: message});
        });
    }

    getDeleteMessage() {
        const message = this.state.isValid ? 'file deleted successfully' : this.state.error;
        return message;
    }

    render() {
        const message = this.getDeleteMessage();
        const disabled = this.props.token ? false: true;
        return(
            <div>
                <form onSubmit={this.handleSubmit} >
                    <label>
                        File Name/Id:
                        <input type="text" value={this.state.fileQuery} onChange={this.handleFileQueryChange} />
                    </label>
                    <br/>
                    <label>
                        Access Token:
                        <input type="text" value={this.state.accessToken} onChange={this.handleAccessTokenChange} />
                    </label>
                    <br/>
                    <button type="submit" disabled={disabled}>Delete</button>
                </form>
                <p>{message}</p>
            </div>
        )
    }
}

export default Delete;