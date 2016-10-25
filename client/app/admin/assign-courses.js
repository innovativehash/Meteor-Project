
import '../../../public/bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css';

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
    $(document).ready(function(){
      $('#search-courses').select2({
        allowClear: true
      });
      $('#by-name').select2({
        allowClear: true
      });
      $('#by-dept').select2({
        allowClear: true
      });
    });
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign Courses:: load select2.js fail' );
  });
  
  
  /*
   * BOOTSTRAP TOGGLE
   */
  $.getScript( '/bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js', function() {
    $('#abd').bootstrapToggle();
    $('#abn').bootstrapToggle();
    $('#all-students').bootstrapToggle();
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign Courses:: bootstrap-toggle.min.js fail' );
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
   * CHANGE #SEARCH-COURSES
   * scroll to selected search result
   */
  'change #search-courses'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let idx = $( e.currentTarget ).val();
    t.$('tr').css('border', '');
    t.$('tr#' + idx ).css('border', '1px solid');
    t.$('html, body').animate({
      scrollTop: $('tr#' + t.$( e.currentTarget ).val() ).offset().top + 'px'
    }, 'fast' );
//-----------------------------------------------------------------
  },
 
  
    /*
     * CLICK #ASSIGN
     */
   'click #assign'( e, t ) {
     e.preventDefault();
     e.stopImmediatePropagation();
     
    $('#course-name').html( $(e.currentTarget).data('name') );
    $('.add-course').attr('data-id', $(e.currentTarget).data('id'));
    $('.add-course').attr('data-credits', $(e.currentTarget).data('credits'));
    $('.add-course').attr('data-name', $(e.currentTarget).data('name'));
    
    $('#by-name').val(null).trigger('change');
    $('#by-name').attr('disabled', true);  
    $('#by-dept').val(null).trigger('change');
    $('#by-dept').attr('disabled', true);
    $('#assign-due-date').val('');
   
    
    $('#abd').prop('checked', false);
    $('#abd').bootstrapToggle('off');
    $('#abn').prop('checked', false);
    $('#abn').bootstrapToggle('off');
    $('#all-students').prop('checked', false);
    //$('#all-students').bootstrapToggle('off');
    $('#assign-modal').modal('show'); 
//-------------------------------------------------------------------
  },

  
  /*
   * CLICK .ADD-COURSE
   */
  'click .add-course'( e, t ) {
    //todo:  don't allow empty submission
    //todo:  reset all switches to OFF
    
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let idx   = $('.add-course').data('id');          // course id
    let nm    = $('.add-course').data('name');        // course name
    let cr    = $('.add-course').data('credits');     // course credits
    

    let assignByDept  = $('#by-dept').val();           // department name(s)
    let assignByName  = $('#by-name').val();           // student name(s)
    let assignDueDate = $('#assign-due-date').val();  // due date
    
    let as  = $('#all-students').is(':checked');      // all-students radio
    let abn = $('#abn').is(':checked');               // by name radio
    let abd = $('#abd').is(':checked');               // by department radio
    
    
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
        if ( s[i].role == 'admin') continue;
        Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });
        
        //Meteor.call('sendEmail', s[i].email, 'admin@collectiveuniversity.com', 'Assigned Course', text_wo_due_date);
      }
      Bert.alert('Course Assigned', 'success', 'growl-top-right');
      
    /*
     * ASSIGN BY NAME
     */
    } else if ( abn ) {                           
    

      if ( ! Array.isArray( assignByName ) ) {
        console.log( 'names empty' );
        Bert.alert('You must enter at least one name!', 'danger');
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
          if ( s[i].role == 'admin') continue; //don't assign to admin
          if ( (s[i].fullName).indexOf( assignByName[j] ) != -1 ) {
            Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });
          }
        }
      }
      Bert.alert('Course assigned', 'success', 'growl-top-right');
      
      
    /*
     * ASSIGN BY DEPARTMENT
     */
    } else if ( abd ) {
    console.log('assign by dept');
      if ( ! Array.isArray( assignByDept ) ) {
        console.log( 'dept empty' );
        Bert.alert('You must enter a department!', 'danger');
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
      Bert.alert('Course assigned', 'success', 'growl-top-right');
      
      
    } else {
      Bert.alert( "You MUST select one of:\n 'all students', \n'names', or \n'departments'",
                  'danger');
      return;
    }

    /* EXIT, CLEAR */
    $("#by-dept").val(null).trigger("change");
    $("#by-dept").attr('disabled', true);
    $("#by-name").val(null).trigger("change");
    $('#by-name').attr('disabled', true);
    
    $('#assign-due-date').val('');
    $('#abn').prop('checked', false);
    $('#all-students').prop('checked', false);
    $('#abd').prop('checked', false);
    $('#assign-modal').modal('hide');
//-------------------------------------------------------------------
  },


//-------------------------------------------------------------------
// DIALOG RADIO BUTTON ROUTINES
//-------------------------------------------------------------------
 
  /*
   * CHANGE #ALL-STUDENTS
   */
  'change #all-students'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let tog = $(e.currentTarget).prop('checked');
    
    if (tog){
      $("#by-dept").val(null).trigger("change");
      $("#by-name").val(null).trigger("change");
      $('#by-name').attr('disabled', true); 
      $('#by-dept').attr('disabled', true);
      $('#abn').bootstrapToggle('off');
      $('#abd').bootstrapToggle('off');
    }
//-----------------------------------------------------------------
  },
  
  
  /*
   * CHANGE #ABN
   */
  'change #abn'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let tog = $(e.currentTarget).prop('checked');
    
    if (tog){
      $('#by-name').attr('disabled', false );
      $('#by-dept').val(null).trigger('change');
      $('#by-dept').attr('disabled', true);
      $('#abd').bootstrapToggle('off');
      $('#all-students').bootstrapToggle('off');
    } else {
      $('#by-name').val(null).trigger('change');
      $('#by-name').attr('disabled', true);
    }
//-----------------------------------------------------------------
  },
  

  
  /*
   * CHANGE #ABD
   */
  'change #abd'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let tog = $(e.currentTarget).prop('checked');
    
    if (tog){
      $('#by-dept').attr('disabled', false);
      $('#by-name').val(null).trigger('change');
      $('#by-name').attr('disabled', true );
      $('#abn').bootstrapToggle('off');
      $('#all-students').bootstrapToggle('off');
    } else {
      $('#by-dept').val(null).trigger('change');
      $('#by-dept').attr('disabled', true);
    }
//-----------------------------------------------------------------
  },
 
 
/*
 * KEYPRESS #SEARCH-COURSES
 */
  'keypress #search-courses': function(event){
    e.preventDefault();
    e.stopImmediatePropagation();
    
    if ( event.which == 13 ){
      event.preventDefault();

      let idx = t.$("#search-courses").val(), 
          item = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];
      return item;
    }
//-----------------------------------------------------------------
  },
  

  /*
   * CLICK #DASHBOARD-PAGE
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-----------------------------------------------------------------
  },
  
  
});