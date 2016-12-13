/*
 * @module courseView
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { BuiltCourses }   from '../../../both/collections/api/built-courses.js';
import { Courses }        from '../../../both/collections/api/courses.js';
import { Students }       from '../../../both/collections/api/students.js';
import { Scratch }        from '../../../both/collections/api/scratch.js';

import '../../templates/student/course-view.html';


let b, c, len;


/* *****************************************************************************
 * CREATED
 *******************************************************************************/
Template.courseView.onCreated( function() {
  
  //$( '#cover' ).show();

  this.page       = new ReactiveVar(1);
  this.total      = new ReactiveVar(1);
});



/* *****************************************************************************
 * RENDERED
 *******************************************************************************/
Template.courseView.onRendered( function() {
  $('#yosco').hide();
/*
  $( '#cover' ).delay( 1000 ).fadeOut( 'slow',
                                      function() {
                                        $( "#cover" ).hide();
                                        $( ".dashboard-header-area" ).fadeIn( 'slow' );
                                      }
  );
*/
  //let self = this;
  //self.subscribe("name", function() {

    this.autorun(function() { //self
      try {
        let no  = Template.instance().page.get();
        let b   = Courses.findOne({ _id: FlowRouter.getQueryParam( "course" ) }).built_id;
        let c   = BuiltCourses.findOne({ _id: b });

        Template.instance().total.set( c.pages.length -1 );

        if ( c.pages[no].page != null ) {

          // REGULAR PAGES
          if ( c.pages[no].page.indexOf( "data" ) != -1) {
            
            //pre-cache test id if it's the next question
            if ( c.pages[no + 1].type == "test" ) {
              Scratch.insert({ id:  c.pages[no + 1].page });
            }
            
            $( '#test_v' ).hide();
            $( '#fb-template' ).html( '<img id="pg" data="{{course}}">' );
            $( '#pg' ).attr( 'src', c.pages[no].page );
            $( '#fb-template' ).show();
            
          // VIDEO PAGES
          } else if ( c.pages[no].page.indexOf( "<iframe" ) != -1) {
            
            //pre-cache test id if it's the next question
            if ( c.pages[no + 1].type == "test" ) {
              Scratch.insert({ id:  c.pages[no + 1].page });
            }
            
            Bert.alert({
                        title: 'Loading Video',
                        message: 'Give it a few seconds to load...',
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-youtube'
                      });
                      
            $( '#test_v' ).hide();
            $( '#fb-template' ).html( c.pages[no].page );
            $( '#fb-template' ).show();
            
          // TEST PAGES
          } else if ( c.pages[no].type == 'test') {
            ////////////////////////////////////////////////////////////////////
            //  NOTES:                                                        //
            //  Need to pre-seed scratch db so that it is ready BEFORE this   //
            //  this point is reached.  Then need to remove this record before//
            //  Module is left, so that there is only ever one record in      //
            //  scratch.  If there are x tests, preseed the first, remove     //
            //  after test is taken.  Seed for the next, lather, rinse, repeat//
            ////////////////////////////////////////////////////////////////////
            
            $( '#fb-template' ).hide();
            $( '#test_v' ).show();
            
          // WILL NEED TO CODE PP, PDF, SCORM
          }
        }
      } catch(e) {
        console.log( e );
        return;
      }
    }); //autorun
  //});

});




/* *****************************************************************************
 * HELPERS
 *******************************************************************************/
Template.courseView.helpers({

  course: () => {
    //
    //  THIS IS JUST HERE TO "CALL" THE ONRENDERED AUTORUN FUNCTION
    return;
  },

  fname: () => {
    try {
      return Students.findOne({ _id: Meteor.userId() }).fname;
    } catch(e) {
      return;
    }
  },

  page: () =>
    Template.instance().page.get(),

  total: () =>
    Template.instance().total.get()

});
//-------------------------------------------------------------------


Template.courseView.events({

  /*
   * .JS-BACK-TO-HOME  ::(CLICK)::
   */
  'click .page-back-home'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    if ( Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles.admin ) {
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles.student ) {
      FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });
    }

//-------------------------------------------------------------------
  },


  /*
   * CV_PREV_BUTTON ::(CLICK)::
   */
  'click #cv-prev-btn'( e, t ) {
    e.preventDefault();

    if ( t.page.get() > 1 ) {
      t.page.set( t.page.get() -1);
    } else {
      return;
    }
//-------------------------------------------------------------------
  },


  /*
   * CV-NEXT-BUTTON ::(CLICK)::
   */
  'click #cv-next-btn'( e, t ) {
    e.preventDefault();

    if ( t.page.get() < t.total.get() ) {
      t.page.set( t.page.get() + 1);
    } else {
      return;
    }
//-------------------------------------------------------------------
  }
});