import React from 'react'

import {Users} from '../users.js'

import {Rooms} from '../rooms.js'

function usersAndRoles(ID){
	thisUser = Users.find({_id:ID}).fetch()[0]
	users = Users.find({room:thisUser.room}).fetch()
	return users.map((user) => {
		if (user.name != null){
			return <p className="ResultsList" key={user._id}>{user.name} started the game as the {user.role} and ended it as the {user.newRole}</p>
		}
	})
}

function robberMessage(roomInformation){
	if (roomInformation.Rob == null){
		return <p className="ResultsList">There was no robbing this game!</p>
	} else {
		return <p className="ResultsList">{roomInformation.Rob[0]} robbed from {roomInformation.Rob[1]}</p>
	}
}

function troubleMessage(roomInformation){
	if (roomInformation.Switch == null){
		return <p className="ResultsList">There was no troublemaking this game!</p>
	} else {
		return <p className="ResultsList">{roomInformation.Switch[0]} and {roomInformation.Switch[1]} were switched!</p>
	}
}

function hunterMessage(roomInformation){
	if (roomInformation.Hunter != null){
		return <p className="ResultsList">{roomInformation.Hunter} was the vigilante, so if they were killed, whoever they pointed at is also killed!</p>
	}
}

export default class Results extends React.Component {
	render(){
		var roomInformation = Rooms.find({_id:room}).fetch()[0]
		var werewolves = Users.find({room:room,newRole:"Mafia"}).fetch()
		var minion = Users.find({room:room,newRole:"Goon"}).fetch()
		var werewolfMessage = ""
		if (werewolves.length == 0){
			if (minion.length != 0){
				werewolfMessage = "There was no mafia! However, " + minion[0].name + " was the goon; they were effectively the mafia!"
			} else {
				werewolfMessage = "There was no mafia!"
			}
		} else if (werewolves.length == 1){
			werewolfMessage = werewolves[0].name + " was the only mafia member!"
		} else {
			werewolfMessage = "The mafia members were: "
			for (let i = 0; i < werewolves.length - 1; i++){
				werewolfMessage += werewolves[i].name + ", "
			}
			werewolfMessage += "and " + werewolves[werewolves.length-1].name + "!"
		}
		return (
			<div>
				<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
				<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>					<h1 className="PhaseTitle">Day Phase</h1>
				<h1 className="WaitingInfo">{werewolfMessage}</h1>
				{usersAndRoles(this.props.userID)}
				{robberMessage(roomInformation)}
				{troubleMessage(roomInformation)}
				{hunterMessage(roomInformation)}
				<button className="NightButton ButtonWithBottomMargin" onClick={this.JumpToWaiting.bind(this)}>Back to room!</button>
			</div>
		)
	}
	JumpToWaiting(){
		let room = Users.find({_id:this.props.userID}).fetch()[0].room
		Meteor.call('SetIndividualValue',this.props.userID,null)
		Meteor.call('ResetRoom',room)
	}
}