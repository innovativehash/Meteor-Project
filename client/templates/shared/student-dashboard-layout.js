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
import { Students }     from '../../../both/collections/api/students.js';
import { Companies }    from '../../../both/collections/api/companies.js';

import '../../templates/shared/student-dashboard-layout.html';



/**
 * CREATED
 */
Template.studentDashboardLayout.onCreated(function(){
  
  //$("#cover").show();
    
});


/**
 * RENDERED
 */
Template.studentDashboardLayout.onRendered(function(){
/* 
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  }); 
*/
});



/**
 * HELPERS
 */
Template.studentDashboardLayout.helpers({
  logoImage() {
    try {
      let id = Students.findOne({ _id: Meteor.userId() }).company_id;
      return Companies.findOne({ _id: id }).logo;
    } catch(e) {
      return;
    }
  },
/*
  name() {
   return Meteor.user() && Meteor.user().username;
  },
*/
  avatar() {
    try{
      return Students.findOne({_id: Meteor.userId()}).avatar;
    } catch(e) {
      return;
    }
  },
  
  fname() {
    try{
      return Students.findOne({_id: Meteor.userId()}).fname;
    } catch(e) {
      return;
    }
  },
 
  role() {
    try{
      return Meteor.user().roles[0];
    } catch(e) {
      return;
    }
  },
     
});


/**
 * EVENTS
 */
Template.studentDashboardLayout.events({

  'click #account-settings'( e, t ) {
    
  },
  
  'click #account-upload-photo'( e, t ){
    console.log('admin prof ul');
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
    
    FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });
  },


  'click #st-courses': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
  
    FlowRouter.go( 'student-courses', { _id: Meteor.userId() });
  }, 
  
  'click #st-request-credit': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'student-request-credit', { _id: Meteor.userId() });
  },
  
  'click #st-records': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
  
    FlowRouter.go( 'student-records', { _id: Meteor.userId() });
  },
  
  'click #st-training-calendar': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'student-training-calendar', { _id: Meteor.userId() });
  }
  
});