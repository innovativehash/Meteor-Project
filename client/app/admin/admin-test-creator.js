/*
 * @module adminTestCreator
 *
 * @programmer: Nick Sardo <nsardo@aol.com>
 * @copyright : 2016-2017 Collective Innovation
 */

import { Tests }     from '../../../both/collections/api/tests.js';

import '../../templates/admin/admin-test-creator.html';


let Test = new Mongo.Collection(null);

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
$( '#tf-edit' ).hide();
$( '#mc-edit' ).hide();
$( '.test-help-contents' ).hide();
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
   *
   * .JS-SHOW-TEST-HELP  ::(CLICK)::
   */
   'click .js-show-test-help'( e, t ) {
     e.preventDefault();
     e.stopImmediatePropagation();
     
     t.$( '.test-help-contents' ).slideToggle();
   },
   
   
   
  /*
   * .JS-TEST-COMPLETE  ::(CLICK)::
   */
  'click .js-test-complete'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let lastId  = t.$( 'div#ans-mc input:last' ).attr( 'id' );
    let tot_q   =  t.$( '[ name="qnum" ]' ).val();
    
    Number(tot_q--);
    
    //UPDATE LOCAL DB
    Test.update( { _id: testidnum },
                  { $set: 
                    { total_questions: tot_q} }
                );
    
    //EXTRACT LOCAL DB 
    let testObj = Test.find().fetch()[0];
    
    //TRANSFER LOCAL DB TO PERMANENT STORE
    testidnum = Tests.insert({ 
                              company_id: testObj.company_id,
                              test_name: testObj.test_name,
                              total_questions: testObj.total_questions,
                              questions: testObj.questions
                            });

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

      testidnum = Test.insert({
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
    e.preventDefault();
    
    ///////////////////////////////////
    // CHECK FOR ANSWER DUPLICATES!! //
    ///////////////////////////////////
    
    
    let answers     = [];

    //test name
    let nm          = t.$( '#test-name' ).val();

    //question
    let q           = t.$( '#question' ).val();

    //correct answer
    let correct_a   = t.$( '#correct_ans' ).val(); //A, B, C
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
        answers[i] = t.$( '#' + String.fromCharCode( i + 65 ) ).val();
        if ( String.fromCharCode( i + 65 ) == correct_a ) {
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
    t.$( '[ name="qnum" ]' ).val( questionNum );  //set hidden field
    t.$( '#q_num' ).text( questionNum );  //set question number badge

    let num_ans = answers.length;

    Test.update( { _id: testidnum },
                  { $addToSet:
                    { questions:
                      {
                        question_num:   Number(currentQuestionNumber),
                        question:       q,
                        answers:        answers,
                        num_answers:    num_ans,
                        correct_answer: correct_ans,
                        question_type:  'mc'
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
   * #MC-EDIT  ::(CLICK)::
   *
   * SUBMIT EDIT'S MULTIPLE CHOICE ANSWERS FOR CURRENT QUESTION
   */
  'click #mc-edit'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let qnmbr       = Number( t.$( '#q_num' ).text() )
      , q           = t.$( '#question' ).val()
      , correct_a   = t.$( '#correct_ans' ).val()
      , answers     = []
      , correct_ans;
      
    //id of last multiple choice answer
    let lastId      = t.$( 'div#ans-mc input:last' ).attr( 'id' );

    //converted to ascii code
    let lastIdAscii = lastId.charCodeAt(0);

    //compute end of answers
    let spread      = lastIdAscii - 65; // 0 = 65, 1 = 66, 2 = 67, etc.

    //serialize
    for( let i = 0; i <= spread; i++ ){
      if ( t.$( '#' + String.fromCharCode( i + 65 ) ).val() != '' ) {
        answers[i] = t.$( '#' + String.fromCharCode( i + 65 ) ).val();
        if ( String.fromCharCode( i + 65 ) == correct_a ) {
          correct_ans = t.$( '#' + String.fromCharCode( i + 65 ) ).val();
        }
      }
    }
    
    let num_ans = answers.length;
    
    Test.update( { questions:{$elemMatch:{ question_num:{$eq: Number(qnmbr) } }}},
                 { $set:
                      {
                        "questions.$.question":       q,
                        "questions.$.correct_answer": correct_ans,
                        "questions.$.answers":        answers,
                        "questions.$.num_answers":    num_ans
                      }
                  }
    );
    
    //clear out added dom elements
    if ( lastId != 'C' ){
      for( let i = 3; i <= spread; i++ ){
        t.$( '#lab' + String.fromCharCode( i + 65) ).remove();
        t.$( '#'    + String.fromCharCode( i + 65) ).remove();
        t.$( '#opt' + String.fromCharCode( i + 65) ).remove();
        t.$( '#question' ).val('');
      }
    }
    
    t.$( '#t-btn-next' ).click();
    return;
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
    t.$( '[ name="qnum" ]' ).val( questionNum );  //set hidden field
    t.$( '#q_num' ).text( questionNum );  //set question number badge

    Test.update( { _id: testidnum},
                  { $addToSet:
                    { questions:
                      {
                        question_num:   Number(currentQuestionNumber),
                        question:       q,
                        correct_answer: correct_a, 
                        question_type:  'tf'
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
   * #TF-EDIT  ::(CLICK)::
   *
   * SUBMIT EDIT'S TRUE/FALSE ANSWERS TO CURRENT QUESTION
   */
  'click #tf-edit'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let qnmbr = Number( t.$( '#q_num' ).text() )
      , q = t.$( '#question' ).val()
      , correct_a = t.$( 'input[ name="optradio" ]:checked' ).val();

    Test.update( { questions:{$elemMatch:{ question_num:{$eq: Number(qnmbr) } }}},
                 { $set:
                      {
                        "questions.$.question":       q,
                        "questions.$.correct_answer": correct_a
                      }
                  }
    );
    t.$( '#t-btn-next' ).click();
    return;

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


 
  /*
   * #T-BTN-PREV  ::(CLICK)::
   *
   * NAVIGATE FORWARD THROUGH QUESTIONS
   */
  'click #t-btn-prev'( e, t ) {
    e.preventDefault();
    
    let curr_question = Number( t.$( '#q_num' ).text() );
    
    if ( curr_question <= 1 ) {
      return;
    }
    
    t.$( '#tf-edit' ).show();
    t.$( '#tf-submit' ).hide();
    t.$( '#mc-edit' ).show();
    t.$( '#mc-submit' ).hide();
    
    hideQTypes();
    resetMC();
    resetTF();
    
    curr_question = Number( curr_question - 1)
    t.$( '#q_num' ).text( curr_question );
    
    let t_ques = Test.findOne({ _id: testidnum },{questions:{$elemMatch:{question_num:curr_question}}})
      , arr_idx = curr_question - 1; //adjust for 0 based array

    let q_type  = t_ques.questions[arr_idx].question_type
      , ques    = t_ques.questions[arr_idx].question
      , c_ans   = t_ques.questions[arr_idx].correct_answer
      , num_ans = 0
      , ans     = [];

    if ( q_type == 'mc' ) {
      num_ans = t_ques.questions[arr_idx].num_answers;
      ans     = t_ques.questions[arr_idx].answers;
    }

    switch ( q_type ) {
      case 'tf':
        t.$( '#ans-tf' ).removeClass( 'hide' );
        t.$( '#ans-mc' ).addClass(    'hide' );
        if ( c_ans == "true" ) {
          t.$( '#t' ).prop( 'checked', true );
        } else {
          t.$( '#f' ).prop( 'checked', true );
        }
        t.$( '#question' ).val( ques );
       
        break;
        
      case 'mc':
        t.$( '#ans-mc' ).removeClass( 'hide' );
        t.$( '#ans-tf' ).addClass(    'hide' );
        let pos = _.indexOf( ans, c_ans ); //locate position of ans in array;
        
        ans.forEach(function( el, idx ){ 
          if ( idx > 2 ) t.$( '#plus' ).click();
          t.$( `#${posAlphabet(idx)}` ).val( el ); 
        });
        
        if ( pos == -1 ) {
          console.log('huh?');  //error
        } else {
          $( '#correct_ans' ).val( posAlphabet( pos ) );
        }
        t.$( '#question' ).val( ques );
        
        break;
    }
  },
  
  
  
  /*
   * #T-BTN-NEXT  ::(CLICK)::
   *
   * NAVIGATE FORWARD THROUGH QUESTIONS
   */
  'click #t-btn-next'( e, t ) {
    e.preventDefault();
    
    let curr_question = Number( t.$( '#q_num' ).text() )
      , ques_counter  = Number( t.$( '[ name="qnum" ]' ).val() );
        
    Number(curr_question++);
     if ( curr_question >= ques_counter ) {
        hideQTypes();
        resetMC();
        resetTF();
        t.$( '#q_num' ).text( ques_counter );
        
        t.$( '#tf-edit' ).hide();
        t.$( '#tf-submit' ).show();
        t.$( '#mc-edit' ).hide();
        t.$( '#mc-submit' ).show();
        return;
     }
    
    t.$( '#q_num' ).text( curr_question );
    curr_question--; //ZERO BASED ARRAY
    
    let t_ques
      , q_type
      , c_ans
      , num_ans = 0
      , ans     = [];
    
    t_ques = Test.findOne({ _id: testidnum },{questions:{$elemMatch:{question_num:String(curr_question)}}});
 
    q_type = t_ques.questions[curr_question].question_type;
      
    ques    = t_ques.questions[curr_question].question;
      
    c_ans   = t_ques.questions[curr_question].correct_answer;

    hideQTypes();
    resetMC();
    resetTF();
    

    if ( q_type == 'mc' ) {
      num_ans = t_ques.questions[curr_question].num_answers;
      ans     = t_ques.questions[curr_question].answers;
    }

    switch ( q_type ) {
      case 'tf':
        t.$( '#ans-tf' ).removeClass( 'hide' );
        t.$( '#ans-mc' ).addClass(    'hide' );
        if ( c_ans == "true" ) {
          t.$( '#t' ).prop( 'checked', true );
        } else {
          t.$( '#f' ).prop( 'checked', true );
        }
        t.$( '#question' ).val( ques );

        break;
        
      case 'mc':
        t.$( '#ans-mc' ).removeClass( 'hide' );
        t.$( '#ans-tf' ).addClass(    'hide' );
        let pos = _.indexOf( ans, c_ans ); //locate position of ans in array;
        
        ans.forEach(function( el, idx ){ 
          if ( idx > 2 ) t.$( '#plus' ).click();
          t.$( `#${posAlphabet(idx)}` ).val( el ); 
        });
        
        if ( pos == -1 ) {
          console.log('huh?');  //error
        } else {
          $( '#correct_ans' ).val( posAlphabet( pos ) );
        }
        t.$( '#question' ).val( ques );
        
        break;
    }
  }


});


/* 
 * ----------------------------------------------------------------------------
 * HELPERS
 * ----------------------------------------------------------------------------
 */
 
 
function hideQTypes() {
  if ( ! $( '#ans-tf' ).hasClass( 'hide' ) )
    $( '#ans-tf' ).addClass(    'hide' );
  
  if ( ! $( '#ans-mc' ).hasClass( 'hide' ) )
    $( '#ans-mc' ).addClass( 'hide' );
}

function resetTF() {
  $( '#t' ).attr( 'checked', false );
  $( '#f' ).attr( 'checked', false );
  
  $( '#question' ).val('');
}

function resetMC( num ) {
  $('#A').val('');
  $('#B').val('');
  $('#C').val('');
  
  $('#question').val('');
}

function posAlphabet( pos ) {
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[pos];
}