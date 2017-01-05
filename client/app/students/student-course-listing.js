/*
 * @module studentCourseListing
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

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
  //$('#cover').show();

  this.cur_cor = new ReactiveArray([]);
  this.cor_com = new ReactiveArray([]);
  this.ass_cor = new ReactiveArray([]);
});


/*
 * RENDERED
 */
Template.studentCourseListing.onRendered(function(){
  /*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
  */
});


/*
 * HELPERs
 */
Template.studentCourseListing.helpers({

  courses() {
    try {
    //GET LIST OF THIS STUDENTS COMPLETED COURSES
    let st_courses_completed = Students.find( { _id: FlowRouter.current().params._id },
                                              { courses_completed:1 }).fetch()[0];

    if ( st_courses_completed && st_courses_completed.courses_completed ) {
      var st_courses_completedl = st_courses_completed.courses_completed.length;
      for ( let i = 0; i < st_courses_completedl; i++ ) {
        Template.instance().cor_com.push( st_courses_completed.courses_completed[i].id );
      }
    }


    //GET LIST OF THIS STUDENTS CURRENT COURSES
    let st_current_courses = Students.find( { _id: FlowRouter.current().params._id },
                                            { current_courses:1 }).fetch()[0];

    if ( st_current_courses && st_current_courses.current_courses ) {
      var st_current_coursesl = st_current_courses.current_courses.length;
      for ( let i = 0; i < st_current_coursesl; i++ ) {
        Template.instance().cur_cor.push( st_current_courses.current_courses[i].id );
      }
    }

    //GET LIST OF THIS STUDENTS ASSIGNED COURSES
    let st_assigned_courses = Students.find({ _id: FlowRouter.current().params._id },
                                            { assigned_courses:1 }).fetch()[0];

    if ( st_assigned_courses && st_assigned_courses.assigned_courses ) {

      var st_assigned_coursesl = st_assigned_courses.assigned_courses.length;

      for ( let i = 0; i < st_assigned_coursesl; i++ ) {
        Template.instance().ass_cor.push( st_assigned_courses.assigned_courses[i].id );
      }
    }

    /* moment(c[i].due_date).format('MM/DD/YYYY'); */

    
      //GET LIST OF ALL AVAILABLE COURSES FOR THIS COMPANY THAT CAN BE TAKEN
      let o   = Courses.find({ company_id:Meteor.user().profile.company_id }).fetch();
      //COUNT HOW MANY PRE-LOOP
      let ocl = o.length;
      //LOOP OVER ALL COURSES
      for ( let i = 0; i < ocl; i++ ) {
        //IF THIS STUDENT HAS ALREADY COMPLETED THIS COURSE
        var found = _.filter( Template.instance().cor_com.list(), ( m ) => { return m == o[i]._id })
        if ( found.length > 0 ) {
          o[i].buttonText = 'retake'; //completed
          o[i].completed = true;
          Session.set('show_tr', true);
        }
      }
    
      //FULL LIST OF AVAILABLE COURSES
      if ( o ) {
        //PRE-CALC COUNT
        let ocl = o.length;
        for ( let i = 0; i < ocl; i++ ) {
          //IF THIS COURSE IS CURRENTLY BEING TAKEN BY THIS STUDENT
          let found = _.filter( Template.instance().cur_cor.list(), ( m ) => { return m == o[i]._id })
          if ( found.length > 0 ) {

            o[i].buttonText = 'continue';
          //OTHERWISE, WE HAVE A VIRGIN COURSE
          } else if ( o[i].buttonText != 'retake' ) {
            //IF THIS COURSE IS TEACHER CREATED, THE TEACHER IS THE CURRENT STUDENT, AND COURSE IS ADMIN APPROVED
            if ( ( o[i].creator_type && o[i].creator_type == 'teacher' ) &&
                   o[i].approved && Meteor.user().roles.teacher &&
                   o[i].creator_id == Meteor.userId() ) {

              o[i].buttonText = 'begin'; //ASSIGN
            //TEACHER IS CURRENT STUDENT, COURSE IS TEACHER CREATED, BUT NOT APPROVED
            } else if ( ( o[i].creator_type && o[i].creator_type == 'teacher' ) &&
                          ! o[i].approved &&
                          Meteor.user().roles.teacher &&
                          o[i].creator_id == Meteor.userId() ) {
              //MAKE IT UNSELECTABLE
              o[i].buttonText = "";

            //CURRENT STUDENT IS NOT A TEACHER, TEACHER CREATED COURSE, NOT APPROVED
            } else if ( ( o[i].creator_type && o[i].creator_type == 'teacher' ) &&
                          Meteor.user().roles.student &&
                          ! o[i].approved) {
              //DON'T SHOW IT
              o[i].dontShow = true;

            //OTHERWISE, THIS COURSE IS AVAILABLE TO BE TAKEN
            } else {
              //SHOW IT
              o[i].buttonText = 'begin';
            }
          }
        }
      }
      return o;
    } catch(e) {
      return;
    }
  },

});


/*
 * EVENTS
 */
Template.studentCourseListing.events = {

  /*
   * #COURSE-BUTTON  ::(CLICK)::
   */
  'click #course-button': function ( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

      let builder  = $( e.currentTarget ).data( 'bid' )
        , cid     = $( e.currentTarget ).data( 'id' );
      
      /*
      Students.update({ _id: Meteor.userId() }, 
                          {$addToSet:{current_courses: {course_id: cid}} });
      */
      Meteor.setTimeout(function(){
        Meteor.call( 'updateCurrentCourses', cid );
      },300);
      
      //FlowRouter.go( '/teacher/dashboard/course-view/' + Meteor.userId() + `?course=${course}`);
      let queryParams = { builder: `${builder}`, course: `${cid}` };
      let params      = { _id: Meteor.userId() };
      let routeName   = "student-course-view";
      let path        = FlowRouter.path( routeName, params, queryParams );
      FlowRouter.go( path );

    //text value of button: begin, continue, completed/retake
    //console.log( e.currentTarget.firstChild.nodeValue );
//-------------------------------------------------------------------
  },


  /*
   * .JS-TEACHER-CB  ::(CLICK)::
   */
  'click .js-teacher-cb'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( Meteor.user().roles.teacher ) {
      FlowRouter.go( '/teacher/dashboard/course-builder/' + Meteor.userId() );
    }
  }
}