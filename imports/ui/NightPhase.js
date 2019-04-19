import React from 'react'

import {Users} from '../users.js'
import {Rooms} from '../rooms.js'

import Header from './Header'
import NightPhaseMessage from './NightPhaseMessage'
import SeerMessage from './SeerMessage'
import ThiefMessage from './ThiefMessage'
import TricksterMessage from './TricksterMessage'

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
		if (thisUser.role == "Detective"){
			let seerActionDone = Rooms.find({_id:room}).fetch()[0].Seer
			if (seerActionDone == null){
				return (
					<div>
						<Header />
						<SeerMessage userId={this.props.userID} thisUser={thisUser} />
					</div>
				)
			} else {
				let message = thisUser.name + ": You are the " + thisUser.role + ", and it is your solemn duty to use your sleuth skills to learn the truth!"
				return (
					<div>
						<Header />
						<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={message} />
					</div>
				)
			}
		} else if  (thisUser.role == "Civilian"){
			let message = "The mafia have infiltrated your quaint village! Find and slay them!"
			return (
				<div>
					<Header />
					<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={message} />
				</div>
			)
		} else if (thisUser.role == "Thief"){
			let robberActionDone = Rooms.find({_id:room}).fetch()[0].Rob
			if (robberActionDone == null){
				return (
					<div>
						<Header />
						<ThiefMessage userId={this.props.userID} thisUser={thisUser} />
					</div>
				)
			} else {
				let message = thisUser.name + "Your role is the thief. With your special skillset, though, perhaps not for long."
				return (
					<div>
						<Header />
						<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={message} />
					</div>
				)
			}
		} else if (thisUser.role == "Trickster"){
			let troubleActionDone = Rooms.find({_id:room}).fetch()[0].Switch
			if (troubleActionDone == null){
				return (
					<div>
						<Header />
						<TricksterMessage userId={this.props.userID} thisUser={thisUser} />
					</div>
				)
			} else {
				let message = thisUser.name + ": Your role is the trickster. Sew your mischief for the good of the village!"
				return (
					<div>
						<Header />
						<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={message} />
					</div>
				)
			}
		} else if (thisUser.role == "Mason"){
				var masons = Users.find({room:room,role:"Mason"}).fetch()
			var masonMessage = ""
			if (masons.length == 1){
				masonMessage = thisUser.name + "You are the lone mason at the meeting tonight! How sad."
			} else if (masons.length > 1) {
				masonMessage += "Young mason, you and your companions meet, and learn one another's faces: "
				for (let i = 0; i < masons.length - 1; i++){
					masonMessage += masons[i].name + ", "
				}
				masonMessage += "and " + masons[masons.length-1].name + "!"
			}
			return (
				<div>
					<Header />
					<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={masonMessage} />
				</div>
			)
		} else if (thisUser.role == "Vigilante"){
			Meteor.call('ActivateHunter',room,thisUser.name)
			return (
				<div>
					<Header />
					<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={"Ready your weapon!"} />
				</div>
			)
		} else if (thisUser.role == "Insomniac"){
			return (
				<div>
					<Header />
					<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={"Your malady may become a boon tonight!"} />
				</div>
			)
		} else if (thisUser.role == "Mafia" || thisUser.role == "Goon"){
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
			if (thisUser.role == "Mafia"){
				return (
					<div>
						<Header />
						<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={werewolfMessage} />
					</div>
				)
			} else {
				return (
					<div>
						<Header />
						<NightPhaseMessage userId={this.props.userID} thisUser={thisUser} message={minionMessage} />
					</div>
				)
			}
		}
	}
}