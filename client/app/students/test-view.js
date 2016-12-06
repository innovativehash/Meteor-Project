
import { Template }       from 'meteor/templating';

import { Students }       from '../../../both/collections/api/students.js';
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
    /*
      #tot_q   total_questions ex:8, eg 1-8
      #q-x     question_number
      #a-x     correct_answer
      #qt-x    question_type
      #na-x    num_answers (multiple-choice questions)
      #q-x     input[name="tfradio"]:checked  (true/false  ans selected)
      #q-x     input[name="mcradio"]:checked  (mult-choice ans selected)
    */

    let total_questions = Number( $('#tot_q').val() );
    let total_score     = 0;
    for ( let i = 1; i <= total_questions; i++ ) {
      total_score += Number( getAnswer( i ) );
    }
    
    console.log( total_score + '/' + total_questions );
    console.log( 'percentage: ' + total_score / total_questions );
    let percent = Number( total_score / total_questions ) * 100;
    $('#yosco').show();
    if ( percent >= 75 ) {
      $('#score').addClass('label-success');
    } else {
      $('#score').addClass('label-danger');
    }
    $('#score').text( percent + '%' );
    
    $('#submit-answers').prop('disabled', true);
    
    Scratch.remove({ _id: id._id });
  }
});

function getAnswer( qnum ) {
  //what kind of question was asked?
  let q_type = $( `#qt-${qnum}` ).val();
  
  //what is the correct answer?
  let correct_ans = $( `#a-${qnum}` ).val();
  
  let stud_ans;
  //what was students answer?
  if ( q_type == 'tf' ) {
    stud_ans = $( `#q-${qnum} input[name="tfradio-${qnum}"]:checked` ).val();
  } else if ( q_type == 'mc' ) {
    stud_ans = $( `#q-${qnum} input[name="mcradio-${qnum}"]:checked` ).val();
  }
  
  if ( stud_ans == correct_ans) {
    return 1;
  } else {
    return 0;
  }
  
}