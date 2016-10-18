

import { Template }     from 'meteor/templating';
//import { ReactiveVar }  from 'meteor/reactive-var';

//import { Students }    from '../../../both/collections/api/students.js';

import '../../templates/student/student-dashboard.html';


/**
 * CREATED
 */
Template.studentDashboard.onCreated( function() {

  $("#cover").show();
/*
  $.getScript('/js/bootstrap-select.min.js', function() {
    //console.log('studentDashboard:: bootstrap-select.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'studentDashboard:: load bootstrap-select.min.js failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
*/
});


/**
 * RENDERED
 */
Template.studentDashboard.onRendered( function(){
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
});