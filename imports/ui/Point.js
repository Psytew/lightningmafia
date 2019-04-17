import React from 'react'

import {Users} from '../users.js'

export default class Point extends React.Component {
	render(){
		return (
			<div>
			<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
			<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>					<h1 className="PhaseTitle">Day Phase</h1>
			<h1 className="WaitingInfo">Vote! Point for who hangs!</h1>
				<button className="NightButton" onClick={this.JumpToResults.bind(this)}>We picked a Mafia Member!</button>
				<button className="NightButton" onClick={this.JumpToResults.bind(this)}>We failed to pick a Mafia Member!</button>
			</div>
		)
	}
	JumpToResults(){
		let room = Users.find({_id:this.props.userID}).fetch()[0].room
		Meteor.call('SetRoomValues', room,"results")
	}
}