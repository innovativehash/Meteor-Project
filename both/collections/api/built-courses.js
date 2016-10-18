/**
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const BuiltCourses = new Mongo.Collection("builtCourses");

BuiltCourses.allow({
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

