import React, { Component } from 'react';
import axios from 'axios';

class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleFileQueryChange = this.handleFileQueryChange.bind(this);
        this.handleAccessTokenChange = this.handleAccessTokenChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getFileUpdateData = this.getFileUpdateData.bind(this);
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
        const url = 'http://localhost:5000/update';
        axios.post(!accessToken ? url : `${url}/${fileQuery}`, data, {headers})
        .then((response) => {
            const {id, name, access_token, isPrivate} = response.data;
            this.setState({isValid: true, id, name, access_token, isPrivate, error: ''});
        })
        .catch((error) => {
            const message = error.response.data? error.response.data.message : "error in update file!";
            this.setState({isValid: false, error: message});
        });
    }

    getFileUpdateData() {
        const {id, name, access_token, isPrivate, isValid} = this.state;
        if (isValid) {
            return (
                <div>
                    <h4>File updated successfully!</h4>

                    File details:
                    
                    <p>file Id: {id}</p>
                    <p>file name: {name}</p>
                    <p>access token: {access_token ? access_token : ''}</p>
                    <p>private: {isPrivate ? 'true' : 'false'} </p>
                </div>
            )
        }
    }

    render() {
        const fileUpdateData = this.getFileUpdateData();
        const disabled = this.props.token ? false: true;
        const {error} = this.state;
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
                    <button type="submit" disabled={disabled}>Update</button>
                </form>
                {fileUpdateData}
                <p>{error}</p>
            </div>
        )
    }
}

export default Update;