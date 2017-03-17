/*
 * @module courses
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Courses }      from '../../../both/collections/api/courses.js';
import { BuiltCourses } from '../../../both/collections/api/built-courses.js';
import { Tests }        from '../../../both/collections/api/tests.js';

import '../../templates/admin/courses.html';


/*=========================================================
 * CREATED
 *========================================================*/
Template.courses.onCreated(function(){

  //$("#courses-cover").show();


  /********************************************************
   * BOOTSTRAP3-DIALOG
   *******************************************************/
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function(){
      //console.log('Course:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Courses:: load bootstrap-dialog.min.js fail' );
  });
//-------------------------------------------------------------------


/**********************************************************
 * SELECT2
 * multi-select combo box
 *********************************************************/
  $.getScript( '/js/select2.min.js', function(){
    $( document ).ready(function(){
      $('#search-courses').select2({
        allowClear: true,
        placeholder: 'Search Courses...'
      });
    });
    //console.log('Courses:: chosen,jquery.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'Courses:: load select2.js fail' );
  });
//-------------------------------------------------------------------
});


/**********************************************************
 * RENDERED
 *********************************************************/
Template.courses.onRendered(function(){
/*
  $( '#courses-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#courses-cover").hide();
    $( ".filter-buttons" ).fadeIn( 'slow' );
  });
*/
});


/**********************************************************
 * DESTROYED
 *********************************************************/
Template.courses.onDestroyed(function(){

  Session.set( 'searchTerm', null );

});

//Courses.find({ $or: [ {company_id:Meteor.user().profile.company_id}, {public:true}] }).fetch()


/**********************************************************
 * HELPERS
 *********************************************************/
Template.courses.helpers({

  courses: () => {
    try {
      return Courses.find({ company_id: Meteor.user().profile.company_id }).fetch();
    } catch(e) {
      return;
    }
  },
  
  uid: () =>
    Meteor.userId()

});



/*=========================================================
 * EVENTS
 *=======================================================*/
Template.courses.events({


  /********************************************************
   * .JS-ADD-COURSE-FROM-LIBRARY  ::(CLICK)::
   *******************************************************/
  'click .js-add-course-from-library'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-add-from-library', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },

 
  /********************************************************
   * #SEARCH-COURSES  ::(CHANGE)::
   * scroll to selected course
   *******************************************************/
  'change #search-courses'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    $( 'tr').css( 'border', '' );
    $( 'tr' ).css( 'background-color', '' );
    
    $( 'tr#' + idx ).css( 'border', '1px solid' ).css( 'background-color', 'PaleTurquoise' );
    $( 'html, body' ).animate({
      scrollTop: $( 'tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast');
//-------------------------------------------------------------------
  },


  /********************************************************
   * .JS-EDIT-COURSE  ::(CLICK)::
   *******************************************************/
  'click .js-edit-course'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

     /* OPEN EDIT DIALOG */
      let idx = $( e.currentTarget ).data( 'id' );

      idx = String( idx );
      let c = Courses.findOne({ _id:idx },{ "name":1, "credits":1 } );

      BootstrapDialog.show({
        title: "Edit Course",
        message:  '<div class="pop-up-area students">' +
                      '<div class="popup-body">' +
                          '<div class="row">' +
                              '<div class="col-sm-6">' +
                                '<label>Course Name:</label>'+
                                  '<input class="js-name" type="text" placeholder="' + c.name + '"' + '/>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="col-sm-6">' +
                                      '<label>Credits:</label>' +
                                        '<input class="js-credits" type="text" placeholder="' + c.credits + '"' + '/>' +
                                      '</div>' +
                                  '</div></div>',
        buttons: [
          {
            label: 'Commit Edit',
            cssClass: 'btn-success',
            action: function( dialog ) {
              let nm = $( ".js-name" ).val().trim()    || c.name;
              let cr = $( ".js-credits" ).val().trim() || c.credits;

              Courses.update( { _id: c._id  },
                              {
                                $set: { "name": nm, "credits": cr }
                              });
              Bert.alert( 'Course changes successfully saved.', 'success' );
              
              dialog.close();
            }
          },
          {
            label: 'Cancel Edit',
            cssClass: 'btn-danger',
            action: function( dialog ) {
              dialog.close();
            }
          }]
        });
//-------------------------------------------------------------------
  },


  /********************************************************
   * .JS-DELETE-COURSE  ::(CLICK)::
   *******************************************************/
  'click .js-delete-course'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    /* ARE YOU SURE YOU WANT TO DELETE... */
    let idx = $( e.currentTarget ).data( 'id' );
    let nm  = $( e.currentTarget ).data( 'name' );
    BootstrapDialog.show({
      title: "Delete Course",
      message:  '<div class="pop-up-area students">' +
                  '<div class="popup-body">' +
                    '<div class="row">' +
                      '<div class="col-sm-12">' +
                        '<strong>Are you sure you want to delete this course?</strong>' +
                        '<div class="name">' +
                          '<span style="color:white;">' + nm + '</span>' +
                        '</div></div></div></div></div>',
      buttons: [{
              /* 
              DELETE ASSOC:
              built-courses,
              tests,
              pdfs
              ppts
              scorms
              */
              label: 'Delete Course',
              cssClass: 'btn-danger',
              action: function( dialog ) {
                Courses.update( { _id: idx },
                                { $pull: { company_id: Meteor.user().profile.company_id }});
                //maybe some logic to remove this course from students currently taking it?
                Bert.alert('The course is successfully removed', 'success' );
                dialog.close();
              }
        },
        {
            label: 'Cancel Delete',
            cssClass: 'btn-primary',
            action: function( dialog ) {
              dialog.close();
            }
        }]
    });
//-------------------------------------------------------------------
  },


  /********************************************************
   * #SEARCH-COURSES  ::(KEYPRESS)::
   *******************************************************/
  'keypress #search-courses': function(event){
    if ( event.which == 13){
      event.preventDefault();
      event.stopImmediatePropagation();

      let idx   = $ ("#search-courses" ).val(),
          item  = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];

      return item;
    }
//-------------------------------------------------------------------
  },


  /********************************************************
   * #DASHBOARD-PAGE  ::(CLICK)::
   *******************************************************/
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /********************************************************
   * .JS-COURSE-BUILDER  ::(CLICK)::
   ******************************************************/
  'click .js-course-builder'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //t.currentScreen.set('courseBuilder');
    FlowRouter.go( 'admin-course-builder', { _id: Meteor.userId() });
  }
//-------------------------------------------------------------------
});