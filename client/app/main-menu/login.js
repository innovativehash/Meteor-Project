/*
 * @module login
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students }   from '../../../both/collections/api/students.js';

import '../../templates/mainMenu/login.html';


/*
 * EVENTS
 */
Template.login.events({
  
  'submit form': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //e.target.email.value
    var email     = $( '#email' ).val();
    //e.target.password.value
    var password  = $( '#password' ).val();

    Meteor.logoutOtherClients();
    
    Meteor.loginWithPassword( email, password, ( error ) => {
      let s = Students.find({ _id: Meteor.userId() }).fetch()[0];
      
      //console.log( 'login with pw uid & roles ' + Meteor.userId() + ' ' + Meteor.user().roles[0]) /* DEBUG */
      if ( error ) {
        console.log( 'log in error ' + error );
        Bert.alert( 'Please provide a valid Account Email and Password!', 'danger', 'fixed-top', 'fa-frown-o' );  
      } else {

        if ( s.freeze == true ) {
          Meteor.logout();
          Bert.alert('Your Account has been Frozen', 'danger' );
          return;
          //FlowRouter.go( '/account-frozen' );
        } else if ( s.expires /*LOGIC FROM INTERNAL TRAINING */ ) {
          Meteor.logout();
          Bert.alert('Your Account has Expired', 'danger' );
          return;
        } else if ( Meteor.user().roles.admin || Meteor.user().roles.SuperAdmin ) {
          FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
      
        } else if ( Meteor.user().roles.student ) {
            FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });
            
        } else if ( Meteor.user().roles.teacher ) {
          FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
        }
      }
    });
  },

});

