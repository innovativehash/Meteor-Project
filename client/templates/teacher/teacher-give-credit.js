/*
 * @module teacherGiveCredit
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Students }   from '../../../both/collections/api/students.js';
import { Events }     from '../../../both/collections/api/events.js';

import './teacher-give-credit.html';



Template.teacherGiveCredit.onCreated(function(){

  $.getScript( '/js/select2.min.js', function() {
    $(document).ready(function(){			
		  $( ".js-teacher-add-students" ).select2({
			  placeholder: ""
	    });	
    });
    //console.log('teacherGiveCredit:: select2.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'teacherGiveCredit:: load select2.js fail' );
  });  
  
});



Template.teacherGiveCredit.helpers({

  tsData() {
      let evt     = Events.find( { end: { $lte: new Date()} }).fetch();

      for( let i = 0, len = evt.length; i < len; i++ ) {                  //each event
        evt[i].dateEnding = moment( evt[i].end ).format( 'M-D-Y' );       // add formatted ending date
        for( let j = 0, jlen = evt[i].students.length; j < jlen; j++ ) {  //students in this event
          let s = Students.findOne({ _id: evt[i].students[j] }).fullName  //get name from student id
          evt[i].ary    = [];             // add an array to the array of objs
          evt[i].ary[j] = {};             // add an object to that array
          evt[i].ary[j].studentName = s;  // assign values to that object
          evt[i].ary[j].num         = j;
          evt[i].ary[j].id          = evt[i].students[j];
        }
      }
    return evt;
  },
  
});


Template.teacherGiveCredit.events({

  'click #teacher-credit-submit'( e, t ) {
    e.preventDefault();
    
    //console.log( $('#tcb-0').is(':checked') );
    
    let cnt = Events.find( { end: { $lte: new Date()} }).count();
    let evt = Events.find( { end: { $lte: new Date()} }).fetch();
    let credits = 2;
    
    
    for( let i = 0; i < cnt; i++ ) {
      if( $( `#tcb-${i}` ).is( ':checked' ) ) {  //tcb-0, tcb-1, ...
        let ii = $( `#tcb-${i}` ).data( 'id' );

        Students.update({ _id: ii }, 
                        { 
                          $pull: { current_trainings:{ link_id: evt[i]._id } },
                          $push: { completed_trainings:{ title: evt[i].title, credits: credits, date_completed: new Date() }}, 
                          $inc:  { current_credits: credits }
                        });
                        
        Events.remove({ _id: evt[i]._id });
      }
    }
    
  },
  
  
  'click #teacher-credit-cancel'( e, t ) {
    e.preventDefault();
    
    let id = t.$( '#teacher-credit-cancel' ).data( 'id' );
    
    Meteor.call( 'removeEvent', id );
  },
});