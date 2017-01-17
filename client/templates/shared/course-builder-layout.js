
import { Students  }    from '../../../both/collections/api/students.js';

import './course-builder-layout.html';



Template.courseBuilderLayout.helpers({

  avatar() {
    try {
      return Students.findOne({_id: Meteor.userId()}).avatar;
    } catch(e) {
      return;
    }
  },
  
});



Template.courseBuilderLayout.events({
  
 /*
   * #ACCOUNT-SETTINGS  ::(CLICK)::
   */
  'click #account-settings'( e, t ){
    
    console.log( 'cb-layout account-settings')
//-------------------------------------------------------------------
  },


  /*
   * #ACCOUNT-UPLOAD-PHOTO  ::(CLICK)::
   */
  'click #account-upload-photo'( e, t ){

    console.log( 'cb-layout account-upload-photo' );

    $( '#profile-modal' ).modal( 'show' );
//-------------------------------------------------------------------
  },


  /*
   * #LOGOUT  ::(CLICK)::
   */
  'click #logout': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Meteor.logout();
    FlowRouter.go( '/login' );
//-------------------------------------------------------------------
  },

  /*
   * #CB-DASHBOARD-PAGE
   *
   */
  'click #cb-dashboard-page'( e, t ) {
    e.preventDefault();
      
    if ( Meteor.user().roles.admin )
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
    if ( Meteor.user().roles.teacher )
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
  },
  
  
  /*
   * #CB-COURSES-PAGE
   *
   */
  'click #cb-courses-page'( e, t ) {
    e.preventDefault();
      
    if ( Meteor.user().roles.admin )
      FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
    if ( Meteor.user().roles.teacher )
      FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
  },
  
  
});