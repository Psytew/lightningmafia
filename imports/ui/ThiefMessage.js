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
	return (
		<div>
			<h1 className="PhaseTitle">Night Phase</h1>
			<div className="PlayTimeInfo">
				<p>Time remaining: {getRemainingTime(props.userId)} seconds.</p> 
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
					  {mapUsers(props.userId)}
					</select>
					<button className="NightButton ButtonWithBottomMargin">Submit</button>
				</form>
			</div>
		</div>
	)
}