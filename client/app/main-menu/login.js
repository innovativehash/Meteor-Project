

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

    //e.target.email.value
    var email     = $('#email').val();
    //e.target.password.value
    var password  = $('#password').val();
    
    
    Meteor.loginWithPassword( email, password, (error) => {

      //console.log( 'login with pw uid & roles ' + Meteor.userId() + ' ' + Meteor.user().roles[0]) /* DEBUG */
      if ( error ) {
        console.log( 'log in error ' + error );
      } else {

        
        if ( Meteor.user().roles.admin ) {
          FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
          
        } else if ( Meteor.user().roles.student || 
                    Meteor.user().roles.teacher ) {
            FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });
        }
      }
    });
  },
  
});

