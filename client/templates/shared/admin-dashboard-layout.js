
import '../../../public/css/bootstrap-select.min.css';
import '../../../public/css/normalize.css';
import '../../../public/css/common.css';
import '../../../public/css/style.css';
import '../../../public/css/responsive.css';
//import '../../../public/css/select2.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.structure.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.theme.min.css';

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Students  }    from '../../../both/collections/api/students.js';
import { Companies }    from '../../../both/collections/api/companies.js';

import '../../templates/shared/admin-dashboard-layout.html';


/**
 * CREATED
 */
Template.adminDashboardLayout.onCreated(function(){

  $("#cover").show();

  //   Tracker.autorun( function(){
//     this.subscribe("company_id", Meteor.userId());
//   });
});


/**
 * RENDERED
 */
Template.adminDashboardLayout.onRendered(function(){

  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });

});



/**
 * HELPERS
 */
Template.adminDashboardLayout.helpers({

  company() {
    try {
      let id = Students.findOne({_id: Meteor.userId() }).company_id;
      return Companies.find({ _id: id }).fetch()[0];
    } catch(e) {
      return;
    }
  },

  students() {
    try {
     return Students.find().fetch();
    } catch(e) {
      return;
    }
  },

  avatar() {
    try {
      return Students.findOne({_id: Meteor.userId()}).avatar;
    } catch(e) {
      return;
    }
  },

  fname() {
    try {
      return Students.findOne({_id: Meteor.userId()}).fname;
    } catch(e){
      return;
    }
  },

  role() {
    return Meteor.user().roles[0];
  },

});


/**
 * EVENTS
 */
Template.adminDashboardLayout.events({

  'click #account-settings'( e, t ){

  },

  'click #account-upload-photo'( e, t ){
    $('#profile-modal').modal('show');
  },

  'click #logout': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Meteor.logout();
    FlowRouter.go( '/login' );
  },

  'click #logo-click': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() } );
  },

  'click #admin-courses': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-courses', { _id: Meteor.userId() } );
  },

  'click #admin-students': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-students', { _id: Meteor.userId() } );
  },

  'click #admin-degrees': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() } );
  },

  'click #admin-assignCourses': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-assign-courses', { _id: Meteor.userId() } );
  },

  'click #admin-analytics': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-analytics', { _id: Meteor.userId() } );
  },

  'click #admin-design': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-design', { _id: Meteor.userId() } );
  },

  'click #admin-advanced': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-advanced', { _id: Meteor.userId() } );
  }
});


