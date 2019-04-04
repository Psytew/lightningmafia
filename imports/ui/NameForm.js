import React from 'react'

import {Users} from '../users.js'

export default class NameForm extends React.Component {
	render(){
		return (
			<form className="form" onSubmit={this.handleSubmit.bind(this)}>
				<input type="text" name="playerName" placeholder="Name?" />
				<button>Submit Name</button>
			</form>
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
