/*
 * @module testView
 *
 * @programmer Nicholas Sardo <nsardo@aol.com>
 * @copyright 2016-2017 Collective Innovations
 */
 
import { Template }       from 'meteor/templating';

import { Students }       from '../../../both/collections/api/students.js';
import { Courses  }       from '../../../both/collections/api/courses.js';
import { Tests    }       from '../../../both/collections/api/tests.js'
import { Scratch }        from '../../../both/collections/api/scratch.js';

import '../../templates/student/test-view.html';

let id;


Template.testView.onCreated(function(){
    
});



Template.testView.onRendered(function(){

});



Template.testView.helpers({
  
  test() {

    id = Scratch.findOne({});
    try{
      return Tests.findOne({ _id: id.id });
    } catch(e) {
      return;
    }
  }
  
});

Template.testView.events({

  /*
   * #SUBMIT-ANSWERS  ::(CLICK)::
   */
  'click #submit-answers'( e, t ){
    
    let cid             = FlowRouter.getQueryParam( "course" )
      , c               = Courses.find({ _id: cid}).fetch()[0]
      , credits         = c.credits
      , passing_percent = c.passing_percent
      , name            = c.name;
    
    /*
      LEGEND:
      |----------------------------------------------------------------------|
      | #tot_q   | total_questions ex:8, eg 1-8                              |
      | #q-x     | question_number                                           |
      | #a-x     | correct_answer                                            |
      | #qt-x    | question_type                                             |
      | #na-x    | num_answers (multiple-choice questions)                   |
      | #q-x     | input[name="tfradio"]:checked  (T/F  ans selected)        |
      | #q-x     | input[name="mcradio"]:checked  (mult-choice ans selected) |
      |----------------------------------------------------------------------|
    */

    let total_questions = Number( $( '#tot_q' ).val() );
    let total_score     = 0;
    for ( let i = 1; i <= total_questions; i++ ) {
      total_score += Number( getAnswer( i ) );
    }
    
    let percent = Number( total_score / total_questions ) * 100;
    $( '#yosco' ).show();
    
//TODO:  GET CORRECT ANS PERCENTAGE FOR THIS TEST AND USE IT

    if ( percent >= passing_percent ) {
      $( '#score' ).addClass( 'label-success' );
      $( '#score' ).text( percent + '%' );
      Meteor.setTimeout(function(){
        Meteor.call( 'courseCompletionUpdate', name, cid, percent, credits );
      }, 300);
      
      Bert.alert( 'Congradulations!! You passed the test.', 'success', 'fixed-top' );
    } else {
      $( '#score' ).addClass( 'label-danger' );
      $( '#score' ).text( percent + '%' );
      Bert.alert( 'Sorry, you failed to earn the minimum score to pass', 'danger', 'fixed-top' );
    }

    $( '#submit-answers' ).prop( 'disabled', true );
    
    Scratch.remove();
    
    Meteor.setTimeout(function(){
      if ( Meteor.user().roles.admin ) {
          FlowRouter.go('admin-dashboard',{ _id: Meteor.userId()});
      } else if( Meteor.user().roles.teacher ) {
          FlowRouter.go('teacher-dashboard',{ _id: Meteor.userId()});
      } else if( Meteor.user().roles.student ) {
          FlowRouter.go('student-dashboard',{ _id: Meteor.userId()});
      }
    }, 1500);
  }
});


function getAnswer( qnum ) {
  
  //WHAT KIND OF QUESTION WAS ASKED?
  let q_type = $( `#qt-${qnum}` ).val();
  
  //WHAT IS THE CORRECT ANSWER?
  let correct_ans = $( `#a-${qnum}` ).val();
  
  let stud_ans;
  
  //WHAT WAS THE STUDENT'S ANSWER?
  if ( q_type == 'tf' ) {         //T/F TYPE QUESTION
    stud_ans = $( `#q-${qnum} input[name="tfradio-${qnum}"]:checked` ).val();
    
  } else if ( q_type == 'mc' ) {  //MC TYPE QUESTION
    stud_ans = $( `#q-${qnum} input[name="mcradio-${qnum}"]:checked` ).val();
  }
  
  if ( stud_ans == correct_ans ) {
    return 1;
  } else {
    return 0;
  }
  
}