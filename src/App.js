import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { defaultCipherList } from "constants";

let defaultStyle = {
  color: "#fff"
}

const Aggregate = () => (
  <div style={{...defaultStyle, width: "40%", display: "inline-block"}}>
    <h2>Number Text</h2>
  </div>
);

const Filter = () => (
  <div>
    <input type="text"/>
    Filter
  </div>
)

const Playlist = () => (
  <div style={{width: "30%", display: "inline-block"}}>
    <img src="" alt=""/>
    <h3>Playlist Name</h3>
    <ul style={{listStyleType: "none", textAlign: "left"}}>
      <li>Song 1</li>
      <li>Song 2</li>
      <li>Song 3</li>
    </ul>
  </div>
)

class App extends Component {
  render() {
    return (
      <div className="App" style={defaultStyle}>
        <header className="App-header">
          <h1 style={{margin: 0, paddingTop: "2vh"}}>Title</h1>
        </header>
        <Aggregate/>
        <Aggregate/>
        <Filter/>
        <Playlist/>
        <Playlist/>
        <Playlist/>
      </div>
    );
  }
}

export default App;
