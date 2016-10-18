/*
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const Newsfeeds = new Mongo.Collection("newsfeeds");


Newsfeeds.allow({
  insert: function(){
    return true;
  },
  update: function( owner_id ){
    return true;
  },
  remove: function(id){
    return true;
  }
});

