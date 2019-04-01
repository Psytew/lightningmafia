import { Meteor } from 'meteor/meteor';

import {Users} from '../imports/users.js'

import {Rooms} from '../imports/rooms.js'

Meteor.startup(() => {
//  Users.insert({id:"This is the first ID!"})
//  Rooms.insert({id:"This is a room I guess!"})

  console.log(Users.find().fetch());
  console.log("Hi!")
});