import { Meteor } from 'meteor/meteor';

import {Users} from '../imports/users.js'

import {Rooms} from '../imports/rooms.js'

Meteor.startup(() => {
//  Users.insert({id:"This is the first ID!"})
//  Rooms.insert({id:"This is a room I guess!"})


  	Meteor.methods({
      	StartButtonFunction(userInfo){
      		//The roles for the game
      		let roles = ["Mason","Mafia","Detective","Thief","Insomniac","Trickster","Mafia","Mason","Goon","Vigilante","Civilian","Mason","Mafia","Civilian","Mason","Civilian"]
      		//Finds the current room, and then room length; gets only as many roles as needed
			let room = Users.find({_id:userInfo}).fetch()[0].room
			let rolesToUse = roles.slice(0,Users.find({room:room}).fetch().length + 4)
			let sessionID = Math.floor(Math.random() * 1000000)
			Rooms.update({_id:room},{$set: {sessionID:sessionID,gameStatus:"night",timer:60,Hunter:null,Rob:null,Switch:null,Seer:null,activeRoles:[],middleRoles:[],rolesInGame:[...rolesToUse]}})
			//Shuffles the order of the roles
			var currentIndex = rolesToUse.length, temporaryValue, randomIndex;
			while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = rolesToUse[currentIndex];
		    rolesToUse[currentIndex] = rolesToUse[randomIndex];
		    rolesToUse[randomIndex] = temporaryValue;
		  	}
		  	let j = 0
		  	//Assigns the role to each player
		  	let users = Users.find({room:room}).fetch()
		  	for (let i = 0; i < users.length; i++){
		  		Users.update({_id:users[i]._id},{$set:{role:rolesToUse[i],newRole:rolesToUse[i]}})
		  		Rooms.update({_id:room},{$push:{activeRoles:rolesToUse[i]}})
		  		j = i
		  	}
		  	for (let k = j + 1; k < users.length + 4; k++){
		  		Rooms.update({_id:room},{$push:{middleRoles:rolesToUse[k]}})
		  	}
		  	//Updates each player to go the night phase
			Users.update({room:room},{$set: {gameStatus:"night"}},{multi:true})
			Meteor.call('CountDownNight',room,sessionID)
		},

		CountDownNight(room,sessionID){
			timer = 60;
			for (let i = timer; i >= 0; i--){
				Meteor.call('SetDelay',i,room,"day",timer,sessionID)
			}
		},

		CountDownDay(room,sessionID){
			timer = 300;
			for (let i = timer; i >= 0; i--){
				Meteor.call('SetDelay',i,room,"point",timer,sessionID)
			}
		},

		SetDelay(i,room,status,timer,sessionID) {
			Meteor.setTimeout(function(){
				if (Rooms.find({_id:room}).fetch()[0].sessionID == sessionID ){
					Rooms.update({_id:room},{$set:{timer:i}})
				}
				if (i == 0){
					Users.update({room:room},{$set: {gameStatus:status}},{multi:true})
					Rooms.update({_id:room},{$set:{gameStatus:status}})
				}
			},1000 + (1000 * (timer - i)))
			Meteor.setTimeout(function(){
				if (status == "day"){
					Meteor.call('CountDownDay',room,sessionID)
				}
			},1000 + (timer * 1000 + 50))
		},

		SetRoomTimers(room,time){
			Rooms.update({_id:room},{$set:{timer:time}})
		},

		ActivateHunter(room,name){
			Rooms.update({_id:room},{$set:{Hunter:name}})
		},

		SeerInformation(room,victim){
			if (victim != "middle"){
				let role = Users.find({room:room,name:victim}).fetch()[0].role
				Rooms.update({_id:room},{$set:{Seer:[victim,role]}})
			} else {
				let seerNumber1 = Math.floor(Math.random() * 4)
					let seerNumber2 = seerNumber1
					while (seerNumber2 == seerNumber1){
						seerNumber2 = Math.floor(Math.random() * 4)
					}
				let unusedRoles = Rooms.find({_id:room}).fetch()[0].middleRoles
				let role1 = unusedRoles[seerNumber1]
				let role2 = unusedRoles[seerNumber2]
				Rooms.update({_id:room},{$set:{Seer:["middle",role1,role2]}})
			}
		},

		RobInformation(room,robber,victim,stolenRole){
			Users.update({room:room,name:victim},{$set:{newRole:"Thief"}})
			Users.update({room:room,name:robber},{$set:{newRole:stolenRole}})
			Rooms.update({_id:room},{$set:{Rob:[robber,victim,stolenRole]}})
		},

		TroublemakeRoom(room,victim1,victim2,role1,role2){
			Rooms.update({_id:room},{$set:{Switch:[victim1,victim2,role1,role2]}})
		},

		TroublemakeUsers(room,victim1,victim2,role1,role2){
			newRole1 = Users.find({room:room,name:victim1}).fetch()[0].newRole
			newRole2 = Users.find({room:room,name:victim2}).fetch()[0].newRole
			Users.update({room:room,name:victim2},{$set:{newRole:newRole1}})
			Users.update({room:room,name:victim1},{$set:{newRole:newRole2}})
			Rooms.update({_id:room},{$set:{Switch:[victim1,victim2,newRole1,newRole2]}})
		},

		SetRoomValues(room, status){
			Users.update({room:room},{$set: {gameStatus:status}},{multi:true})
			Rooms.update({_id:room},{$set: {gameStatus:status}})
		},

		SetIndividualValue(user, status){
			Users.update({_id:user},{$set: {gameStatus:status}})
		},

		ResetRoom(room){
			Rooms.update({_id:room},{$set: {gameStatus:null,activeRoles:[]}})
		},

		LogoutUser(newUser){
			let userInfo = Users.find({_id:newUser}).fetch()[0]
			let userRoom = userInfo.room
			let userName = userInfo.name
			let userID = userInfo._id
			Users.remove({_id:newUser})
			Rooms.update({_id:userInfo.room},{$pull:{players:{$in:[userID]},playerNames:{$in:[userName]}}})
			let room = Rooms.find({_id:userRoom}).fetch()[0]
			if (room.players.length == 0){
				Rooms.remove({_id:userRoom}) 
			}
		}
    });
});