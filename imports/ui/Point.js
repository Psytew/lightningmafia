import React from 'react'

import {Users} from '../users.js'

import Header from './Header'

export default class Point extends React.Component {
	render(){
		return (
			<div>
			<Header />
			<h1 className="WaitingInfo">Vote! Point for who hangs!</h1>
				<button className="NightButton ButtonWithBottomMargin" onClick={this.JumpToResults.bind(this)}>We picked someone!</button>
				<button className="NightButton ButtonWithBottomMargin" onClick={this.JumpToResults.bind(this)}>We didn't pick someone!</button>
			</div>
		)
	}
	JumpToResults(){
		let room = Users.find({_id:this.props.userID}).fetch()[0].room
		Meteor.call('SetRoomValues', room,"results")
	}
}