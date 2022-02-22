import React, { Component } from "react";
import Tile from "../tile/tile";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const { ipcRenderer } = window.require("electron");

class Home extends Component {
  state = { accounts: [], timestamp: new Date() };

  componentDidMount() {
    ipcRenderer.removeAllListeners("list-accounts-reply");
    ipcRenderer.on("list-accounts-reply", (event, arg) => {
      this.setState({ accounts: arg, showNewAccountModal: false, showDeleteAccountModal: false });
    });

    ipcRenderer.send("list-accounts", "test");
  }

  render() {
    return (
      <div className="bg-white shadow-md rounded my-0">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Home</div>
        </div>
        <div className="max-w-full mx-4 py-0 sm:mx-auto sm:px-6 lg:px-8">
          <h2 className="pt-4 font-bold text-2xl">Current portfolio</h2>
          <div className="sm:flex sm:space-x-4">
            {this.state.accounts
              .sort(function (l, u) {
                return l.name > u.name ? 1 : -1;
              })
              .map((item) => (
                <Tile total={92.73} title={item.name} showIndicator="true" yield={0} pricegain={0} totalprofit={0}></Tile>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
