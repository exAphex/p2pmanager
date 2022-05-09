import React, {Component} from 'react';
const {ipcRenderer} = window.require('electron');

class Forecast extends Component {
  state = {version: null};

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('query-version');
  }

  componentDidMount() {
    ipcRenderer.on('query-version', (event, arg) => {
      this.setState({version: arg});
    });

    ipcRenderer.send('get-version', '');
  }

  render() {
    return (
      <div className="h-full flex justify-center items-center flex-col">
        <div className="text-4xl font-bold">P2PManager</div>
        <div className="">Version: {this.state.version}</div>
        <div className="">by exAphex</div>
      </div>
    );
  }
}

export default Forecast;
