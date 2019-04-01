import React from 'react'

import {Users} from '../users.js'

function displayUsers(userInfo){
	thisUser = Users.find({_id:userInfo}).fetch()[0]
	console.log(thisUser)
	console.log(thisUser.room)
	users = Users.find({room:thisUser.room}).fetch()
	console.log(Users.find({room:thisUser.room}).fetch())
	return users.map((user) => {
		if (user.name != null){
			return <p key={user._id}>{user.name} has user ID: {user._id} and room code: {user.room}</p>
		}
	}
)}

export default class HomePage extends React.Component {
	render(){
		return (
			displayUsers(this.props.userID)
		)
	}
}
