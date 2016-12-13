/*
 * @module adminAdvanced
 * 
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import '../../../public/bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css';

import { Students }    from '../../../both/collections/api/students.js';
import { Template }     from 'meteor/templating';


import '../../templates/admin/admin-advanced.html';


Template.adminAdvanced.onCreated(function(){
  //$("#cover").show();

  /*
   * BOOTSTRAP TOGGLE
   */
  $.getScript( '/bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js', function() {

    $( '#cr-on' ).bootstrapToggle();
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'ADVANCED:: bootstrap-toggle.min.js fail' );
  });
});


Template.adminAdvanced.onRendered(function(){
/*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
*/
});


/*
 * EVENTS
 */
Template.adminAdvanced.events({

  /*
   * #CREDIT-ON/OFF  ::(CHANGE)::
   */
  'change #cr-on'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();

    //let tog = $(e.currentTarget).prop('checked');
		//if ( tog ) {
		  // switched on
		  //let req_creds = t.$('.js-credits-required').val();
		  //Students.upsert({ company_id: Meteor.user().profile.company_id},{$set:{required_credits: req_creds}});
		  //Meteor.call('upsertCredits', Meteor.user().profile.company_id, req_creds);
		//}
//-------------------------------------------------------------------
  },


  /*
   * .ADVANCE-TIME-BUTTON BUTTON  ::(CLICK)::
   */
  'click .advance-time-button button'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();

    //console.log( t.$(e.currentTarget).data('value'))
		t.$( ".advance-time-button button:first-child" ).removeClass( 'active' );
		t.$( ".advance-time-button button:last-child" ).removeClass( 'active' );
		t.$( e.currentTarget ).toggleClass( 'active' );
//-------------------------------------------------------------------
  },


  /*
   * #RESET-IMAGE  ::(CLICK)::
   */
  'click .js-priv-url'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let purl = t.$( '.js-priv-url' ).val();
//-------------------------------------------------------------------
  },


  /*
   * .JS-ADVANCED-SAVE  ::(CLICK)::
   */
  'click .js-advanced-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let tog = $( '#cr-on' ).prop( 'checked' );

		if ( tog ) {
		  // switched on
		  let req_creds = t.$( '.js-credits-required' ).val()
		    , freq;

		  if ( t.$( ".advance-time-button button:first-child" ).hasClass( 'active' ) ) {
		    freq = t.$( ".advance-time-button button:first-child" ).data( 'value' );
		  } else if ( t.$( ".advance-time-button button:last-child" ).hasClass( 'active' ) ) {
		    freq = t.$( ".advance-time-button button:last-child" ).data( 'value' );
		  } else {
		    Bert.alert( 'Please select frequency:  Quarterly or Yearly.', 'danger' );
		    return;
		  }

		  Meteor.call( 'upsertCompany', Meteor.user().profile.company_id, freq, req_creds )
		  Meteor.call( 'upsertCredits', Meteor.user().profile.company_id, req_creds );
		}
    Bert.alert( 'Your information has been saved', 'success' );
  }

});