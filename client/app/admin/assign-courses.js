
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
    Courses.find({ company_id:1 }).fetch(),
  dept: () =>
    Departments.find({}).fetch(),
  names: () =>
    Students.find({}).fetch()
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
     
    t.$('#course-name').html( $(e.currentTarget).data('name') );
    t.$('.add-course').attr('data-id', $(e.currentTarget).data('id'));
    t.$('.add-course').attr('data-credits', $(e.currentTarget).data('credits'));
    t.$('.add-course').attr('data-name', $(e.currentTarget).data('name'));
    
    t.$('#by-name').val(null).trigger('change');
    t.$('#by-name').attr('disabled', true);  
    t.$('#by-dept').val(null).trigger('change');
    t.$('#by-dept').attr('disabled', true);
    t.$('#assign-modal').modal('show'); 
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
    
    let idx   = t.$('.add-course').data('id');          // course id
    let nm    = t.$('.add-course').data('name');        // course name
    let cr    = t.$('.add-course').data('credits');     // course credits
    

    let assignByDept  = t.$('#by-dept').val();           // department name(s)
    let assignByName  = t.$('#by-name').val();           // student name(s)
    let assignDueDate = t.$('#assign-due-date').val();  // due date
    
    let as  = t.$('#all-students').is(':checked');      // all-students radio
    let abn = t.$('#abn').is(':checked');               // by name radio
    let abd = t.$('#abd').is(':checked');               // by department radio
    
    if ( as ) {                                       // all students?
      let s     = Students.find().fetch();
      let slen  = s.length;
      let o     = { id: idx, name: nm, credits: cr, num: 1 };
      if ( assignDueDate ) o.assignByDate = assignDueDate;
      
      for ( let i = 0; i < slen; i++ ) {
        if ( s[i].role == 'admin') continue;
        Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });
      }
      Bert.alert('Course Assigned', 'success', 'growl-top-right');
    } else if ( abn ) {                               // assign by name?

      if ( ! Array.isArray( assignByName ) ) {
        console.log( 'names empty' );
        Bert.alert('You must enter at least one name!', 'danger');
        return;                                       // toast: must enter at 
      }                                               // least one name!
    
      //assign this/these student(s) to course
      let s     = Students.find().fetch(),
          slen  = s.length,
          alen;
          
      let o     = { id: idx, name: nm, credits: cr, num: 1 };
      if ( assignDueDate ) o.assignByDate = assignDueDate;
      
      // DOUBLE CHECK ASYNC TIMING, BEST PRACTICE FOR THIS
      alen = assignByName.length;
      for ( let i = 0; i < slen; i++ ) {
        for ( let j = 0; j < alen; j++ ) {
          if ( s[i].role == 'admin') continue;
          if ( (s[i].fullName).indexOf( assignByName[j] ) != -1 ) {
            Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });
          }
        }
      }
      Bert.alert('Course assigned', 'success', 'growl-top-right');
    } else if ( abd ) {                               // assign by dept?
  
      if ( ! Array.isArray( assignByDept ) ) {
        console.log( 'dept empty' );
        Bert.alert('You must enter a department!', 'danger');
        return;                                       // toast: must enter a dept!
      }
      
      let s     = Students.find().fetch(),
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
      Bert.alert('Course assigned', 'success', 'growl-top-left');
    } else {
      Bert.alert( "You MUST select one of:\n 'all students', \n'names', or \n'departments'",
                  'danger');
      return;
    }

    /* EXIT, CLEAR */
    t.$("#by-dept").val(null).trigger("change");
    t.$("#by-name").val(null).trigger("change");
    t.$('#assign-due-date').val('');
    t.$('#abn').prop('checked', false);
    t.$('#all-students').prop('checked', false);
    t.$('#abd').prop('checked', false);
    t.$('#assign-modal').modal('hide');
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
      t.$("#by-dept").val(null).trigger("change");
      t.$("#by-name").val(null).trigger("change");
      t.$('#by-name').attr('disabled', true); 
      t.$('#by-dept').attr('disabled', true);
      t.$('#abn').bootstrapToggle('off');
      t.$('#abd').bootstrapToggle('off');
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
      t.$('#by-name').attr('disabled', false );
      t.$('#by-dept').val(null).trigger('change');
      t.$('#by-dept').attr('disabled', true);
      t.$('#abd').bootstrapToggle('off');
      t.$('#all-students').bootstrapToggle('off');
    } else {
      t.$('#by-name').val(null).trigger('change');
      t.$('#by-name').attr('disabled', true);
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
      t.$('#by-dept').attr('disabled', false);
      t.$('#by-name').val(null).trigger('change');
      t.$('#by-name').attr('disabled', true );
      t.$('#abn').bootstrapToggle('off');
      t.$('#all-students').bootstrapToggle('off');
    } else {
      t.$('#by-dept').val(null).trigger('change');
      t.$('#by-dept').attr('disabled', true);
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