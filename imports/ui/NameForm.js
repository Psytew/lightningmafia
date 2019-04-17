import React from 'react'

import {Users} from '../users.js'

export default class NameForm extends React.Component {
	render(){
		return (
			<div className="NameSection">
				<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
				<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
				<form className="form" onSubmit={this.handleSubmit.bind(this)}>
					<input className="BeginnerInput" type="text" name="playerName" placeholder="Name?" />
					<button className="BeginnerButton">Submit Name</button>
				</form>
			</div>
		)
	} 
	handleSubmit(e){
		let playerName = e.target.playerName.value;
		e.preventDefault();
		if (playerName) {
			e.target.playerName.value = ''
			Users.update({
				_id:this.props.userID,
			},{
				name: playerName 
			})
		}
	}
}
