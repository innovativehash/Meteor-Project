/**
 * ©2016-2017 Collective Innovation, Inc.
 */

////////////////////////////////////////////
// Dates stored as milliseconds
///////////////////////////////////////////


import { Mongo } from 'meteor/mongo';

export const Courses = new Mongo.Collection("courses");

Courses.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});
/*
Courses.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});
*/

let CoursesSchema = new SimpleSchema({
  'name': {
    type: String
  },
  'company_id': {
    type: [String]
  },
  'public': {
    type: Boolean
  },
  'icon': {
    type: String
  },
  'times_completed': {
    type: Number
  },
  'expiry': {
    type: Date
  },
  'credits': {
    type: Number
  },
  'date_added': {
    type: Date
  },
  'isArchived': {
    type: Boolean
  },
  'approved': {
    type: Boolean
  },
  'creator_type': {
    type: String
  },
  'creator_id': {
    type: String
  }
  
});

Courses.attachSchema( CoursesSchema );