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
  insert: () => false,
  update: () => false,
  remove: () => false
});

Tests.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/

let TestsSchema = new SimpleSchema({
  'company_id': {
    type: String
  },
  'test_name': {
    type: String
  },
  'total_questions': {
    type: Number
  },
  'questions.$.question_num': {
    type: Number
  },
  'questions.$.question': {
    type: String
  },
  'questions.$.answers': {
    type: [String],
    optional: true
  },
  'questions.$.num_answers': {
    type: Number
  },
  'questions.$.correct_answer': {
    type: String
  },
  'questions.$.question_type': {
    type: String
  }
  
});

Tests.attachSchema( TestsSchema );