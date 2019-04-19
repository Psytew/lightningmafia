import React from 'react'

import {Users} from '../users.js'
import {Rooms} from '../rooms.js'

function getRemainingTime(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
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
				<p>{thisUser.name}: You are the {thisUser.role}, and it is your solemn duty to use your sleuth skills to learn the truth!</p>
				<p>Who do you want to investigate?</p>
				<form onSubmit={function(event){
					event.preventDefault()
					let victim = event.target.seer.value
					Meteor.call('SeerInformation',room,victim)
				}}>
					<select className="NightInput ButtonWithBottomMargin" name="seer">
					  {mapUsers(props.userId)}
					  <option value="middle" key="Check the Middle">Check the missing roles.</option>
					</select>
					<button className="NightButton ButtonWithBottomMargin">Submit</button>
				</form>
			</div>
		</div>
	)
}