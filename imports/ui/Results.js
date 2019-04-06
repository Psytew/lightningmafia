import React from 'react'

import {Users} from '../users.js'

import {Rooms} from '../rooms.js'

function usersAndRoles(ID){
	thisUser = Users.find({_id:ID}).fetch()[0]
	users = Users.find({room:thisUser.room}).fetch()
	return users.map((user) => {
		if (user.name != null){
			return <p key={user._id}>{user.name} started the game as the {user.role} and ended it as the {user.newRole}</p>
		}
	})
}

function robberMessage(roomInformation){
	if (roomInformation.Rob == null){
		return <p>There was no robbing this game!</p>
	} else {
		return <p>{roomInformation.Rob[0]} robbed from {roomInformation.Rob[1]}</p>
	}
}

function troubleMessage(roomInformation){
	if (roomInformation.Switch == null){
		return <p>There was no troublemaking this game!</p>
	} else {
		return <p>{roomInformation.Switch[0]} and {roomInformation.Switch[1]} were switched!</p>
	}
}

export default class Results extends React.Component {
	render(){
		var roomInformation = Rooms.find({_id:room}).fetch()[0]
		var werewolves = Users.find({room:room,newRole:"Werewolf"}).fetch()
		var minion = Users.find({room:room,newRole:"Minion"}).fetch()
		var werewolfMessage = ""
		if (werewolves.length == 0){
			if (minion.length != 0){
				werewolfMessage = "There was no werewolf! However, " + minion[0].name + " was the minion!"
			} else {
				werewolfMessage = "There was no werewolf!"
			}
		} else if (werewolves.length == 1){
			werewolfMessage = werewolves[0].name + " was the only werewolf!"
		} else {
			werewolfMessage = "The werewolves were: "
			for (let i = 0; i < werewolves.length - 1; i++){
				werewolfMessage += werewolves[i].name + ", "
			}
			werewolfMessage += "and " + werewolves[werewolves.length-1].name + "!"
		}
		return (
			<div>
				<p>{werewolfMessage}</p>
				{usersAndRoles(this.props.userID)}
				{robberMessage(roomInformation)}
				{troubleMessage(roomInformation)}
				<button onClick={this.JumpToWaiting.bind(this)}>Back to room!</button>
			</div>
		)
	}
	JumpToWaiting(){
		let room = Users.find({_id:this.props.userID}).fetch()[0].room
		Meteor.call('SetIndividualValue',this.props.userID,null)
		Meteor.call('ResetRoom',room)
	}
}