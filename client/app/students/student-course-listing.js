


import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

//import { Blaze } from 'meteor/blaze'

import { Courses }     from '../../../both/collections/api/courses.js';
import { Students }    from '../../../both/collections/api/students.js';

import '../../templates/student/student-course-listing.html';


/*
 * CREATED
 */
Template.studentCourseListing.onCreated(function() {
  $('#cover').show();
  
  this.cur_cor = new ReactiveArray([]);
  this.cor_com = new ReactiveArray([]);
});


/*
 * RENDERED
 */
Template.studentCourseListing.onRendered(function(){
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  }); 
});


/*
 * HELPERs
 */
Template.studentCourseListing.helpers({

  courses() {
   // return Courses.find({ company_id:1 }).fetch();

    let st_courses_completed = Students.find( { _id: FlowRouter.current().params._id }, { courses_completed:1}).fetch()[0];
    if ( st_courses_completed && st_courses_completed.courses_completed ) {
      var st_courses_completedl = st_courses_completed.courses_completed.length;
      for ( let i = 0; i < st_courses_completedl; i++ ) {
        Template.instance().cor_com.push( st_courses_completed.courses_completed[i].id );
      }
    }
    //console.log( Template.instance().cor_com.list() );


    let st_current_courses = Students.find({ _id: FlowRouter.current().params._id }, {current_courses:1}).fetch()[0];
    if ( st_current_courses && st_current_courses.current_courses ) {
      var st_current_coursesl = st_current_courses.current_courses.length;
        for ( let i = 0; i < st_current_coursesl; i++ ) {
            Template.instance().cur_cor.push( st_current_courses.current_courses[i].id );
          }
    }
    //console.log( Template.instance().cur_cor.list() );
 
  

    // moment(c[i].due_date).format('MM/DD/YYYY');

      let o = Courses.find({ company_id:1 }).fetch();
      let ocl = o.length;
      for ( let i = 0; i < ocl; i++ ) {
        var found = _.filter( Template.instance().cor_com.list(), ( m ) => { return m == o[i]._id })
        if ( found.length > 0 ) {
          o[i].buttonText = 'retake'; //completed
          o[i].completed = true;
        }
      }
    
      if ( o ) {
        let ocl = o.length;
        for ( let i = 0; i < ocl; i++ ) {
          var found = _.filter( Template.instance().cur_cor.list(), ( m ) => { return m == o[i]._id })
          if ( found.length > 0 ) {
            o[i].buttonText = 'continue';
          } else if ( o[i].buttonText != 'retake' ) { //completed
            o[i].buttonText = 'begin';
          }
        }
      }
      return o;
  },
});


/*
 * EVENTS
 */
Template.studentCourseListing.events = {
  
  /*
   * CLICK #BTN
   */
  'click #btn': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    //text value of button: begin, continue, completed
    console.log( e.currentTarget.firstChild.nodeValue );
//-------------------------------------------------------------------
  },
}