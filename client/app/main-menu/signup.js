
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students } from '../../../both/collections/api/students.js';
import { Companies } from '../../../both/collections/api/companies.js';

import '../../templates/mainMenu/signup.html';


/*
 * EVENTS
 */
Template.signup.events({
  
  /*
   * SUBMIT
   */
  'submit': ( e, t ) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let fname       = $('#fname').val() // OR e.target.fname.value
      , lname       = $('#lname').val()
      , email       = $('#email').val()
      , password    = $('#password').val()
      , company     = $('#company').val()
      , phone       = $('#phone').val()
      , university  = $('#university').val()
      , text
      , opt
      , dept
      , company_id;;

    dept  = 'admin';
    opt   = 'admin';
    
    // ALL FIELDS MUST BE FILLED OUT OR ERROR
    
    Meteor.call( 'insertCompanyReturnId', company, '#37ACE9', "data:image/png;base64,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", function(error, result){
      company_id = result;
    });
/*
    Meteor.setTimeout(function() {
      company_id = Companies.findOne({ name: company })._id;  //don't allow duplicate companies
    }, 200);
*/  
    
    Meteor.setTimeout(function(){
      Meteor.call('addUser', email, password, fname, lname, opt, dept, company, company_id);      
    }, 400);

    FlowRouter.go( '/post-signup' );
//-------------------------------------------------------------------
  },
});