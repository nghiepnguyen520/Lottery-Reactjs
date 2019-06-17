import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
   
    return (
      <div>
        <div className="card">
          <div className="card-body">
            <h1 className="card-title">Lottery Solither</h1>
            <h3 className="card-subtitle text-muted">This contract is managed by {this.state.manager}. There are currently{' '}
              {this.state.players.length} people entered, competing to win{' '}
              {web3.utils.fromWei(this.state.balance, 'ether')} ether!</h3>
          </div>
        </div>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div className="form-check form-check-inline">

            <label className="form-check-label">
              Amount of ether to enter :

    <input className="form-check-input" type="text"
                value={this.state.value}
                
              /> Display value
  </label>
            <button type="button" className="btn btn-primary">Enter</button>
          </div>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button className="btn btn-primary active" onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;

