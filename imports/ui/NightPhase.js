import React from 'react'

import {Users} from '../users.js'

import {Rooms} from '../rooms.js'

function mapUsers(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	users = Users.find({room:thisUser.room}).fetch()
	return users.map((user) => {
		if (user.name != null){
			return <option value={user.name} key={user._id}>{user.name}</option>
		}
	}
)}

function getRemainingTime(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	console.log(thisUser)
	console.log(Rooms.find({room:thisUser.room}).fetch())
	return Rooms.find({_id:thisUser.room}).fetch()[0].timer
}

export default class WaitingRoom extends React.Component {
	render(){
		var thisUser = Users.find({_id:this.props.userID}).fetch()[0]
		var werewolves = Users.find({room:room,role:"Werewolf"}).fetch()
		var werewolfMessage = ""
		var minionMessage = ""
		if (werewolves.length == 0){
			minionMessage = "There is no werewolf! Try to survive!"
		} else if (werewolves.length == 1){
			werewolfMessage = "You are the only werewolf!"
			minionMessage = werewolves[0].name + " is the only werewolf!"
		} else {
			werewolfMessage = "The werewolves are: "
			for (let i = 0; i < werewolves.length - 1; i++){
				werewolfMessage += werewolves[i].name + ", "
			}
			werewolfMessage += "and " + werewolves[werewolves.length-1].name + "!"
			minionMessage = werewolfMessage
		}
		var masons = Users.find({room:room,role:"Mason"}).fetch()
		var masonMessage = ""
		if (masons.length == 1){
			masonMessage = "You are the only mason! How sad."
		} else if (masons.length > 1) {
			masonMessage += "The masons are: "
			for (let i = 0; i < masons.length - 1; i++){
				masonMessage += masons[i].name + ", "
			}
			masonMessage += "and " + masons[masons.length-1].name + "!"
		}
		var roomTime = Rooms.find({_id:room}).fetch()[0].timer
		console.log(Rooms.find({_id:room}).fetch())
		console.log(roomTime)
		if (thisUser.role == "Seer"){
			return (
				<div>
					<h2>Night Phase</h2>
					<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p>
					<p>Your role is the {thisUser.role}</p>
					<p>Who do you want to investigate?</p>
					<form>
						<select name="seer">
						  {mapUsers(this.props.userID)}
						  <option value="middle" key="middle">Check the Middle</option>
						</select>
						<button>Submit</button>
					</form>
				</div>
			)
		} else if (thisUser.role == "Werewolf"){
			return (
				<div>
					<h2>Night Phase</h2>
					<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p>
					<p>Your role is the {thisUser.role}</p>
					<p>{werewolfMessage}</p>
				</div>
			)
		} else if  (thisUser.role == "Villager"){
			return (
				<div>
					<h2>Night Phase</h2>
					<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
					<p>Your role is the {thisUser.role}</p>
					<p>You just get to chill out!</p>
				</div>
			)
		} else if (thisUser.role == "Robber"){
			return (
				<div>
					<h2>Night Phase</h2>
					<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
					<p>Your role is the {thisUser.role}</p>
					<p>Who do you want to rob?</p>
					<form>
						<select name="robber">
						  {mapUsers(this.props.userID)}
						</select>
						<button>Submit</button>
					</form>
				</div>
			)
		} else if (thisUser.role == "Troublemaker"){
			return (
				<div>
					<h2>Night Phase</h2>
					<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
					<p>Your role is the {thisUser.role}</p>
					<p>Who do you want to switch?</p>
					<form>
						<select name="troublemaker1">
						  {mapUsers(this.props.userID)}
						</select>
						<select name="troublemaker2">
						  {mapUsers(this.props.userID)}
						</select>
						<button>Submit</button>
					</form>
				</div>
			)
		} else if (thisUser.role == "Mason"){
			return (
				<div>
					<h2>Night Phase</h2>
					<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
					<p>Your role is the {thisUser.role}</p>
					<p>{masonMessage}</p>
				</div>
			)
		} else if (thisUser.role == "Bodyguard"){
			return (
				<div>
					<h2>Night Phase</h2>
					<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p> 
					<p>Your role is the {thisUser.role}</p>
					<p>Who do you want to protect?</p>
					<form>
						<select name="bodyguard">
						  {mapUsers(this.props.userID)}
						</select>
						<button>Submit</button>
					</form>
				</div>
			)
		} else if (thisUser.role == "Minion"){
			return (
				<div>
					<h2>Night Phase</h2>
					<p>Time remaining: {getRemainingTime(this.props.userID)} seconds.</p>
					<p>Your role is the {thisUser.role}</p>
					<p>{minionMessage}</p>
				</div>
			)
		}
	}
}