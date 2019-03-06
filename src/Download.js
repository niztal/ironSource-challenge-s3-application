import React, { Component } from 'react';
import axios from 'axios';

class Download extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleFileQueryChange = this.handleFileQueryChange.bind(this);
        this.handleAccessTokenChange = this.handleAccessTokenChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMetadata = this.handleMetadata.bind(this);
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
        const {fileQuery, accessToken, metadata} = this.state;

        const headers = {'Authorization': `Bearer ${token}`};
        const params = !accessToken ? {fileName: fileQuery} : {access_token: accessToken};
        if (metadata === true) {
            params.metadata = true;
        }
        const url = 'http://localhost:5000/download';
        axios.get(!accessToken ? url : `${url}/${fileQuery}`, {headers, params})
        .then((response) => {
            if(metadata) {
                const {name, size, createdAt, updatedAt, deletedAt} = response.data;
                this.setState({status:'metadata', name, size, createdAt, updatedAt, deletedAt});
            } else {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'unknown';
                if (contentDisposition) {
                    const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const match = fileNameRegex.exec(contentDisposition);
                    if (match && match[1]) {
                        fileName = match[1].replace(/['"]/g, '');
                    }
                }
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                this.setState({status: 'download'}); //reset metadata presentation view
            }
        })
        .catch((error) => {
            const message = error.response.data? error.response.data.message : "error in downloading file!";
            this.setState({error: message});
        });
    }

    handleMetadata(event) {
        const metadata = event.target.checked;
        this.setState({metadata});
    }

    getFileMetadata() {
        const {status, name, size, createdAt, updatedAt, deletedAt} = this.state;
        if (status === 'metadata') {
            return (
                <div>
                    File metadata:
                    
                    <p>file name: {name}</p>
                    <p>file size: {size} Bytes</p>
                    <p>file created at: {createdAt}</p>
                    <p>file update at: {updatedAt}</p>
                    <p>file deleted at: {deletedAt}</p>
                </div>
            )
        }
    }

    render() {
        const fileMetadata = this.getFileMetadata();
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
                    <label>
                        Get File Metadata:
                        <input type="checkbox" checked={this.state.metadata} onChange={this.handleMetadata} />
                    </label>
                    <br/>                 
                    <button type="submit" disabled={disabled}>Download</button>
                </form>
                {fileMetadata}
                <p>{error}</p>
            </div>
        )
    }
}

export default Download;