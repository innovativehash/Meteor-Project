/*
 * @module courseView
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { BuiltCourses }   from '../../../both/collections/api/built-courses.js';
import { Students }       from '../../../both/collections/api/students.js';

import * as CBCreateDOM from '../CB/createDOM.js';

import './course-view.html';


let b, c, len, page, total;


/*=========================================================
 * CREATED
 *=======================================================*/
Template.courseView.onCreated( function() {
  
  //$( '#cover' ).show();

  this.page       = new ReactiveVar(1);
  this.total      = new ReactiveVar(1);
  
  this.render;
//-------------------------------------------------------------------
});




/*=========================================================
 * RENDERED
 *=======================================================*/
Template.courseView.onRendered( function() {
  $('#yosco').hide();
/*
  $( '#cover' ).delay( 1000 ).fadeOut( 'slow',
                                      function() {
                                        $( "#cover" ).hide();
                                        $( ".dashboard-header-area" )
                                            .fadeIn( 'slow' );
                                      }
  );
*/
    //let self = this;
    //self.subscribe("name", function() {
    //console.log( FlowRouter.getQueryParam("builder"))

    
    this.autorun(function() { //self
      try {
       let bc= BuiltCourses.find({ _id: FlowRouter.getQueryParam( "course" )}).fetch();
       let pg_num  = Template.instance().page.get();
        
       Template.instance().total.set( bc[0].pages.length );

        //IS THE DATABASE PRESENT?
        if ( bc && bc[0] && bc[0].pages ) {
          render( bc );
          
        }
      } catch(e) {
        console.log( e );
        return;
      }
    }); //autorun
//-----------------------ON RENDERED------------AUTORUN---------------------- 

  /*****************
   * RENDER FUNCTION
   ****************/
  render =   
    (function( bc ){
      let rtn_arr
        , o       = [];
      
      try {

       if ( (bc && bc[0] && bc[0].pages && bc[0].pages.length) != undefined ) {
          for( let i = 0, ilen = bc[0].pages.length; i < ilen; i++ ) {
            if ( bc[0].pages[i].page_no == Template.instance().page.get() ){
              $( '#test_v' ).hide();
              $( '#fb-template' ).show();
              
              if ( bc[0].pages[i].type == 'test' ) {
                Session.set('test', bc[0].pages[i].t_id );
                $( '#fb-template' ).hide();
                $( '#fb-template' ).empty();
                $( '#test_v' ).show(); 
                break;
                
              } else 
                  if ( bc[0].pages[i].type == 'pdf') {
                    Bert.alert({
                        title:    'Loading PDF',
                        message:  'Give it a few seconds to load...',
                        type:     'success',
                        style:    'growl-top-right',
                        icon:     'fa-youtube'
                  }); 
              } else
                  if ( bc[0].pages[i].type == 'video' ) {
                    Bert.alert({
                        title:    'Loading Video',
                        message:  'Give it a few seconds to load...',
                        type:     'success',
                        style:    'growl-top-right',
                        icon:     'fa-youtube'
                    });      
              } else
                  if ( bc[0].pages[i].type == 'scorm' ) {
                    Bert.alert({
                        title:    'Loading SCORM',
                        message:  'Give it a few seconds of load...',
                        type:     'success',
                        style:    'growl-top-right',
                    });
              }
            
              o.push( bc[0].pages[i] );
            }
          }
        } else {
            o.push(bc[0].pages );
        }
        
        rtn_arr = handlePrevious( o );   
        
        let funcs = rtn_arr[1];
  
        //ATTACH ELEMENTS RETURNED FROM CLASS TO DOM
        $('#fb-template').append( rtn_arr[0] ); 
        
        //ACTIVATE POSITIONING JQUERY FUNCTIONS RETURNED FROM CLASS
        for ( let i = 0, ilen = funcs.length; i < ilen; i++ ) {
          eval( funcs[i] );
        } 
  
     } catch(ReferenceError) {
        console.log( 'no record line:650' );
      }
  });
 
  
//------------------------------------------------------ON RENDERED-------------
});




/*=========================================================
 * HELPERS
 *=======================================================*/
Template.courseView.helpers({

  course: () => {
    //
    //  THIS IS JUST HERE TO "CALL" THE ONRENDERED AUTORUN FUNCTION
    return;
  },

  cname: () => {
    let cid = FlowRouter.getQueryParam( "course" );
    try {
      return BuiltCourses.find({ _id: cid }).fetch()[0].cname;
    } catch(e) {
      return;
      //console.log(e);
    }
  },
  
  fname: () => {
    try {
      return Students.findOne({ _id: Meteor.userId() }).fname;
    } catch(e) {
      return;
      //console.log(e);
    }
  },

  page: () =>
   Template.instance().page.get(),

  total: () =>
   Template.instance().total.get()
//-------------------------------------------------------------------
});




/*=========================================================
 * EVENTS
 *=======================================================*/
Template.courseView.events({

  /********************************************************
   * #LOGOUT  ::(CLICK)::
   *******************************************************/
  'click #cv-logout': function( e, t ) {
    e.preventDefault();
    
    Session.set('Scratch', '');
    
    Meteor.logout();
    FlowRouter.go( '/login' );
//-------------------------------------------------------------------
  },


  /********************************************************
   * .JS-BACK-TO-HOME  ::(CLICK)::
   *******************************************************/
  'click #course-view-page-back'( e, t ) {
    e.preventDefault();

    Session.set('Scratch', '');
    
    if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles && Meteor.user().roles.admin ) {
      FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles && Meteor.user().roles.student ) {
      FlowRouter.go( 'student-courses', { _id: Meteor.userId() });
    }
    return;
//-------------------------------------------------------------------
  },


  /********************************************************
   * CV-DASHBOARD-LINK
   *******************************************************/
  'click #cv-dashboard-link'( e, t ) {
      e.preventDefault();

      Session.set('Scratch', '');
    
      if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
        FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
      } else if ( Meteor.user().roles && Meteor.user().roles.admin ) {
        FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
      } else if ( Meteor.user().roles && Meteor.user().roles.student ) {
        FlowRouter.go( 'student-dashboard', { _id: Meteor.userId() });
      }
      //$( '#course-view-page-back' ).click();
      return;
//-------------------------------------------------------------------
  },
   
   
   /*******************************************************
    * CV-COURSES-LINK
    ******************************************************/
  'click #cv-courses-link'( e, t ) {
    e.preventDefault();
    
    Session.set('Scratch', '');
    
    if ( Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles.admin ) {
      FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles.student ) {
      FlowRouter.go( 'student-courses', { _id: Meteor.userId() });
    } 
//-------------------------------------------------------------------
  },
  
  
  
  /********************************************************
   * CV_PREV_BUTTON ::(CLICK)::
   *******************************************************/
  'click #cv-prev-btn'( e, t ) {
    e.preventDefault();

    if ( t.page.get() > 1 ) {
      t.page.set( t.page.get() -1);
    } else {
      return;
    }
//-------------------------------------------------------------------
  },


  /********************************************************
   * CV-NEXT-BUTTON ::(CLICK)::
   *******************************************************/
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

/**********************************************************
 * HANDLE PREVIOUS
 *********************************************************/
 function handlePrevious( o ) {


    let funcs   = ''                    //FUNCS FROM CLASS TO POSITION ELEMENTS
      , content = ''                    //RENDERED MARKUP (AND FUNCS) RETURNED
      , cd                              //RENDERING CLASS INSTANCE
      , mark_up = '';                   //RENDERED MARKUP RETURN VARIABLE


    //if ( p.length == 0 ) return;
    
    //CREATE INSTANCE OF CBCreateDOM CLASS
    cd        = new CBCreateDOM.CreateDOM( o );
    
    //RETRIEVE RESULT OF PROCESSING RETURNED DATABASE ELEMENTS
    content   = cd.buildDOM();
 
    //PULL OUT THE MARKUP RETURNED FROM CLASS
    mark_up   = content[0];
    
    //PULL OUT THE JQUERY FUNCTIONS RETURNED FROM CLASS
    funcs     = content[1];
    
    return [ mark_up, funcs ];
 
 }