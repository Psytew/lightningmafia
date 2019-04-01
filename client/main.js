import React from 'react'
import ReactDOM from 'react-dom'
import {Meteor} from 'meteor/meteor'
import {Tracker} from 'meteor/tracker'
import './main.html';

import App from "../imports/ui/App.js"

import {Users} from '../imports/users.js'

Meteor.startup( () => {
	let newID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
	newUser = Users.insert({id:newID})
	console.log(newUser)
	console.log(Users.find({_id:newUser}).fetch())

	Tracker.autorun(function(){
		ReactDOM.render(<App userID={newUser} />, document.getElementById("app"));
	})

	$(window).bind('beforeunload', function() {
        closingWindow(newUser);
    });
});

closingWindow = function(newUser){
	Users.remove({_id:newUser})
}