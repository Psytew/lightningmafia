import React from 'react'

import {Users} from '../users.js'
import Header from './Header'

export default class NameForm extends React.Component {
	render(){
		return (
			<div className="NameSection">
				<Header />
				<form className="nameForm" onSubmit={this.handleSubmit.bind(this)}>
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
