import React, { Component } from "react";
import "./App.css";
import AccountCreate from "./AccountCreate";
import Login from "./Login";
import UserComponent from "./UserComponent";

class App extends Component {
  state = {
    login: false,
    createAccount: true
  };

  togglelogin = componentName => {
    if (componentName === "createAccount") {
      this.setState({ login: true, createAccount: false });
    }
    if (componentName === "login") {
      this.setState({ login: false, createAccount: true });
    }
  };

  showMe = () => {
    this.setState({ me: true, login: false, createAccount: false });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header" />
        {this.state.login ? (
          <Login showMe={this.showMe} togglelogin={this.togglelogin} />
        ) : null}
        {this.state.createAccount ? (
          <AccountCreate togglelogin={this.togglelogin} />
        ) : null}
        {this.showMe ? <UserComponent /> : null}
      </div>
    );
  }
}

export default App;
