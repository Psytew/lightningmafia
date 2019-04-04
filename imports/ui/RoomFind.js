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
			</div>
		)
	}
	handleSubmitNew(e){
		e.preventDefault();
		let newID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
		let room = Rooms.insert({id:newID,players:[this.props.userID]})
		Users.update({
				_id:this.props.userID,
			},{
				$set: {room:room}
			})
	}
	handleSubmitJoin(e){
		e.preventDefault();
		let roomcode = e.target.roomcode.value;
		if (Rooms.find(roomcode).fetch().length > 0 && Rooms.find(roomcode).fetch()[0].gameStatus == null){
			Rooms.update({
				_id:roomcode
			},{
				$push: {players:this.props.userID}
			})
			Users.update({
				_id:this.props.userID,
			},{
				$set: {room:roomcode}
			})
		}
	}
}
