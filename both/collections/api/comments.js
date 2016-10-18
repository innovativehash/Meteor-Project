
/*
 * ©2016-2017 Collective Innovation, Inc.
 */
 
import { Mongo } from 'meteor/mongo';

export const Comments = new Mongo.Collection("comments");

Comments.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(o_id){
    return true;
  }
});
