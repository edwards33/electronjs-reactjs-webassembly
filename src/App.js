import React, { Component } from "react";

const { ipcRenderer } = window.require("electron");

class App extends Component {
  state = {
    fib: 'test'
  };

  componentDidMount() {
    ipcRenderer.on("new:fib", (event, data) => {
      this.setState({ fib: data });
    });
  }

  render() {
    return (
        <p>Fibonacci(10) = {this.state.fib}</p>
    )
  }
}

export default App;
