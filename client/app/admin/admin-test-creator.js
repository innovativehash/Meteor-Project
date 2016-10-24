
import { Tests }     from '../../../both/collections/api/tests.js';

import '../../templates/admin/admin-test-creator.html';


let testidnum;

/*
 * CREATED
 */
Template.adminTestCreator.onCreated(function(){
/* 
  $('#cover').show();
*/  
});


/*
 * RENDERED
 */
Template.adminTestCreator.onRendered(function(){
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
Template.adminTestCreator.events({

  /*
   * CLICK #TEST-GO-HOME
   */
  'click #test-go-home'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();

    //todo: if a test hasn't been saved, remove() the _id

    FlowRouter.go('admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * CLICK .JS-TEST-COMPLETE
   */
  'click .js-test-complete'( e, t ){
    let lastId      = t.$('div#ans-mc input:last').attr('id');
    //clear out added dom elements
    if ( lastId != 'C' ){
      for( let i = 3; i <= spread; i++ ){
        t.$('#lab' + String.fromCharCode( i + 65)).remove();
        t.$('#'    + String.fromCharCode( i + 65)).remove();
        t.$('#opt' + String.fromCharCode( i + 65)).remove();
      }
    }
    t.$('[name="qnum"]').val('');
    t.$('#test-name').attr('readonly', false );
    t.$('#test-name').val('');
    t.$('#question').val('');

    if ( ! t.$('#ans-tf').hasClass('hide') )
      t.$('#ans-tf').addClass('hide');

    if ( ! t.$('#ans-mc').hasClass('hide') )
      t.$('#ans-mc').addClass('hide');
//-------------------------------------------------------------------
  },


  /*
   * BLUR #TEST-NAME
   */
  'blur #test-name'( e, t ){
      Tests.insert({
        test_name: t.$('#test-name').val()
      });

      Meteor.setTimeout(function(){
        let testName  = t.$('#test-name').val();
        testidnum     = Tests.findOne({ test_name: testName })._id;
      }, 200);

      t.$('#test-name').attr('readonly', true);
//-------------------------------------------------------------------
  },


  /*
   * CLICK #TF
   */
  'click #tf'( e, t ) {
    
    t.$('#ans-tf').removeClass('hide');
    t.$('#ans-mc').addClass('hide');
//-------------------------------------------------------------------
  },


  /*
   * CLICK #MC
   */
  'click #mc'( e, t ){

    t.$('#ans-mc').removeClass('hide');
    t.$('#ans-tf').addClass('hide');
//-------------------------------------------------------------------
  },


  /*
   * CLICK #MC-SUBMIT
   */
  'click #mc-submit'( e, t ){
    
    let answers   = [];
    //test name
    let nm  = t.$('#test-name').val();
    //question
    let q           = t.$('#question').val();
    //correct answer
    let correct_a   = $('#correct_ans').val();
    //id of last multiple choice answer
    let lastId      = t.$('div#ans-mc input:last').attr('id');
    //converted to ascii code
    let lastIdAscii = lastId.charCodeAt(0);
    //compute end of answers
    let spread      = lastIdAscii - 65; // 0 = 65, 1 = 66, 2 = 67, etc.
    //serialize
    for( let i = 0; i <= spread; i++ ){
      answers[i] = t.$('#' + String.fromCharCode( i + 65 )).val();
    }
    //clear out added dom elements
    if ( lastId != 'C' ){
      for( let i = 3; i <= spread; i++ ){
        t.$('#lab' + String.fromCharCode( i + 65)).remove();
        t.$('#'    + String.fromCharCode( i + 65)).remove();
        t.$('#opt' + String.fromCharCode( i + 65)).remove();
        t.$('#question').val('');
      }
    }

    //current question number
    let questionNum    =  t.$('[name="qnum"]').val();
    let currentQuestionNumber = questionNum;
    //bump question number to next
    Number(questionNum++);
    t.$('[name="qnum"]').val(questionNum);

    Tests.update({ _id: testidnum}, {$addToSet:{ questions: {
      question_num:currentQuestionNumber, question: q, answers: answers, correct_answer: correct_a, question_type: 'mc'}}}
    );
    
    t.$('#ans-mc').addClass('hide');
//-------------------------------------------------------------------
  },


  /*
   * CLICK #TF-SUBMIT
   */
  'click #tf-submit'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();

    //question
    let q                     = t.$('#question').val();
    let questionNum           = t.$('[name="qnum"]').val();
    let currentQuestionNumber = questionNum;
    let correct_a             = t.$('input[name="optradio"]:checked').val();

    //advance question number
    Number(questionNum++);
    //and set it
    t.$('[name="qnum"]').val(questionNum);  

    Tests.update({ _id: testidnum}, {$addToSet:{ questions: {
      question_num:currentQuestionNumber, question: q, correct_answer: correct_a, question_type: 'tf'}}}
    );

    //clean up the ui
    t.$('.js-tf').prop('checked', false);
    t.$('#question').val('');
    t.$('#ans-tf').addClass('hide');  
//-------------------------------------------------------------------
  },



  /*
   * CLICK #PLUS
   */
  'click #plus'( e, t ){

    //what is the last questions letter?
    let lastLetter = t.$(e.currentTarget).closest().context.previousElementSibling.innerText.charCodeAt(0);
    
    //add one makes it the next highest character, i.e. A(65) + 1 = B(66)
    lastLetter += 1;
    
    //convert ascii number back into character, i.e 65 = A
    nextChar   = String.fromCharCode(lastLetter);
    //create new multiple choice answer 
    t.$(e.currentTarget).before('<label id="lab' + nextChar + '">' + nextChar +
                                '<input id="'        + nextChar +
                                '"' + 'type="text" class="form-control" placeholder="enter answer...">' +
                                '</label>');
    //create new multiple choice correct answer <option>
    let opt       = document.createElement('option');
    opt.value     = nextChar;
    opt.setAttribute('id', 'opt' + nextChar );
    opt.innerHTML = nextChar;
    document.getElementById('correct_ans').appendChild(opt);
//-------------------------------------------------------------------
  },
  
});
