import React from 'react'

import {Users} from '../users.js'
import {Rooms} from '../rooms.js'

function getRemainingTime(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	console.log(thisUser)
	return Rooms.find({_id:thisUser.room}).fetch()[0].timer
}

function mapUsers(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	users = Users.find({room:thisUser.room}).fetch()
	return users.map((user) => {
		if (user.name != null && user.name != thisUser.name){
			return <option value={user.name} key={user._id}>{user.name}</option>
		}
	}
)}

export default (props) => {
	console.log(props.userId)
	return (
		<div>
			<h1 className="PhaseTitle">Night Phase</h1>
			<div className="PlayTimeInfo">
				<p>Time remaining: {getRemainingTime(props.userId)} seconds.</p> 
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
					  {mapUsers(props.userId)}
					</select>
					<select className="NightInput ButtonWithBottomMargin" name="troublemaker2">
					  {mapUsers(props.userId)}
					</select>
					<button className="NightButton ButtonWithBottomMargin">Submit</button>
				</form>
			</div>
		</div>
	)
}