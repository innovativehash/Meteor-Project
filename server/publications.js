/*
 * (c)2016 Collective Innovations, Inc.
 */
import { Comments }     from '../both/collections/api/comments.js';
import { Students }     from '../both/collections/api/students.js';

Meteor.publish("userRoles", function() {
  if ( this.userId ) {
    return Meteor.users.find({ _id: this.userId}, {fields: {roles: 1}});
  } else {
    this.ready();
  }
});

Meteor.publish("userEmail", function() {
  return Meteor.users.findOne({_id: id}, {fields:{emails: 1}});
});

Meteor.publish("deleteComments", function(o_id){
  return Comments.remove({ owner_id: o_id });
});

Meteor.publish("company_id", function( id ){
  new SimpleSchema({
    id: {type: String}
  }).validate({ id });
  return Students.find({ _id: id},{fields:{company_id:1}} );
});