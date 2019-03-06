import React, { Component } from 'react';
import Login from './Login';
import Upload from './Upload';
import Download from './Download';
import Update from './Update';
import Delete from './Delete';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setLogin = this.setLogin.bind(this);
    this.getActiveComponent = this.getActiveComponent.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  setLogin() {
    this.setState({activeComponent: "login"});
  }

  getActiveComponent() {
    const {activeComponent} = this.state;
    switch (activeComponent) {
      case "login":
        return <Login handleLogin = {this.handleLogin} />;
      case "upload":
        return <Upload token = {this.state.token} />
      case "download":
        return <Download token = {this.state.token} />
      case "update":
        return <Update token = {this.state.token} />
      case "delete":
        return <Delete token = {this.state.token} />
      default:
        return <Login handleLogin = {this.handleLogin}/>;
    }
  }

  handleLogin(username, token) {
    this.setState({
      token,
      username
    });
  }

  render() {
    const activeComponent = this.getActiveComponent();
    const {username} = this.state;   
    return (
        <div className="App">
          <div>
            <h3>{`Welcome ${username ? username : 'guest'}`}</h3>
          </div>
          <hr/>
          <ul>
            <li>
              <a href="#" onClick={() => this.setState({activeComponent: "login"})}>Login</a>
            </li>
            <li>
              <a href="#" onClick={() => this.setState({activeComponent: "upload"})}>Upload</a>
            </li>
            <li>
              <a href="#" onClick={() => this.setState({activeComponent: "download"})}>Download</a>
            </li>
            <li>
              <a href="#" onClick={() => this.setState({activeComponent: "update"})}>Update</a>
            </li>
            <li>
              <a href="#" onClick={() => this.setState({activeComponent: "delete"})}>Delete</a>
            </li>
          </ul>
          <hr/>
          <div>
            {activeComponent}
          </div>

        </div>
    );
  }
}

export default App;
