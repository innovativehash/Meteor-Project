/*
 * @module assignCourses
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Students }     from '../../../both/collections/api/students.js';
import { Courses }      from '../../../both/collections/api/courses.js';
import { Departments }  from '../../../both/collections/api/departments';

import '../../templates/admin/assign-courses.html';


/*
 * ON CREATED
 */
Template.assignCourses.onCreated(function() {

  //$("#assign-courses-cover").show();  //set-up fade-in screen

  /*
   * MULTI-SELECT AUTOCOMPLETE COMBOBOX
   */
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){
      $( '#search-courses' ).select2({
        allowClear: true
      });
      $( '#by-name' ).select2({
        allowClear: true
      });
      $( '#by-dept' ).select2({
        allowClear: true
      });
    });
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign Courses:: load select2.js fail' );
  });

});


/*
 * ON RENDERED
 */
Template.assignCourses.onRendered(function(){
  //complete fade-in screen
/*
  $( '#assign-courses-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#assign-courses-cover").hide();
    $( ".search-list" ).fadeIn( 'slow' );
  });
*/
});


/*
 * HELPERS
 */
Template.assignCourses.helpers({

  courses: () =>
    Courses.find({ company_id: Meteor.user().profile.company_id}).fetch(),

  dept: () =>
    Departments.find({}).fetch(),

  names: () =>
    Students.find({ company_id: Meteor.user().profile.company_id }).fetch()

});



/*
 * EVENTS
 */
Template.assignCourses.events({

  /*
   * #SEARCH-COURSES  ::(CHANGE)::
   * scroll to selected search result
   */
  'change #search-courses'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    t.$( 'tr' ).css( 'border', '' );
    t.$( 'tr#' + idx ).css( 'border', '1px solid' );
    t.$( 'html, body' ).animate({
      scrollTop: $( 'tr#' + t.$( e.currentTarget ).val() ).offset().top + 'px'
    }, 'fast' );
//-----------------------------------------------------------------
  },


    /*
     * #ASSIGN  ::(CLICK)::
     */
   'click #assign'( e, t ) {
     e.preventDefault();
     e.stopImmediatePropagation();

    $( '#course-name' ).html( $( e.currentTarget ).data( 'name' ) );
    $( '.add-course' ).attr( 'data-id', $( e.currentTarget ).data( 'id' ));
    $( '.add-course' ).attr( 'data-credits', $( e.currentTarget ).data( 'credits' ));
    $( '.add-course' ).attr( 'data-name', $( e.currentTarget ).data( 'name' ));

    //selects
    $( '#by-dept' ).val( null ).trigger( 'change' );
    $( '#by-dept' ).attr( 'disabled', true );
    
    //input
    $( '#assign-due-date' ).val('');

    //$( '#abd' ).prop( 'checked', false ).change();


    $( '#assign-modal' ).modal( 'show' );
//-------------------------------------------------------------------
  },


  /*
   * .ADD-COURSE  ::(CLICK)::
   */
  'click .add-course'( e, t ) {
    //todo:  don't allow empty submission
    //todo:  reset all switches to OFF

    e.preventDefault();
    e.stopImmediatePropagation();

    let idx   = $( e.currentTarget)[0].dataset.id;          // course id
    let nm    = $( e.currentTarget)[0].dataset.name;        // course name
    let cr    = $( e.currentTarget)[0].dataset.credits;     // course credits
    //console.log( $( e.currentTarget)[0].dataset );
console.log( 'DEBUG: idx = ' + idx );
console.log( 'DEBUG: nm = ' + nm );
console.log( 'DEBUG: cr = ' + cr );
console.log( 'DEBUG::RETURN' );
return;

    let assignByDept  = $( '#by-dept' ).val();           // department name(s)
    let assignByName  = $( '#by-name' ).val();           // student name(s)
    //let assignDueDate = $( '#assign-due-date' ).val();  // due date

    let as  = $( '#all-students' ).is( ':checked' );      // all-students radio
    let abn = $( '#abn' ).is( ':checked' );               // by name radio
    let abd = $( '#abd' ).is( ':checked' );               // by department radio


    /*
     * ALL STUDENTS
     */
    if ( as ) {

      //let url = 'https://collective-university-nsardo.c9users.io/login';
      //let text_wo_due_date  = `Hello ${s[i].fname},\n\nYou've been enrolled in ${nm}.\n\nYou can log in here: ${url}\nUser: s[i].email\nYour password remains the same.`;
      //let text_w_due_date   = `Hello ${s[i].fname},\n\nYou've been enrolled in ${nm}.  Please complete this by:  ${assignDueDate}.\n\nYou can log in here: ${url}\nUser: s[i].email\nYour password remains the same.`;

      let s     = Students.find({ company_id: Meteor.user().profile.company_id }).fetch();
      let slen  = s.length;

      let o     = { id: idx, name: nm, credits: cr, num: 1 };

      if ( assignDueDate ) o.assignByDate = assignDueDate;

      for ( let i = 0; i < slen; i++ ) {
        if ( s[i].role == 'admin' ) continue;
        Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });

        //Meteor.call('sendEmail', s[i].email, 'admin@collectiveuniversity.com', 'Assigned Course', text_wo_due_date);
      }
      Bert.alert( 'Course Assigned', 'success', 'growl-top-right' );

    /*
     * ASSIGN BY NAME
     */
    } else if ( abn ) {


      if ( ! Array.isArray( assignByName ) ) {

        Bert.alert( 'You must enter at least one name!', 'danger' );
        return;                                       // toast: must enter at
      }                                               // least one name!

      //assign this/these student(s) to course
      let s     = Students.find({ company_id: Meteor.user().profile.company_id }).fetch(),
          slen  = s.length,
          alen;

      let o     = { id: idx, name: nm, credits: cr, num: 1 };
      if ( assignDueDate ) o.assignByDate = assignDueDate;

      // DOUBLE CHECK ASYNC TIMING, BEST PRACTICE FOR THIS
      alen = assignByName.length;
      if ( assignByName[alen-1] == '' ) alen = alen - 1; //artifact in input

      for ( let i = 0; i < slen; i++ ) { //number of students
        for ( let j = 0; j < alen; j++ ) { //number of names assigned
          if ( s[i].role == 'admin' ) continue; //don't assign to admin
          if ( (s[i].fullName).indexOf( assignByName[j] ) != -1 ) {
            Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });
          }
        }
      }
      Bert.alert( 'Course assigned', 'success', 'growl-top-right' );


    /*
     * ASSIGN BY DEPARTMENT
     */
    } else if ( abd ) {

      if ( ! Array.isArray( assignByDept ) ) {

        Bert.alert( 'You must enter a department!', 'danger' );
        return;                                       // toast: must enter a dept!
      }

      let s     = Students.find({ company_id: Meteor.user().profile.company_id }).fetch(),
          slen  = s.length,
          dlen;

      let o     = { id: idx, name: nm, credits: cr, num: 1 };
      if ( assignDueDate ) o.assignByDate = assignDueDate;

      // DOUBLE CHECK ASYNC TIMING, BEST PRACTICE FOR THIS
      dlen = assignByDept.length;
      for( let i = 0; i < slen; i++ ) {
        for ( let j = 0; j < dlen; j++ ) {
          if ( s[i].role == 'admin') continue;
          if ( (s[i].department).indexOf( assignByDept[j] ) != -1 ) {
            Students.update( { _id: s[i]._id },{ $push:{ current_courses: o } });
          }
        }
      }
      Bert.alert( 'Course assigned', 'success', 'growl-top-right' );


    } else {
      Bert.alert( "You MUST select one of:\n 'all students', \n'names', or \n'departments'",
                  'danger' );
      return;
    }

    /* EXIT, CLEAR */
    $( "#by-dept" ).val( null ).trigger( "change" );
    $( "#by-dept" ).attr( 'disabled', true );
    $( "#by-name" ).val( null ).trigger( "change" );
    $( '#by-name' ).attr( 'disabled', true );

    $( '#assign-due-date' ).val('');

    $( '#abn' ).prop( 'checked', false ).change();
    $( '#all-students' ).prop( 'checked', false ).change();
    $( '#abd' ).prop( 'checked', false ).change();

    $( '#assign-modal' ).modal( 'hide' );
//-------------------------------------------------------------------
  },


//-------------------------------------------------------------------
// DIALOG RADIO BUTTON ROUTINES
//-------------------------------------------------------------------


  /*
   * #ALL-STUDENTS  ::(CLICK)::
   */
  'click #all-students'( e, t ) {
    e.preventDefault();
    console.log('click all');
    
    t.$( '#all-students' ).css("background-position", "0% 100%");
    t.$( '#assign-by-dept' ).css("background-position", "0% 0%");
    
    $( '#by-dept' ).val( null ).trigger( 'change' );
    $( '#by-dept' ).attr( 'disabled', true );
    
    $( '#by-name' ).val(null).trigger("change");
//-----------------------------------------------------------------
  },

  /*
   * #ASSIGN-BY-DEPT ::(CLICK)::
   */
  'click #assign-by-dept'( e, t ) {
    e.preventDefault();
    if ( $( '#by-dept' ).val() != null ) 
      console.log( 'DEBUG: ' + $( '#by-dept' ).val() );
    
    t.$( '#assign-by-dept' ).css("background-position", "0% 100%");
    t.$( '#all-students' ).css("background-position", "0% 0%");

    $( '#by-dept' ).val( null ).trigger( 'change' );
    $( '#by-dept' ).attr( 'disabled', false );
    
    $( '#by-name' ).val(null).trigger("change");
//-----------------------------------------------------------------
  },
  
  
  /*
   * #BY-NAME ( ASSIGN-BY-NAME )  ::(click)::
   */
  'change #by-name'( e, t ) {
    e.preventDefault();
    if ( $( '#by-name' ).val() != null ) 
      console.log( 'DEBUG: ' + $( '#by-name' ).val() );
      
      
    //since there is feedback on this elements event from the radio buttons,
    //must bail if empty so that the radio's event handler will complete
    if ( $( '#by-name' ).val() == null ) return;
    
    t.$( '#all-students' ).css("background-position", "0% 0%");
    t.$( '#assign-by-dept' ).css("background-position", "0% 0%");
    
    $( '#by-dept' ).val( null ).trigger( 'change' );
    $( '#by-dept' ).attr( 'disabled', true );  
//-----------------------------------------------------------------
  },


/*
 * #SEARCH-COURSES  ::(KEYPRESS)::
 */
  'keypress #search-courses': function(event){
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( event.which == 13 ){
      event.preventDefault();

      let idx = t.$( "#search-courses" ).val(),
          item = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];
      return item;
    }
//-----------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE  ::(CLICK)::
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-----------------------------------------------------------------
  },


});