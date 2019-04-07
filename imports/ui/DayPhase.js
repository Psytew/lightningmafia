import React from 'react'

import {Users} from '../users.js'

import {Rooms} from '../rooms.js'

function returnRolesInGame(){
	let Roles = Rooms.find({_id:room}).fetch()[0].rolesInGame
	return Roles.map((role,i) => {
		return <li className="RoleList" value={role} key={i}>{role}</li>
	})
}

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
		if (thisUser.role == "Detective"){
			let seerMessage = ""
			if (sessionInformation.Seer != null){
				let seerVictim = sessionInformation.Seer[0]
				if (seerVictim != "middle"){
					let victimsRole = sessionInformation.Seer[1]
					seerMessage = `Last night, you discovered that ${seerVictim} is the ${victimsRole}.`
				} else {
					let role1 = sessionInformation.Seer[1]
					let role2 = sessionInformation.Seer[2]
					seerMessage = `Last night, you discovered that the ${role1} and the ${role2} are missing!`
				}
			} else {
				seerMessage = "Apparently, you are so good you had no need to investigate anyone! How skilled!"
			}
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
						{getRemainingTime(this.props.userID)}
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>{seerMessage} Now, go find the mafia!</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Trickster"){
			let troubleMessage = ""
			if (sessionInformation.Switch != null){
				let victim1 = sessionInformation.Switch[0]
				let victim2 = sessionInformation.Switch[1]
				let role1 = sessionInformation.Switch[2]
				let role2 = sessionInformation.Switch[3]
				Meteor.call('TroublemakeUsers',room,victim1,victim2,role1,role2)
				troubleMessage = "Last night, you switched " + victim1 + " and " + victim2 + ". Now, go stop that Mafia!"
			} else {
				troubleMessage = "You chose not to switch anyone! How droll!"
			}
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
						{getRemainingTime(this.props.userID)}
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>{troubleMessage}</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Thief"){
			let robberMessage = ""
			if (sessionInformation.Rob != null){
				let victim = sessionInformation.Rob[1]
				let role = sessionInformation.Rob[2]
				robberMessage = `Your role used to be the thief, but you abandoned that life when you stole the ${role} from ${victim}!`
			} else {
				robberMessage = "You are the thief, but you chose not to steal from anyone! Surprisingly honest of you."
			}
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
						{getRemainingTime(this.props.userID)}
						<p>{thisUser.name}: {robberMessage}</p>
						<p>Now, find the mafia!</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if  (thisUser.role == "Villager"){
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
					{getRemainingTime(this.props.userID)}
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>Grab those pitchforks and find those mafia members!</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Mason"){
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
					{getRemainingTime(this.props.userID)}
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>Now, kill those mafia members for the glory of masonry!</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Insomniac"){
			let insomRole = Users.find({_id:this.props.userID}).fetch()[0].newRole
			let insomMessage = ""
			if (insomRole == thisUser.role){
				insomMessage = "You are the insomniac, and in the night you were left unchanged. Go find that mafia!"
			} else {
				insomMessage = `You were once the inosmniac, but in the night you were changed into the ${insomRole}.`
			}
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
						{getRemainingTime(this.props.userID)}
						<p>{insomMessage}</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Mafia"){
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
					{getRemainingTime(this.props.userID)}
						<p>{thisUser.name}: Your role is the {thisUser.role}. Blend in! Hide! Lie! Don't get killed!</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		}  else if (thisUser.role == "Goon"){
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
						{getRemainingTime(this.props.userID)}
						<p>{thisUser.name}: Your role is the {thisUser.role}. Try to win this one for the Mafia, by any means necessary!</p>
						<p>Protect the Mafia!</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
				</div>
			)
		} else if (thisUser.role == "Vigilante"){
			return (
				<div>
					<h1 className="Header Header--lessMargin"><i className="fas fa-bolt"> </i>Lightning Mafia<i className="fas fa-user-secret"> </i></h1>
					<h1 className="PhaseTitle">Day Phase</h1>
					<div className="PlayTimeInfo">
						<p>{getRemainingTime(this.props.userID)}</p>
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>Go find those mafia members!</p>
						<p>Roles in this game:</p>
					</div>
					<ul className="RoleListHolder">{returnRolesInGame()}</ul>
					<button className="NightButton" onClick={this.JumpToPoint.bind(this)}>Jump to voting!</button>
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