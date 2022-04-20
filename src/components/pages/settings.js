import React, { Component } from "react";
import AccountModal from "../modals/accountmodal";
import DeleteAccountModal from "../modals/deleteaccountmodal";
import { v1 as uuidv1 } from "uuid";
import bondsterLogo from "../../assets/bondster.png";
import esketitLogo from "../../assets/esketit.ico";
import estateGuruLogo from "../../assets/estateguru.png";
import getIncomeLogo from "../../assets/getincome.ico";
import lendermarketLogo from "../../assets/lendermarket.png";
import lendsecuredLogo from "../../assets/lendsecured.png";
import peerBerryLogo from "../../assets/peerberry.png";
import solanaLogo from "../../assets/solana.png";
import atomLogo from "../../assets/atom.ico";
const { ipcRenderer } = window.require("electron");

class Settings extends Component {
  state = { selectedDeleteAccount: "", selectedAccountId: 0, isUpdate: false, showNewAccountModal: false, showDeleteAccountModal: false, accounts: [] };

  componentDidMount() {
    ipcRenderer.removeAllListeners("list-accounts-reply");
    ipcRenderer.on("list-accounts-reply", (event, arg) => {
      this.setState({ accounts: arg, showNewAccountModal: false, showDeleteAccountModal: false });
    });

    ipcRenderer.send("list-accounts", "test");
  }

  setShowDeleteAccountModal(show) {
    this.setState({ showDeleteAccountModal: show });
  }

  setShowNewAccountModal(show) {
    this.setState({ showNewAccountModal: show });
  }

  onClickCreateAccount() {
    this.setState({ isUpdate: false });
    this.setShowNewAccountModal(true);
  }

  onClickEditAccount(obj) {
    this.setState({ selectedAccount: obj, isUpdate: true });
    this.setShowNewAccountModal(true);
  }

  onClickDeleteAccount(name, id) {
    this.setState({ selectedDeleteAccount: name, selectedAccountId: id });
    this.setShowDeleteAccountModal(true);
  }

  onCreateNewAccount(name, type, user, password, description, address) {
    var obj = { id: uuidv1(), name: name, type: type, user: user, password: password, description: description, address: address };
    ipcRenderer.send("add-account", obj);
  }

  onUpdateAccount(id, name, user, password, description, address) {
    var obj = { id: id, name: name, user: user, password: password, description: description, address: address };
    ipcRenderer.send("update-account", obj);
  }

  onDeleteAccount(id) {
    ipcRenderer.send("delete-account", id);
  }

  getIconByAccountType(type) {
    switch (type) {
      case "GetIncome":
        return <img width="24" height="24" src={getIncomeLogo} alt="GetIncome" />;
      case "LendSecured":
        return <img width="24" height="24" src={lendsecuredLogo} alt="LendSecured" />;
      case "Lendermarket":
        return <img width="24" height="24" src={lendermarketLogo} alt="Lendermarket" />;
      case "PeerBerry":
        return <img width="24" height="24" src={peerBerryLogo} alt="PeerBerry" />;
      case "Bondster":
        return <img width="24" height="24" src={bondsterLogo} alt="Bondster" />;
      case "EstateGuru":
        return <img width="24" height="24" src={estateGuruLogo} alt="EstateGuru" />;
      case "Esketit":
        return <img width="24" height="24" src={esketitLogo} alt="Esketit" />;
      case "Solana":
        return <img width="24" height="24" src={solanaLogo} alt="Solana" />;
      case "ATOM":
        return <img width="24" height="24" src={atomLogo} alt="ATOM" />;
      default:
        return null;
    }
  }

  render() {
    return (
      <>
        <div className="mb-4 flex justify-between items-center mt-4">
          <div className="flex-1 pr-4"></div>
          <div>
            <div className="shadow rounded-lg flex mr-2">
              <button onClick={() => this.onClickCreateAccount()} type="button" className="rounded-lg inline-flex items-center bg-white hover:text-purple-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4">
                <svg className="w-5 h-5 ml-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden md:block ml-2">New account</span>
              </button>
            </div>
          </div>
        </div>
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-center">Type</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-center"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {this.state.accounts
              .sort(function (l, u) {
                return l.name > u.name ? 1 : -1;
              })
              .map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 items-center">
                    <div className="flex item-center justify-center">{this.getIconByAccountType(item.type)}</div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{item.description}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <div onClick={() => this.onClickEditAccount(item)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <div onClick={() => this.onClickDeleteAccount(item.name, item.id)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {this.state.showNewAccountModal ? (
          <AccountModal
            isUpdate={this.state.isUpdate}
            account={this.state.selectedAccount}
            onUpdateAccount={(id, name, user, password, description, address) => this.onUpdateAccount(id, name, user, password, description, address)}
            onCreateNewAccount={(name, type, user, password, description, address) => this.onCreateNewAccount(name, type, user, password, description, address)}
            setShowNewAccountModal={(show) => this.setShowNewAccountModal(show)}
          ></AccountModal>
        ) : null}
        {this.state.showDeleteAccountModal ? (
          <DeleteAccountModal accountId={this.state.selectedAccountId} name={this.state.selectedDeleteAccount} onDeleteAccount={(id) => this.onDeleteAccount(id)} setShowDeleteAccountModal={(show) => this.setShowDeleteAccountModal(show)}></DeleteAccountModal>
        ) : null}
      </>
    );
  }
}

export default Settings;
