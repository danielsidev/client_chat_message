import React, { Component } from 'react';
import logo from '../logo.svg';
import 'materialize-css/dist/css/materialize.min.css';
import '../css/App.css';
import { withRouter } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom'
// Import Materialize
import M from "materialize-css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {user:''};    
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.enterChat = this.enterChat.bind(this);
  }

   componentDidMount() {
        // Auto initialize all the things!
        M.AutoInit();
        
        
    }

    handleChangeUser(event) {
      this.setState({user: event.target.value});
  }
    enterChat(event){
      this.setState({user: event.target.value});
      console.log("user: "+this.state.user);
      if(this.state.user=== undefined || this.state.user===""){
        return
      }else{
        this.props.history.push({
          pathname: '/sala',
          state: {user: this.state.user}  
      });
      }

    }

  render() {
    return (
      <div className="container">
  <div className="row">
  <div className="col s1 m3 l3 "></div>
    <div className="col s12 m6 l6 ">
    <form className="col s12">
      <div className="card-panel">
      <h5 className="center">Chat Message</h5>
      
      <div className="row">
       <div className="input-field col s12">
       <i className="material-icons prefix">account_circle</i>
        <input  id="username" value={this.state.user}  onChange={this.handleChangeUser}type="text" className="validate" required="true" />
          <label className="active" for="username">Nome:</label>
       </div> 
        <button onClick={(e) =>{ this.enterChat(e)}} className="btn waves-effect waves-light" type="submit" name="action">Entrar
          <i className="material-icons right">input</i>
        </button>
       </div>
       
      </div>
      </form>
    </div>
  </div>

      </div>
    );
  }
}

export default withRouter(App);
