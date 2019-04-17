import React from 'react'

import {Users} from '../users.js'

function displayUsers(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	users = Users.find({room:thisUser.room}).fetch()
	return users.map((user,i) => {
		if (user.name != null){
			return <p className="User" key={user._id}>{i + 1}: {user.name}</p>
		}
	}
)}

function displayRoomCode(userInfo){
	room = Users.find({_id:userInfo}).fetch()[0].room
	return <div className="WaitingInfo">
			<h1>Waiting for More Players</h1>
			<h2>The room code is {room}</h2>
		</div>
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
	}><button className="BeginnerButton StartRoomButton">Start Game</button></form>
}

export default class WaitingRoom extends React.Component {
	render(){
		return (
			<div>
				<h2 className="Header"><i className="fas fa-bolt"></i>Lightning<i className="fas fa-bolt"></i></h2>
				<h3 className="SubHeader"><i className="fas fa-user-secret"></i>Mafia<i className="fas fa-user-secret"></i></h3>
				{displayRoomCode(this.props.userID)}
				{displayUsers(this.props.userID)}
				{displayStartButton(this.props.userID)}
			</div>
		)
	}
}
