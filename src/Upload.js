import React, { Component } from 'react';
import axios from 'axios';

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {isPrivate: false};
        this.handleIsPrivateChange = this.handleIsPrivateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getFileUploadData = this.getFileUploadData.bind(this);
        this.fileInput = React.createRef();
    }

    handleIsPrivateChange(event) {
        const isPrivate = event.target.checked;
        this.setState({isPrivate});
    }

    handleSubmit(event) {
        event.preventDefault();        
        const {token} = this.props;
        const formData = new FormData();
        formData.append('file', this.fileInput.current.files[0])
        formData.append('isPrivate', this.state.isPrivate);
        const headers =  {
                'Authorization': `Bearer ${token}`,
                'content-type': 'multipart/form-data'
        }
        axios.post('http://localhost:5000/upload', formData, {headers})
        .then((response) => {
            const {id, name, access_token} = response.data[0];
            this.setState({isValid: true, id, name, access_token, error: ''});
        })
        .catch((error) => {
            const message = error.response.data? error.response.data.message : "error in update file!";
            this.setState({isValid: false, error: message});
        });
    }

    getFileUploadData() {
        const {id, name, access_token, isValid} = this.state;
        if (isValid) {
            return (
                <div>
                    <h4>File uploaded successfully!</h4>

                    File details:
                    
                    <p>file Id: {id}</p>
                    <p>file name: {name}</p>
                    <p>access_token: {access_token ? access_token : ''}</p>
                </div>
            )
        }
    }

    render() {
        const fileUploadData = this.getFileUploadData();
        const disabled = this.props.token ? false: true;
        return(
            <div>
                <form onSubmit={this.handleSubmit} >
                    <label>
                        Upload file:
                        <input type="file" ref={this.fileInput} />
                    </label>
                    <button type="submit" disabled={disabled}>Upload</button>
                    <p>
                        <label>
                        Private:
                        <input type="checkbox" checked={this.state.isPrivate} onChange={this.handleIsPrivateChange} />                    
                        </label>
                    </p>
                </form>
                {fileUploadData}
            </div>
    )};
}

export default Upload;