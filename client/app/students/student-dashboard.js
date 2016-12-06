

import { Template }     from 'meteor/templating';
//import { ReactiveVar }  from 'meteor/reactive-var';

//import { Students }    from '../../../both/collections/api/students.js';

import '../../templates/student/student-dashboard.html';


/*
 * CREATED
 */
Template.studentDashboard.onCreated( function() {

  $("#cover").show();

});


/*
 * RENDERED
 */
Template.studentDashboard.onRendered( function(){
  
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
  
});