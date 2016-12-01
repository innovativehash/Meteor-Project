/*
 * programmer: Nick Sardo <nsardo@msn.com>
 * copyright : 2016-2017 Collective Innovation
 */

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
   * #TEST-GO-HOME  ::(CLICK)::
   */
  'click #test-go-home'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();

    //////////////////////////////////////////////////////////
    // TODO: if a test hasn't been saved, remove() the _id  //
    /////////////////////////////////////////////////////////

    //if ( FlowRouter.current().path.indexOf( 'teacher' ) != -1 ) {
    if ( Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
    //} else if ( FlowRouter.current().path.indexOf( 'admin' ) != -1 ) {
    } else if ( Meteor.user().roles.admin ) {
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
    } else {
      console.error('path error');
    }
//-------------------------------------------------------------------
  },


  /*
   * .JS-TEST-COMPLETE  ::(CLICK)::
   */
  'click .js-test-complete'( e, t ){
    let lastId  = t.$( 'div#ans-mc input:last' ).attr( 'id' );
    let tot_q   =  t.$( '[ name="qnum" ]' ).val();
    
    Number(total_questions--);
    
    Tests.update( { _id: testidnum },
                  {$set: {total_questions: tot_q} }
                );
                
    //clear out added dom elements
    if ( lastId != 'C' ){
      for( let i = 3; i <= spread; i++ ){
        t.$( '#lab' + String.fromCharCode( i + 65)).remove();
        t.$( '#'    + String.fromCharCode( i + 65)).remove();
        t.$( '#opt' + String.fromCharCode( i + 65)).remove();
      }
    }
    t.$( '[ name="qnum" ]' ).val('');
    t.$( '#test-name' ).attr( 'readonly', false );
    t.$( '#test-name' ).val('');
    t.$( '#question' ).val('');

    if ( ! t.$( '#ans-tf' ).hasClass( 'hide' ) )
      t.$( '#ans-tf' ).addClass( 'hide' );

    if ( ! t.$( '#ans-mc' ).hasClass( 'hide' ) )
      t.$( '#ans-mc' ).addClass( 'hide' );

    //RETURN TO COURSE BUILDER
    if ( Meteor.user().roles.teacher ) {
      FlowRouter.go( `/teacher/dashboard/course-builder/${Meteor.userId()}?rtn=test&id=${testidnum}` );
    } else if ( Meteor.user().roles.admin ) {
      FlowRouter.go( `/admin/dashboard/course-builder/${Meteor.userId()}?rtn=test&id=${testidnum}` );
    }
//-------------------------------------------------------------------
  },



  /*
   * #TEST-NAME  ::(BLUR)::
   */
  'blur #test-name'( e, t ){
    //let course_name = FlowRouter.current().path.slice( FlowRouter.current().path.indexOf('?') + 1 );

      testidnum = Tests.insert({
                                test_name: t.$( '#test-name' ).val(),
                                company_id: Meteor.user().profile.company_id
                              });

      Meteor.setTimeout(function(){
        let testName  = t.$( '#test-name' ).val();
        //testidnum     = Tests.findOne({ test_name: testName })._id;
      }, 200);

      t.$( '#test-name' ).attr( 'readonly', true);
//-------------------------------------------------------------------
  },



  /*
   * #TF  ::(CLICK)::
   *
   * SELECT TRUE/FALSE ANSWER TYPE
   */
  'click #tf'( e, t ) {

    t.$( '#ans-tf' ).removeClass( 'hide' );
    t.$( '#ans-mc' ).addClass(    'hide' );
//-------------------------------------------------------------------
  },


  /*
   * #MC  ::(CLICK)::
   *
   * SELECt MULTIPLE CHOICE ANSWER TYPE
   */
  'click #mc'( e, t ){

    t.$( '#ans-mc' ).removeClass( 'hide' );
    t.$( '#ans-tf' ).addClass(    'hide' );
//-------------------------------------------------------------------
  },


  /*
   * #MC-SUBMIT  ::(CLICK)::
   *
   * SUBMIT MULTIPLE CHOICE ANSWERS FOR CURRENT QUESTION
   */
  'click #mc-submit'( e, t ){

    let answers     = [];

    //test name
    let nm          = t.$( '#test-name' ).val();

    //question
    let q           = t.$( '#question' ).val();

    //correct answer
    let correct_a   = $( '#correct_ans' ).val(); //A, B, C
    let correct_ans;
    
    //id of last multiple choice answer
    let lastId      = t.$( 'div#ans-mc input:last' ).attr( 'id' );

    //converted to ascii code
    let lastIdAscii = lastId.charCodeAt(0);

    //compute end of answers
    let spread      = lastIdAscii - 65; // 0 = 65, 1 = 66, 2 = 67, etc.

    //serialize
    for( let i = 0; i <= spread; i++ ){
      if ( t.$( '#' + String.fromCharCode( i + 65 ) ).val() != '' ) {
        answers[i] = t.$( '#' + String.fromCharCode( i + 65 ) ).val(); //65 = A
        if ( t.$( '#' + String.fromCharCode( i + 65 ) ) == correct_a ) {
          correct_ans = t.$( '#' + String.fromCharCode( i + 65 ) ).val();
        }
      }
    }
    
    //clear out added dom elements
    if ( lastId != 'C' ){
      for( let i = 3; i <= spread; i++ ){
        t.$( '#lab' + String.fromCharCode( i + 65) ).remove();
        t.$( '#'    + String.fromCharCode( i + 65) ).remove();
        t.$( '#opt' + String.fromCharCode( i + 65) ).remove();
        t.$( '#question' ).val('');
      }
    }

    //current question number
    let questionNum    =  t.$( '[ name="qnum" ]' ).val();
    let currentQuestionNumber = questionNum;

    //bump question number to next
    Number( questionNum++ );
    t.$( '[ name="qnum" ]' ).val( questionNum );

    let num_ans = answers.length;
    Tests.update( { _id: testidnum },
                  { $addToSet:
                    { questions:
                      {
                        question_num:currentQuestionNumber,
                        question: q,
                        answers: answers,
                        num_answers: num_ans,
                        correct_answer: correct_ans,
                        question_type: 'mc'
                      }
                    }
                  }
    );

    //CLEAR INITIAL MULTIPLE CHOICE ANSWER BOXES
    t.$('#A').val('');
    t.$('#B').val('');
    t.$('#C').val('');

    //CLEAR QUESTION
    t.$( '#question' ).val('');

    t.$( '#ans-mc' ).addClass( 'hide' );
//-------------------------------------------------------------------
  },


  /*
   * #TF-SUBMIT  ::(CLICK)::
   *
   * SUBMIT TRUE/FALSE ANSWERS TO CURRENT QUESTION
   */
  'click #tf-submit'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();

    //question
    let q                     = t.$( '#question' ).val();
    let questionNum           = t.$( '[ name="qnum" ]' ).val();
    let currentQuestionNumber = questionNum;
    let correct_a             = t.$( 'input[ name="optradio" ]:checked' ).val();

    //advance question number
    Number( questionNum++ );
    //and set it
    t.$( '[ name="qnum" ]' ).val( questionNum );

    Tests.update( { _id: testidnum},
                  { $addToSet:
                    { questions:
                      {
                        question_num:currentQuestionNumber,
                        question: q,
                        correct_answer:
                        correct_a,
                        question_type: 'tf'
                      }
                    }
                  }
    );

    //clean up the ui
    t.$( '.js-tf' ).prop( 'checked', false );
    t.$( '#question' ).val('');
    t.$( '#ans-tf' ).addClass( 'hide' );
//-------------------------------------------------------------------
  },



  /*
   * #PLUS  ::(CLICK)::
   *
   * ADD ADDITIONAL MULTIPLE CHOICE ANSWERS
   */
  'click #plus'( e, t ){

    //what is the last questions letter?
    let lastLetter = t.$( e.currentTarget ).closest().context.previousElementSibling.innerText.charCodeAt(0);

    //add one makes it the next highest character, i.e. A(65) + 1 = B(66)
    lastLetter += 1;

    //convert ascii number back into character, i.e 65 = A
    nextChar   = String.fromCharCode( lastLetter );
    //create new multiple choice answer
    t.$( e.currentTarget ).before( '<label id="lab' + nextChar + '">' + nextChar +
                                '<input id="'        + nextChar +
                                '"' + 'type="text" class="form-control" placeholder="enter answer...">' +
                                '</label>' );
    //create new multiple choice correct answer <option>
    let opt       = document.createElement( 'option' );
    opt.value     = nextChar;
    opt.setAttribute( 'id', 'opt' + nextChar );
    opt.innerHTML = nextChar;
    document.getElementById( 'correct_ans' ).appendChild( opt );
//-------------------------------------------------------------------
  },

});
