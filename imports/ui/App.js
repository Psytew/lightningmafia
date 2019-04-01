import React from 'react'

import NameForm from '../ui/NameForm.js'
import RoomFind from '../ui/RoomFind.js'
import WaitingRoom from '../ui/WaitingRoom.js'

import {Users} from '../users.js'

export default class App extends React.Component {
	render(){
		if (Users.find({_id:newUser}).fetch()[0].name == null){ 
			return (
				<NameForm userID={this.props.userID} />
			)
		} else if (Users.find({_id:newUser}).fetch()[0].room == null) {
			return (
				<RoomFind userID={this.props.userID} />
			)
		} else {
			return (
				<WaitingRoom userID={this.props.userID} /> 
			)
		}
	}
}
