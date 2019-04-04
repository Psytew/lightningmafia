import React from 'react'

import {Users} from '../users.js'

export default class Point extends React.Component {
	render(){
		return (
			<div>
				<p>Pointing Phase</p>
				<button onClick={this.JumpToResults.bind(this)}>We picked a werewolf!</button>
			</div>
		)
	}
	JumpToResults(){
		let room = Users.find({_id:this.props.userID}).fetch()[0].room
		Meteor.call('SetRoomValues', room,"results")
	}
}