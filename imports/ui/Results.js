import React from 'react'

import {Users} from '../users.js'

export default class Results extends React.Component {
	render(){
		return (
			<div>
				<p>These are the results.</p>
				<button onClick={this.JumpToWaiting.bind(this)}>Back to room!</button>
			</div>
		)
	}
	JumpToWaiting(){
		let room = Users.find({_id:this.props.userID}).fetch()[0].room
		Meteor.call('SetIndividualValue',room,null)
		Meteor.call('SetRoomValue',room,null)
	}
}