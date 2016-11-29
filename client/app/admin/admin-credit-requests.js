
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Students }     from '../../../both/collections/api/students.js';

//import '../../../public/bower_components/bootstrap3-dialog/dist/css/bootstrap-dialog.min.css';

import '../../templates/admin/admin-credit-requests.html';;


/**
 * CREATED
 */
Template.adminCreditRequests.onCreated( function() {

  //$('#cover').show();

  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('AdminCreditRequest:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'AdminCreditRequest:: bootstrap-dialog.min.js load fail' );
  });
});


/**
 * RENDERED
 */
Template.adminCreditRequests.onRendered(function(){
/*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
*/
});


/*
 * HELPERS
 */
Template.adminCreditRequests.helpers({

  requests: () =>
    Newsfeeds.find({ type: "CR", company_id: Meteor.user().profile.company_id }).fetch()

});


/*
 * EVENTS
 */
Template.adminCreditRequests.events({

  /*
   * .DISAPPROVE  ::(CLICK)::
   */
  'click .disapprove'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //TODO:  SEND PRIVATE MESSAGE TO STUDENT | GET REASON FROM ADMIN
    let record = t.$( '.disapprove' ).data( "id" );
    Newsfeeds.remove({ _id: record });
//-------------------------------------------------------------------
  },


  /*
   * .APPROVE  ::(CLICK)::
   */
  'click .approve'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let student   = t.$( ".approve" ).data( "student" );
    let recordId  = t.$( ".approve" ).data( "id" );
    let option    = t.$( '.approve' ).data( "option" );

    let cur_cred  = Students.findOne({ _id: student }).current_credits;

    BootstrapDialog.show({
      title: "Approve Student Credit",
      message:   $( '<p>How many credits would you like to award?</p><input id="credits" placeholder="credits..">' ),
      buttons: [{
              label: 'Ok',
              cssClass: 'btn-success',
              action: function( dialog ) {
                  let credits     = parseInt( $( '#credits' ).val().trim() );
                  let tot_credits = credits + cur_cred;

                  Students.update({ _id: student},
                                  {
                                    $set: { current_credits: tot_credits },
                                    $inc: { compl_courses_cnt: 1 },
                                    $push:{ approved_courses: { course:option, credits:credits, date: new Date() }}
                                  });

                  Newsfeeds.remove({ _id: recordId });

                  dialog.close();

                  Meteor.setTimeout(function() {
                    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
                  }, 1500);
              }
      }]
    });
//-------------------------------------------------------------------
  },

});
