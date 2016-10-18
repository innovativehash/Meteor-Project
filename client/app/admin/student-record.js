

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

//import { Blaze } from 'meteor/blaze'

import { Courses }     from '../../../both/collections/api/courses.js';
import { Students }    from '../../../both/collections/api/students.js';

import '../../templates/admin/student-record.html';


/**
 * CREATED
 */
Template.studentRecord.onCreated( function() {
  $('#cover').show();

  //this.cur_cor = new ReactiveArray([]);
  //this.cor_com = new ReactiveArray([]);
});



/**
 * RENDERED
 */
Template.studentRecord.onRendered( function() {
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });

  //Tracker.autorun( function(){
    //Session.set( 'showPostBox', true );
    //Session.set( 'showNewsfeed', true );
  //});
 
});



/**
 * HELPERS
 */
Template.studentRecord.helpers({
  
  name: () =>
    Meteor.users.findOne({ _id: FlowRouter.getParam("_id") }, { username:1 }).username,
  
  email() {
    console.log( Meteor.users.findOne({_id: FlowRouter.getParam("_id") }).emails.address );
    return Meteor.users.findOne({_id: FlowRouter.getParam("_id")}).emails.address;
  },
  
  current_credits() {
    try {
      return Students.find({_id: FlowRouter.getParam("_id") } ).fetch()[0].current_credits;
    } catch (e) {
      return;
    }
  },
 
  required_credits() {
    try {
      let req     = Students.find({ _id: FlowRouter.getParam("_id") } ).fetch()[0];
      let current = Students.findOne({_id: FlowRouter.getParam("_id") }, { current_credits:1 } );
      return req.required_credits - current.current_credits;
    } catch (e) {
      return;
      //console.log( 'err ' + e );
    }
  },

  current_courses() {
    try {
      let c   = ( Students.find( {_id: FlowRouter.getParam("_id")}, {}).fetch()[0].current_courses );
      let lim = c.length;
      for ( let i=0; i<lim; i++ ) {
        c[i].date_started = moment(c[i].started_date).format('M-D-Y');
      }
      return c;
    } catch (e) {
      return;
    }
  },
  
  completed_courses() {
    try {
      let c   = ( Students.find( {_id: FlowRouter.getParam("_id")}, {}).fetch()[0].courses_completed );
      var lim = c.length;
      for( let i=0; i<lim; i++ ) {
        c[i].date_completed = moment(c[i].date_completed).format('M-D-Y');
      }
      return c;
    } catch (e) {
      return;
    }
  },

  certificates() {
    try {
      var certs = Students.find({ _id: FlowRouter.getParam("_id") }).fetch()[0].certifications;
      var len   = certs.length;
      for( let i = 0; i < len; i++ ) {
        certs[i].date_completed = moment(certs[i].date_completed).format('M-D-Y');
        certs[i].expiry         = moment(certs[i].expiry).format('M-D-Y')
      }
      return certs;
    } catch (e) {
      return;
    }
  },

  degrees() {
    try {
      return Students.find({ _id: FlowRouter.getParam("_id") }).fetch()[0].degrees;
    } catch (e) {
      return;
    }
  }
});



/**
 * EVENTS
 */
Template.studentRecord.events({
  
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
  },
  
  'click #students-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'admin-students', { _id: Meteor.userId() });
  },
});