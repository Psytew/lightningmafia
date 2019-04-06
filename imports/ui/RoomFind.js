import React from 'react'

import {Users} from '../users.js'
import {Rooms} from '../rooms.js'

export default class RoomFind extends React.Component {
	render(){
		return (
			<div>
				<h1>This will help you find a room!</h1>
				<h3>Create a room.</h3>

				<form onSubmit={this.handleSubmitNew.bind(this)}>
					<button>Create</button>
				</form>

				<h3>Join a room.</h3>
				<form onSubmit={this.handleSubmitJoin.bind(this)}>
					<p>Room Code</p>
					<input name="roomcode" type="text" />
					<button>Join</button>
				</form>

				<h3>Change Name</h3>
				<p>You cannot join a room if someone shares your name.</p>
				<form onSubmit={function(){
					e.preventDefault();
					Users.update({
						_id:this.props.userID,
					},{
						$set: {name:null}
					})
				}}>
					<button>Change Name</button>
				</form>

			</div>
		)
	}
	handleSubmitNew(e){
		e.preventDefault();
		let newID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
		let name = Users.find({_id:this.props.userID}).fetch()[0].name
		let room = Rooms.insert({id:newID,Rob:null,Seer:null,Switch:null,activeRoles:[],middleRoles:[],playerNames:[name],players:[this.props.userID]})
		Users.update({
				_id:this.props.userID,
			},{
				$set: {room:room}
			})
	}
	handleSubmitJoin(e){
		e.preventDefault();
		let roomcode = e.target.roomcode.value;
		let roomToJoinInfo = Rooms.find(roomcode).fetch()
		let roomToJoin = roomToJoinInfo[0]
		let name = Users.find({_id:this.props.userID}).fetch()[0].name
		console.log(name)
		if (roomToJoinInfo.length > 0){
			if (roomToJoin.gameStatus == null){
				let duplicate = false
				for (let i = 0; i < roomToJoin.playerNames.length; i++){
					if (name == roomToJoin.playerNames[i]){
						console.log(name)
						console.log(roomToJoin.playerNames[i])
						duplicate = true
					}
				}
				if (duplicate == false){
					Rooms.update({
					_id:roomcode
					},{
						$push: {players:this.props.userID,playerNames:name}
					})
					Users.update({
						_id:this.props.userID,
					},{
						$set: {room:roomcode}
					})
				} else {
					alert("You have the same name as someone in that room.")
				}
			} else {
				alert("Sorry, this game is in session.")
			}
		} else {
			alert("Sorry, this room doesn't seem to exist.")
		}
	}
}
