import React, { Component } from "react";
import Tile from "../tile/tile";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
class Home extends Component {
  state = { total: { crypto: 0, p2p: 0 }, gain: { crypto: 0, p2p: 0 }, delta: { crypto: 0, p2p: 0 }, timestamp: new Date() };

  render() {
    return (
      <div className="bg-white shadow-md rounded my-0">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Home</div>
        </div>
        <div className="max-w-full mx-4 py-0 sm:mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-wrap space-x-2 items-center">
            <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black"></p>
            <div className="relative w-auto pl-1 flex-initial p-1 ">
              <DatePicker dateFormat="dd.MM.yyyy" className="px-6 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full" selected={this.state.timestamp} onChange={(date) => this.setTimestamp(date)} />
            </div>
          </div>
          <h2 className="font-bold text-2xl">Current portfolio</h2>
          <div className="sm:flex sm:space-x-4">
            <Tile total={92.73} title="PeerBerry" showIndicator="true" yield={this.state.gain.p2p} pricegain={0} totalprofit={this.state.gain.p2p}></Tile>
            <Tile total={69.25} title="Bondster" showIndicator="false" yield={this.state.gain.crypto} pricegain={0} totalprofit={this.state.gain.crypto}></Tile>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
