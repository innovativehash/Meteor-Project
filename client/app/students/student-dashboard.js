/*
 * @module studentDashboard
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }   from 'meteor/templating';
//import { ReactiveVar }  from 'meteor/reactive-var';

import { Students }   from '../../../both/collections/api/students.js';
import { Events }     from '../../../both/collections/api/events.js';

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

Template.studentDashboard.helpers({
  
  teacherSticky() {
    if ( Meteor.user() && Meteor.user().roles && Meteor.user().roles.teacher ) {
      let cnt = Events.find( {end: {$lte: new Date()} }).count();
      if ( cnt > 0 )
        return true;
    }
  },
  
  
  tsData() {
      let evt     = Events.find( {end: {$lte: new Date()} }).fetch();
      
      for( let i = 0, len = evt.length; i < len; i++ ) { //each event
        evt[i].dateEnding = moment( evt[i].end ).format('M-D-Y'); // add formatted ending date
        for( let j = 0, jlen = evt[i].students.length; j < jlen; j++ ) { //students in this event
          let s = Students.findOne({ _id: evt[i].students[j] }).fullName //get name from student id
          evt[i].ary = [];                // add an array to the array of objs
          evt[i].ary[j] = {};             // add an object to that array
          evt[i].ary[j].studentName = s;  // assign values to that object
          evt[i].ary[j].num = j;
          evt[i].ary[j].id = evt[i].students[j];
        }
      }
    return evt;
  },
  
});


Template.studentDashboard.events({
  
  'click #teacher-credit-submit'( e, t ) {
    e.preventDefault();
    
    //console.log( $('#tcb-0').is(':checked') );
    
    let cnt = Events.find( {end: {$lte: new Date()} }).count();
    let evt = Events.find( {end: {$lte: new Date()} }).fetch();
    let credits = $( '#teacher-assigned-credits' ).val();
    
    for( let i = 0; i < cnt; i++ ) {
      if( $( `#tcb-${i}` ).is(':checked') ) {  //tcb-0, tcb-1, ...
        let ii = $( `#tcb-${i}` ).data('id');

        Students.update({ _id: ii }, 
                        { 
                          $pull: {current_trainings:{link_id: evt[i]._id }},
                          $push: {completed_trainings:{title: evt[i].title, credits: credits, date_completed: new Date() }}, 
                          $inc: { current_credits: credits }
                        });
        Events.remove({ _id: evt[i]._id });
      }
    }
    
    
  },
  
});