import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import logo from '../logo.svg';
import '../css/App.css';
import io from 'socket.io-client';
import M from "materialize-css";
import moment from 'moment';
import * as HOST from '../config';
moment.locale('pt-BR');
const socket = io(HOST.URL_API, {
    path: '/test'
  });
class Sala extends Component {

    constructor(props) {
        super(props);
        this.state = {message: '', user:'', users:[], bodyMessage:[],roomActive:'sala', rooms:[]};    
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getRooms = this.getRooms.bind(this);
        this.setRoomActive = this.setRoomActive.bind(this);
        this.exitChat = this.exitChat.bind(this);
        this.getUsers = this.getUsers.bind(this);
      }
    componentDidMount(){
        let self = this;
        socket.on('connection', function(){  });
        socket.on('chat_message', function(msg) {
            this.setState({bodyMessage: msg}); 
        }.bind(this));
        socket.on('chat_connect', function(){
            console.log("User Login!");
            self.getUsers();
            self.getMessages();
        });
        
        
        if(this.props.location.state.user){
            this.setState({user:this.props.location.state.user});
            let user = {
                "name":this.props.location.state.user,
                "room":"sala",
                "status":1
            };            
            socket.emit('chat_connect', user);  

        }
        this.getUsers();
        }

  
    handleChangeMessage(event) {
        this.setState({message: event.target.value});
    }

    handleChangeUser(event) {
        this.setState({user: event.target.value});
    }
    sendMessage(){
            if(this.state.message!==""){
            let  tempo = moment().format('YYYY-MM-DDTHH:mm:ss');
            let userMsg ={ 
                "name":this.state.user,
                "message":this.state.message,
                "createAt":tempo,
                "room":this.state.roomActive
            } ;
            socket.emit('chat_message', userMsg);  
            this.setState({message: ''}); 
            socket.on('chat_message', function(msg) {
                this.setState({bodyMessage: msg}); 
            }.bind(this));
            return false;
        }
    }

    getRooms(){
        let self = this;
        let options = {
            method:'GET',
            mode:'cors',
            cache:'default'
        };
        let url = HOST.URL_API_ROOMS;
        fetch(url,options)
            .then(function(response) {
                return response.json().then(res =>{
                    self.setState({"rooms": res});
                });
            })
            .catch(function(error) {
                console.log('error:' + JSON.stringify(error));
              });
    }


    getUsers(){
        let self = this;
        let options = {
            method:'GET',
            mode:'cors',
            cache:'default'
        };
        let url = HOST.URL_API_USERS;
        fetch(url,options)
            .then(function(response) {
                return response.json().then(res =>{
                    self.setState({"users": res});
                });
            })
            .catch(function(error) {
                console.log('error:' + JSON.stringify(error));
              });
    }

    getMessages(){
        let self = this;
        let options = {
            method:'GET',
            mode:'cors',
            cache:'default'
        };
        let url = HOST.URL_API_MSG;
        fetch(url,options)
            .then(function(response) {
                return response.json().then(res =>{
                    self.setState({"bodyMessage": res});
                });
            })
            .catch(function(error) {
                console.log('error:' + JSON.stringify(error));
              });
    }

    setRoomActive(roomName){
        console.log("Change Room: "+roomName);
        this.setState({roomActive:roomName});
        socket.emit('change_room', {room:roomName, user:this.state.user});  
    }

    exitChat(){
        let user = {
            "name":this.state.user,
            "room":"sala",
            "status":0
        };
        this.getUsers();
        this.getMessages();
        socket.emit('chat_exit', user);
        let toastHTML = "<span>"+user.name+" saiu na sala!</span>";
        M.toast({html: toastHTML});
        this.props.history.push({pathname: '/'});
    }
 render() {
    
 return (
    <div className="container">
    <div className="row">
    <div className="col s10"></div>
    <div className="col s2 right-align">
        <button className="right-align" onClick={ () => { this.exitChat()}}>Sair
       <i className="material-icons right">exit_to_app</i></button>
        </div>
    </div>

    <div className="row">
        <div className="col s6">
        <h6>Bem vindo(a) {this.state.user}</h6>
        </div>
        
    
    </div>
     <div className="row">

      <div className="col s3">
        <h6>Usuários</h6>
        <div><label>
        <input name="group1" type="radio" checked />
        <span>Online</span>
      </label>
      <label>
        <input name="group1" type="radio"  />
        <span>Offline</span>
      </label>
      </div>
        <div className="collection rooms">
        {this.state.users.map( (r, index) => (
             <a key={index}   className={r.status===1?"collection-item active":"collection-item "}>{r.name}</a>
        ))}
       </div>
      </div>

      <div className="col s9">
      <h6>Mensagens da <span className="room-active">{this.state.roomActive}</span></h6>
            <div className="body_message">{this.state.bodyMessage.map( (m, index) => (
            <p key={index}>{m['createAt']} - {m.name}: {m.message} </p>
            ))}</div>
      </div>

    </div>

    <div className="row">
       <div className="input-field col s12">
       <i className="material-icons prefix">message</i>
       <textarea  id="message" value={this.state.message} onChange={this.handleChangeMessage} ></textarea>
          <label className="active" for="username">Mensagem:</label>
       </div>
       <button className="send" onClick={ () => { this.sendMessage()}}>Enviar
       <i className="material-icons right">send</i></button>
       </div>

    </div>    
 );
 }
}
export default withRouter(Sala);