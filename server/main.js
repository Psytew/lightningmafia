import { Meteor } from 'meteor/meteor';

import {Users} from '../imports/users.js'

import {Rooms} from '../imports/rooms.js'

Meteor.startup(() => {
//  Users.insert({id:"This is the first ID!"})
//  Rooms.insert({id:"This is a room I guess!"})

  console.log(Users.find().fetch());
  console.log("Hi!")

  	Meteor.methods({
      	StartButtonFunction(userInfo){
      		//The roles for the game
      		let roles = ["Villager","Werewolf","Seer","Robber","Bodyguard","Troublemaker","Werewolf","Mason","Mason","Minion","Civilian","Mason"]
      		//Finds the current room, and then room length; gets only as many roles as needed
			let room = Users.find({_id:userInfo}).fetch()[0].room
			let rolesToUse = roles.slice(0,Users.find({room:room}).fetch().length + 2)
			//Shuffles the order of the roles
			var currentIndex = rolesToUse.length, temporaryValue, randomIndex;
			while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = rolesToUse[currentIndex];
		    rolesToUse[currentIndex] = rolesToUse[randomIndex];
		    rolesToUse[randomIndex] = temporaryValue;
		  	}
		  	//Assigns the role to each player
		  	let users = Users.find({room:room}).fetch()
		  	for (let i = 0; i < users.length; i++){
		  		Users.update({_id:users[i]._id},{$set:{role:rolesToUse[i]}})
		  	}
		  	//Updates each player to go the night phase
			Users.update({room:room},{$set: {gameStatus:"night"}},{multi:true})
		}
    });
});