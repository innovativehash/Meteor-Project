
import '../../../public/bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css';

import { Students }     from '../../../both/collections/api/students.js';
import { Courses }      from '../../../both/collections/api/courses.js';
import { Departments }  from '../../../both/collections/api/departments';

import '../../templates/admin/assign-courses.html';


/**
 * ON CREATED
 */
Template.assignCourses.onCreated(function() {
  $("#assign-courses-cover").show();          //set-up fade-in screen
  
  /**
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
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
  
  $.getScript( '/bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js', function() {
    $('#abd').bootstrapToggle();
    $('#abn').bootstrapToggle();
    $('#all-students').bootstrapToggle();
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign Courses:: bootstrap-toggle.min.js fail' );
  });
  
  /**
   * NOTIFICATIONS
   */
  $.getScript( '/js/notify.min.js', function() {
    $.notify.addStyle('happyblack', {
      html: '<div style="width:200px;height:100px;">'                   +
              '<span class="glyphicon glyphicon-warning-sign"></span>'  +
                '&nbsp;&nbsp;<span data-notify-text/>!'                 +
            '</div>',
      classes: {
        base: {
          "white-space": "nowrap",
          "background-color": "DarkGrey",
          "padding": "5px"
        },
        superblack: {
          "color": "LightGrey",
          "background-color": "black"
        }
      }
    });
    //console.log('CourseBuilder:: notify.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign-Courses:: load notify.min.js fail' );
  });
});
  

/**
 * ON RENDERED
 */
Template.assignCourses.onRendered(function(){
  //complete fade-in screen
  $( '#assign-courses-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#assign-courses-cover").hide();
    $( ".search-list" ).fadeIn( 'slow' );
  }); 
});


/**
 * ON DESTROYED
 */
Template.assignCourses.onDestroyed(function(){
    
});


/**
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


/**
 * EVENTS
 */
Template.assignCourses.events({
  
  /**
   * scroll to selected search result
   */
  'change #search-courses'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let idx = $( e.currentTarget ).val();
    $('tr').css('border', '');
    $('tr#' + idx ).css('border', '1px solid');
    $('html, body').animate({
      scrollTop: $('tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast' );
//-----------------------------------------------------------------
  },
 
  
    /**
     * TEMPLATE ASSIGN BUTTON
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
    $('#assign-modal').modal('show'); 
//-------------------------------------------------------------------
  },

  
  /**
   * MODAL ADD BUTTON
   */
  'click .add-course'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let idx   = $('.add-course').data('id');          // course id
    let nm    = $('.add-course').data('name');        // course name
    let cr    = $('.add-course').data('credits');     // course credits
    

    let assignByDept = $('#by-dept').val();           // department name(s)
    let assignByName = $('#by-name').val();           // student name(s)
    let assignDueDate = $('#assign-due-date').val();  // due date
    
    let as  = $('#all-students').is(':checked');      // all-students radio
    let abn = $('#abn').is(':checked');               // by name radio
    let abd = $('#abd').is(':checked');               // by department radio
    
    if ( as ) {                                       // all students?
      let s     = Students.find().fetch();
      let slen  = s.length;
      let o     = { id: idx, name: nm, credits: cr, num: 1 };
      if ( assignDueDate ) o.assignByDate = assignDueDate;
      
      for ( let i = 0; i < slen; i++ ) {
        if ( s[i].role == 'admin') continue;
        Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });
      }
    } else if ( abn ) {                               // assign by name?

      if ( ! Array.isArray( assignByName ) ) {
        console.log( 'names empty' );
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
      
    } else if ( abd ) {                               // assign by dept?
  
      if ( ! Array.isArray( assignByDept ) ) {
        console.log( 'dept empty' );
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
    } else {
    $("#notify").notify(
      "You MUST select one of:\n 'all students', \n'names', or \n'departments'",
      {
      style: "happyblack",
      className: "superblack",
      position:"top center" 
      }
    );
/*
    $.notify(
      "I'm over here !", "warn",
      { position:"top center" }
    );
*/
      return;
    }

    /* EXIT, CLEAR */
    $("#by-dept").val(null).trigger("change");
    $("#by-name").val(null).trigger("change");
    $('#assign-due-date').val('');
    $('#abn').prop('checked', false);
    $('#all-students').prop('checked', false);
    $('#abd').prop('checked', false);
    $('#assign-modal').modal('hide');
//-------------------------------------------------------------------
  },


  /**
   * DIALOG RADIO BUTTON ROUTINES
   */
 
  // ALL STUDENTS RADIO
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
    //$('#assign-due-date').prop('readonly', true);
//-----------------------------------------------------------------
  },
  
  
  // ASSIGN BY NAME RADIO
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
  

  
  // ASSIGN BY DEPARTMENT RADIO
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
 
 
/**
 * SEARCH BOX [ENTER]
 */
  'keypress #search-courses': function(event){
    e.preventDefault();
    e.stopImmediatePropagation();
    
    if ( event.which == 13 ){
      event.preventDefault();

      let idx = $("#search-courses").val(), 
          item = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];
      return item;
    }
//-----------------------------------------------------------------
  },
  

  // DASHBOARD LINK CLICK
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-----------------------------------------------------------------
  }
});