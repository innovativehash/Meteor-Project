
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students } from '../../../both/collections/api/students.js';

import '../../templates/mainMenu/signup.html';


/**
 * EVENTS
 */
Template.signup.events({
  
  'submit': ( e, t ) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let fname       = $('#fname').val() // OR e.target.fname.value
      , lname       = $('#lname').val()
      , email       = $('#email').val()
      , password    = $('#password').val()
      , company     = $('#company').val()
      , phone       = $('#phone').val()
      , university  = $('#university').val();

    Accounts.createUser({
      email:    email,
      password: password,
      username: fname + ' ' + lname
    }, ( error ) => {
      if ( error ) console.log( 'user creation error ' + error.reason );
      //DEBUG: console.log( 'in create uid ' + Meteor.userId() );
      
      /* create a new Student record with _id as user_id */
      Students.insert({ _id: Meteor.userId()});
    });

    Meteor.setTimeout( function(){ /*...*/ }, 2000 );

    FlowRouter.go( '/post-signup' );
  },
});