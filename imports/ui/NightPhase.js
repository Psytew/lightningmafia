import React from 'react'

import {Users} from '../users.js'

import {Rooms} from '../rooms.js'

function mapUsers(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	users = Users.find({room:thisUser.room}).fetch()
	return users.map((user) => {
		if (user.name != null && user.name != thisUser.name){
			return <option value={user.name} key={user._id}>{user.name}</option>
		}
	}
)}

function getRemainingTime(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	return Rooms.find({_id:thisUser.room}).fetch()[0].timer
}

export default class WaitingRoom extends React.Component {
	render(){
		var thisUser = Users.find({_id:this.props.userID}).fetch()[0]
		var werewolves = Users.find({room:room,role:"Mafia"}).fetch()
		var werewolfMessage = ""
		var minionMessage = ""
		if (werewolves.length == 0){
			minionMessage = "There are no other Mafia members around: You're the boss tonight!"
		} else if (werewolves.length == 1){
			werewolfMessage = "The meeting is scarce tonight. You are the lone Mafia member."
			minionMessage = werewolves[0].name + " is the sole mafia member; guard them with your life!"
		} else {
			werewolfMessage = "The mafia members met and learned one another's names: "
			for (let i = 0; i < werewolves.length - 1; i++){
				werewolfMessage += werewolves[i].name + ", "
			}
			werewolfMessage += "and " + werewolves[werewolves.length-1].name + "!"
			minionMessage = werewolfMessage + " Protect them!"
		}
		var roomTime = Rooms.find({_id:room}).fetch()[0].timer
		if (thisUser.role == "Detective"){
			let seerActionDone = Rooms.find({_id:room}).fetch()[0].Seer
			if (seerActionDone == null){
				return (
					<div>
					<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
					<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
						<h1 className="PhaseTitle">Night Phase</h1>
						<div className="PlayTimeInfo">
							<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p>
							<p>{thisUser.name}: You are the {thisUser.role}, and it is your solemn duty to use your sleuth skills to learn the truth!</p>
							<p>Who do you want to investigate?</p>
							<form onSubmit={function(event){
								event.preventDefault()
								let victim = event.target.seer.value
								Meteor.call('SeerInformation',room,victim)
							}}>
								<select className="NightInput ButtonWithBottomMargin" name="seer">
								  {mapUsers(this.props.userID)}
								  <option value="middle" key="Check the Middle">Check the missing roles.</option>
								</select>
								<button className="NightButton ButtonWithBottomMargin">Submit</button>
							</form>
						</div>
					</div>
				)
			} else {
				return (
					<div>
						<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
						<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
						<h1 className="PhaseTitle">Night Phase</h1>
						<div className="PlayTimeInfo">
							<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p>
							<p>{thisUser.name}: You are the {thisUser.role}, and it is your solemn duty to use your sleuth skills to learn the truth!</p>
						</div>
					</div>
				)
			}
		} else if (thisUser.role == "Mafia"){
			return (
				<div>
					<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
					<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
					<h1 className="PhaseTitle">Night Phase</h1>
					<div className="PlayTimeInfo">
						<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p>
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>{werewolfMessage}</p>
					</div>
				</div>
			)
		} else if  (thisUser.role == "Civilian"){
			return (
				<div>
					<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
					<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
					<h1 className="PhaseTitle">Night Phase</h1>
					<div className="PlayTimeInfo">
						<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>The mafia have infiltrated your quaint village! Find and slay them!</p>
					</div>
				</div>
			)
		} else if (thisUser.role == "Thief"){
			let robberActionDone = Rooms.find({_id:room}).fetch()[0].Rob
			if (robberActionDone == null){
				return (
					<div>
						<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
						<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
						<h1 className="PhaseTitle">Night Phase</h1>
						<div className="PlayTimeInfo">
							<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
							<p>{thisUser.name}: Your role is the {thisUser.role}. With your special skillset, though, perhaps not for long.</p>
							<p>Who do you want to rob?</p>
							<form onSubmit={function(event){
								event.preventDefault()
								let victim = event.target.robber.value
								let stolenRole = Users.find({room:room,name:victim}).fetch()[0].role
								let robber = thisUser.name
								Meteor.call('RobInformation',room,robber,victim,stolenRole)
							}}>
								<select className="NightInput ButtonWithBottomMargin" name="robber">
								  {mapUsers(this.props.userID)}
								</select>
								<button className="NightButton ButtonWithBottomMargin">Submit</button>
							</form>
						</div>
					</div>
				)
			} else {
				return (
					<div>
						<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
						<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
						<h1 className="PhaseTitle">Night Phase</h1>
						<div className="PlayTimeInfo">
							<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
							<p>{thisUser.name}: Your role is the {thisUser.role}. With your special skillset, though, perhaps not for long.</p>
						</div>
					</div>
				)
			}
		} else if (thisUser.role == "Trickster"){
			let troubleActionDone = Rooms.find({_id:room}).fetch()[0].Switch
			if (troubleActionDone == null){
				return (
					<div>
						<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
						<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
						<h1 className="PhaseTitle">Night Phase</h1>
						<div className="PlayTimeInfo">
							<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
							<p>{thisUser.name}: Your role is the {thisUser.role}. Sew your mischief for the good of the village!</p>
							<p>Who do you want to switch?</p>
							<form onSubmit={function(event){
								event.preventDefault()
								let victim1 = event.target.troublemaker1.value
								let victim2 = event.target.troublemaker2.value
								let player1role = Users.find({room:room,name:victim1}).fetch()[0].newRole
								let player2role = Users.find({room:room,name:victim2}).fetch()[0].newRole
								Meteor.call('TroublemakeRoom',room,victim1,victim2,player1role,player2role)
							}}>
								<select className="NightInput ButtonWithBottomMargin" name="troublemaker1">
								  {mapUsers(this.props.userID)}
								</select>
								<select className="NightInput ButtonWithBottomMargin" name="troublemaker2">
								  {mapUsers(this.props.userID)}
								</select>
								<button className="NightButton ButtonWithBottomMargin">Submit</button>
							</form>
						</div>
					</div>
				)
			} else {
				return (
					<div>
						<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
						<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
						<h1 className="PhaseTitle">Night Phase</h1>
						<div className="PlayTimeInfo">
							<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
							<p>{thisUser.name}: Your role is the {thisUser.role}. Sew your mischief for the good of the village!</p>
						</div>
					</div>
				)
			}
		} else if (thisUser.role == "Mason"){
				var masons = Users.find({room:room,role:"Mason"}).fetch()
			var masonMessage = ""
			if (masons.length == 1){
				masonMessage = "You are the lone mason at the meeting tonight! How sad."
			} else if (masons.length > 1) {
				masonMessage += "The masons meet, and learn one another's faces: "
				for (let i = 0; i < masons.length - 1; i++){
					masonMessage += masons[i].name + ", "
				}
				masonMessage += "and " + masons[masons.length-1].name + "!"
			}
			return (
				<div>
					<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
					<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
					<h1 className="PhaseTitle">Night Phase</h1>
					<div className="PlayTimeInfo">
						<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>{masonMessage}</p>
					</div>
				</div>
			)
		} else if (thisUser.role == "Insomniac"){
			return (
				<div>
					<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
					<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
					<h1 className="PhaseTitle">Night Phase</h1>
					<div className="PlayTimeInfo">
						<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>Your malady may turn out to be a boon on this night.</p>
					</div>
				</div>
			)
		} else if (thisUser.role == "Goon"){
			return (
				<div>
					<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
					<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
					<h1 className="PhaseTitle">Night Phase</h1>
					<div className="PlayTimeInfo">
						<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p>
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>{minionMessage}</p>
					</div>
				</div>
			)
		} else if (thisUser.role == "Vigilante"){
			Meteor.call('ActivateHunter',room,thisUser.name)
			return (
				<div>
					<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
					<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
					<h1 className="PhaseTitle">Night Phase</h1>
					<div className="PlayTimeInfo">
						<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p>
						<p>{thisUser.name}: Your role is the {thisUser.role}</p>
						<p>Ready your weapon!</p>
					</div>
				</div>
			)
		}
	}
}