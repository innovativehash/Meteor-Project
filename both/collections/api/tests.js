/**
 * ©2016-2017 Collective Innovation, Inc.
 */


import { Mongo } from 'meteor/mongo';


/*
 * company_id
 * test_name
 * questions: [ 
 *  {question, answers[] }
 * ]
*/

export const Tests = new Mongo.Collection("tests");

/*
Tests.allow({
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
