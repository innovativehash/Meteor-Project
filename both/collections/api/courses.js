/**
 * ©2016-2017 Collective Innovation, Inc.
 */

////////////////////////////////////////////
// Dates stored as milliseconds
///////////////////////////////////////////


import { Mongo } from 'meteor/mongo';

export const Courses = new Mongo.Collection("courses");

Courses.allow({
  insert: function(id, q){
    return true;
  },
  update: function(id, q){
    return true;
  },
  remove: function(id){
    return true;
  }
  
});

