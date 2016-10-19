

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import '../../templates/mainMenu/login.html';


/*
 * EVENTS
 */
Template.login.events({
  'submit form': function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();


    var email     = $('#email').val(); //e.target.email.value (name)
    var password  = $('#password').val();

    Meteor.loginWithPassword( email, password, (error) => {

      //console.log( 'login with pw uid & roles ' + Meteor.userId() + ' ' + Meteor.user().roles[0]) /* DEBUG */
      if ( error ) {
        console.log( 'log in error ' + error.reason );
        console.log( error );
      } else {
        if ( Meteor.user().roles.admin ) {
          FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
        } else if ( Meteor.user().roles.student ) {
          FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });
        }
      }
    } );
  }
});

