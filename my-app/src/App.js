import React, { Component } from "react";
import "./App.css";
import AccountCreate from "./AccountCreate";

class App extends Component {
  state = {
    login: false,
    createAccount: true,
  };

  togglelogin = (componentName) => {
    if (componentName === 'createAccount') {
      this.setState({ login: true, createAccount: false });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" />
        {this.state.login ? <div>Login</div> : null}
        {this.state.createAccount ? <AccountCreate togglelogin={this.togglelogin}/> : null}
      </div>
    );
  }
}

export default App;
