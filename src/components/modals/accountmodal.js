import React, { Component } from "react";

class AccountModal extends Component {
  state = {
    accountName: "",
    accountUser: "",
    accountPassword: "",
    accountDescription: "",
    isUpdate: false,
    updateAccountId: 0,
    type: "Bondster",
    types: [
      { name: "Bondster", type: "Bondster" },
      { name: "EstateGuru", type: "EstateGuru" },
      { name: "GetIncome", type: "GetIncome" },
      { name: "Lendermarket", type: "Lendermarket" },
      { name: "LendSecured", type: "LendSecured" },
      { name: "PeerBerry", type: "PeerBerry" },
    ],
  };

  componentDidMount() {
    if (this.props.isUpdate) {
      this.getAccountInformation(this.props.accountId);
    }
    this.setState({ isUpdate: this.props.isUpdate, updateAccountId: this.props.accountId });
  }

  updateNameValue(evt) {
    this.setState({
      accountName: evt.target.value,
    });
  }

  handleChangeType(evt) {
    var types = this.state.types;
    for (var i = 0; i < types.length; i++) {
      if (types[i].name == evt.target.value) {
        this.setState({ type: types[i].type });
        break;
      }
    }
    return "Bondster";
  }

  updateDescriptionValue(evt) {
    this.setState({
      accountDescription: evt.target.value,
    });
  }

  updateAccountName(evt) {
    this.setState({
      accountUser: evt.target.value,
    });
  }

  updateAccountPassword(evt) {
    this.setState({
      accountPassword: evt.target.value,
    });
  }

  render() {
    return (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="w-full relative w-auto my-6 mx-auto max-w-sm">
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class={"mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full " + (this.state.isUpdate ? "bg-yellow-100" : "bg-green-100") + " sm:mx-0 sm:h-10 sm:w-10"}>
                    {this.state.isUpdate ? (
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mt-2" id="modal-title">
                      {this.state.isUpdate ? "Update Account" : "New Account"}
                    </h3>
                    <div class="mb-1 w-full flex-col mt-3">
                      <label class="font-medium text-gray-800 py-2">Name</label>
                      <input value={this.state.accountName} onChange={(evt) => this.updateNameValue(evt)} type="text" placeholder="Personal account" class="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full" />
                    </div>
                    <div class="mb-1 w-full flex-col mt-3">
                      <label class="font-medium text-gray-800 py-2">Type</label>
                      <div class="relative ">
                        <svg class="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 232">
                          <path
                            d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                            fill="#648299"
                            fill-rule="nonzero"
                          />
                        </svg>
                        <select onChange={(evt) => this.handleChangeType(evt)} class="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full">
                          {this.state.types
                            .sort(function (l, u) {
                              return l.name > u.name ? 1 : -1;
                            })
                            .map((item) => (
                              <option>{item.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div class="mb-1 w-full flex-col mt-3">
                      <label class="font-medium text-gray-800 py-2">Account name</label>
                      <input value={this.state.accountUser} onChange={(evt) => this.updateAccountName(evt)} type="text" placeholder="john.doe@mail.com" class="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full" />
                    </div>
                    <div class="mb-1 w-full flex-col mt-3">
                      <label class="font-medium text-gray-800 py-2">Password</label>
                      <input value={this.state.accountPassword} onChange={(evt) => this.updateAccountPassword(evt)} type="text" placeholder="Test123" class="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full" />
                    </div>

                    <div class="mb-1 w-full flex-col mt-3">
                      <label class="font-medium text-gray-800 py-2">Description</label>
                      <input
                        value={this.state.accountDescription}
                        onChange={(evt) => this.updateDescriptionValue(evt)}
                        type="text"
                        placeholder="My own Personal account"
                        class="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    if (this.state.isUpdate) {
                      this.props.onUpdateAccount(this.state.updateAccountId, this.state.accountName, this.state.accountDescription);
                    } else {
                      this.props.onCreateNewAccount(this.state.accountName, this.state.type, this.state.accountUser, this.state.accountPassword, this.state.accountDescription);
                    }
                  }}
                  class={
                    "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 " +
                    (this.state.isUpdate ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500") +
                    " text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm"
                  }
                >
                  {this.state.isUpdate ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => this.props.setShowNewAccountModal(false)}
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>{" "}
      </>
    );
  }
}

export default AccountModal;
