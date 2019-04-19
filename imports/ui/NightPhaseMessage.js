import React from 'react'

import {Users} from '../users.js'
import {Rooms} from '../rooms.js'

function getRemainingTime(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	return Rooms.find({_id:thisUser.room}).fetch()[0].timer
}

//userId,thisUser,message

export default (props) => {
	return (
		<div>
			<h1 className="PhaseTitle">Night Phase</h1>
			<div className="PlayTimeInfo">
				<p>Time remaining: {getRemainingTime(props.userId)} seconds.</p> 
				<p>{props.thisUser.name}: Your role is the {props.thisUser.role}</p>
				<p>{props.message}</p>
			</div>
		</div>
	)
}