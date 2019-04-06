import React from 'react'

import {Users} from '../users.js'

function displayUsers(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	users = Users.find({room:thisUser.room}).fetch()
	return users.map((user) => {
		if (user.name != null){
			return <p key={user._id}>{user.name} with user ID: {user._id}</p>
		}
	}
)}

function displayRoomCode(userInfo){
	room = Users.find({_id:userInfo}).fetch()[0].room
	return <h2>The room code is {room}</h2>
}

function displayStartButton(userInfo){
	return <form onSubmit={function(event){
		event.preventDefault()
		users = Users.find({room:thisUser.room}).fetch()
		if (users.length >= 3){
			Meteor.call('StartButtonFunction',userInfo)
		} else {
			alert("You need at least three people to play!")
		}
	}
	}><button>Start Game</button></form>
}

export default class WaitingRoom extends React.Component {
	render(){
		return (
			[
				displayRoomCode(this.props.userID),
				displayUsers(this.props.userID),
				displayStartButton(this.props.userID)
			]
		)
	}
}
