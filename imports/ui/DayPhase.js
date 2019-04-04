import React from 'react'

import {Users} from '../users.js'

export default class DayPhase extends React.Component {
	render(){
		return (
			<div>
				<p>You're in the day phase!!!</p>
				<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
			</div>
		)
	}
	JumpToPoint(){
		let room = Users.find({_id:this.props.userID}).fetch()[0].room
		Meteor.call('SetRoomValues', room,"point")
	}
}