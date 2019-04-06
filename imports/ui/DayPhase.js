import React from 'react'

import {Users} from '../users.js'

import {Rooms} from '../rooms.js'

function getRemainingTime(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	timeInSeconds = Rooms.find({_id:thisUser.room}).fetch()[0].timer
	let minutes = Math.floor(timeInSeconds/60)
	let seconds = timeInSeconds % 60
	if (seconds.toString().length == 1){
		seconds = "0" + seconds
	}
	return <p>Time remaining: {minutes}:{seconds}</p>
}

export default class DayPhase extends React.Component {
	render(){
		let sessionInformation = Rooms.find({_id:room}).fetch()[0]
		if (thisUser.role == "Seer"){
			let seerMessage = ""
			if (sessionInformation.Seer != null){
				let seerVictim = sessionInformation.Seer[0]
				if (seerVictim != "middle"){
					let victimsRole = sessionInformation.Seer[1]
					seerMessage = `Last night, you gleamed that ${seerVictim} is the ${victimsRole}.`
				} else {
					let role1 = sessionInformation.Seer[1]
					let role2 = sessionInformation.Seer[2]
					seerMessage = `Last night, you gleamed that there was no ${role1} or ${role2}.`
				}
			} else {
				seerMessage = "Apparently, you are so good you had no need to look at anyone! How skilled!"
			}
			return (
				<div>
					<h2>Day Phase</h2>
					{getRemainingTime(this.props.userID)}
					<p>{thisUser.name}: Your role is the {thisUser.role}</p>
					<p>{seerMessage} Now, go find the werewolves!</p>
					<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Troublemaker"){
			let troubleMessage = ""
			if (sessionInformation.Switch != null){
				let victim1 = sessionInformation.Switch[0]
				let victim2 = sessionInformation.Switch[1]
				let role1 = sessionInformation.Switch[2]
				let role2 = sessionInformation.Switch[3]
				Meteor.call('TroublemakeUsers',room,victim1,victim2,role1,role2)
				troubleMessage = "Last night, you switched " + victim1 + " and " + victim2 + ". Now, go seek the werewolves!"
			} else {
				troubleMessage = "You chose not to switch anyone! How droll!"
			}
			return (
				<div>
					<h2>Day Phase</h2>
					{getRemainingTime(this.props.userID)}
					<p>{thisUser.name}: Your role is the {thisUser.role}</p>
					<p>{troubleMessage}</p>
					<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Robber"){
			let robberMessage = ""
			if (sessionInformation.Rob != null){
				let victim = sessionInformation.Rob[1]
				let role = sessionInformation.Rob[2]
				robberMessage = `Your role used to be the robber, but you abandoned that life when you stole the ${role} from ${victim}!`
			} else {
				robberMessage = "You are the robber, but you chose not to steal from anyone! Surprisingly honest of you."
			}
			return (
				<div>
					<h2>Day Phase</h2>
					{getRemainingTime(this.props.userID)}
					<p>{thisUser.name}: {robberMessage}</p>
					<p>Now, find the werewolves!</p>
					<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if  (thisUser.role == "Villager"){
			return (
				<div>
					<h2>Day Phase</h2>
					{getRemainingTime(this.props.userID)}
					<p>{thisUser.name}: Your role is the {thisUser.role}</p>
					<p>Grab those pitchforks and find those werewolves!</p>
					<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Mason"){
			return (
				<div>
					<h2>Day Phase</h2>
					{getRemainingTime(this.props.userID)}
					<p>{thisUser.name}: Your role is the {thisUser.role}</p>
					<p>Now, kill those werewolves for the glory of masonry!</p>
					<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Insomniac"){
			let insomRole = Users.find({_id:this.props.userID}).fetch()[0].newRole
			let insomMessage = ""
			if (insomRole == thisUser.role){
				insomMessage = "You are the insomniac, and in the night you were left unchanged. Go find those werewolves!"
			} else {
				insomMessage = `You were once the inosmniac, but in the night you were changed into the ${insomRole}.`
			}
			return (
				<div>
					<h2>Day Phase</h2>
					{getRemainingTime(this.props.userID)}
					<p>{insomMessage}</p>
					<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Werewolf"){
			return (
				<div>
					<h2>Day Phase</h2>
					{getRemainingTime(this.props.userID)}
					<p>{thisUser.name}: Your role is the {thisUser.role}. Blend in! Hide! Lie! Don't get killed!</p>
					<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		}  else if (thisUser.role == "Minion"){
			return (
				<div>
					<h2>Day Phase</h2>
					{getRemainingTime(this.props.userID)}
					<p>{thisUser.name}: Your role is the {thisUser.role}. Try to win this one for the werewolves, by any means necessary!</p>
					<p>Protect the werewolves!</p>
					<button onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		}
	}
	JumpToPoint(){
		let room = Users.find({_id:this.props.userID}).fetch()[0].room
		Meteor.call('SetRoomValues', room,"point")
		Meteor.call('SetRoomTimers',room,1)
	}
}