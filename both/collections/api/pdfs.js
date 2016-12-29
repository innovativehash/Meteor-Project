/*
 * ©2016-2017 Collective Innovation, Inc.
 */

import { Mongo } from 'meteor/mongo';

export const Pdfs = new Mongo.Collection("pdfs");

/*
Diplomas.allow({
  insert: function(){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
*/
