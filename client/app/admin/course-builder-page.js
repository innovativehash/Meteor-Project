/*
 * @module courseBuilderPage
 *
 * @programmer <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { BuiltCourses }   from '../../../both/collections/api/built-courses.js';
import { Courses }        from '../../../both/collections/api/courses.js';
import { Students }       from '../../../both/collections/api/students.js';
import { Images }         from '../../../both/collections/api/images.js';
import { Pdfs }           from '../../../both/collections/api/pdfs.js';
import { PowerPoints }    from '../../../both/collections/api/powerpoints.js';
import { Newsfeeds }      from '../../../both/collections/api/newsfeeds.js';

import '../../templates/admin/course-builder-page.html';


/*
 * IMPORT BROKEN-OUT EVENT HANDLERS
 */
import * as CBImage from './CB/image-handling.js';
import * as CBTitle from './CB/title-handling.js';
import * as CBTexts from './CB/texts-handling.js';
import * as CBVideo from './CB/video-handling.js';
import * as CBPDF   from './CB/pdf-handling.js';
import * as CBPP    from './CB/power-point-handling.js';
import * as CBSCORM from './CB/scorm-handling.js';

//import {CreateDOM}  from './CB/createDOM.js';

let contentTracker = {}, counter = 1;

/* *****************************************************************************
 * CREATED
 *******************************************************************************/
Template.courseBuilderPage.onCreated( function() {
  //p  = FlowRouter.current().path;

  Blaze._allowJavascriptUrls();

  $( '#cover' ).show();

  this.page   = new ReactiveVar(1);
  this.total  = new ReactiveVar(1);

  //tracker to make sure page always has content before it can be saved/next(ed)
  this.contentTracker = { 
                          titles:0,
                          texts:0,
                          images:0,
                          pdfs:0,
                          ppts:0,
                          videos:0,
                          scorms:0,
                          tests:0
                        };

  this.titlesTracker  = [];
  this.textsTracker   = [];
  this.imagesTracker  = [];
  this.pdfsTracker    = [];
  this.pptsTracker    = [];
  this.scormsTracker  = [];
  this.testsTracker   = [];
  this.videosTracker  = [];

  this.page.set(1);
  this.total.set(1);
  
  
  let that = this;

  /*
   * JQUERY-UI
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {

    //---------------------------
    //        DRAGGABLE
    //---------------------------
    $( ".draggable" ).draggable({
      start: function( event, ui ) {

      },
      cursor: "move",
      helper: "clone",
      snap: true,
      /*handle: "img"*/
    });


    //-----------------------------
    //        DROPPABLE
    //-----------------------------
    $( '#fb-template' ).droppable({
      
      accept: '.draggable',
      
      drop: function( evt, ui ) {
        $( '.notice' ).remove();
        $( '#fb-template' ).css( 'background-color', 'white' );

        let draggedType = ui.draggable.data( 'type' );
        switch ( draggedType ) {
          
          case 'title':
            
            if ( ! testForVideoOrPdfOnPage( that.contentTracker ) ) {
              $( '#cb-toolbar-media' ).hide();
              $( '#cb-toolbar-video' ).hide();
              addTitle( evt.pageX, evt.pageY );
            } else {
              Bert.alert( 'Video, Pdf, PowerPoint, Scorm must be alone on page', 'danger' );
            }
            break;
            
          case 'text':
            
            if ( ! testForVideoOrPdfOnPage( that.contentTracker ) ) {
              $( '#cb-toolbar-media' ).hide();
              $( '#cb-toolbar-video' ).hide();
              addText( evt.pageX, evt.pageY );
            } else {
              Bert.alert( 'Video, Pdf, PowerPoint, Scorm must be alone on page', 'danger' );
            }

          /*
            $( '#add-text' ).modal( 'show' );
            Meteor.setTimeout( function() {
              AceEditor.instance( "editor",
                                  null,
                                  function(e) { e.setValue(""); }
                                );
            }, 300);
            */
            break;
            
          case 'g-image':
            
            if( S3.collection.findOne() ) {
              let id = S3.collection.findOne()._id;
              S3.collection.remove({ _id: id });
            }

            if ( ! testForVideoOrPdfOnPage( that.contentTracker ) ) {
              $( '#cb-toolbar-text' ).hide();
              $( '#cb-toolbar-video' ).hide();
              $( '#add-image' ).modal( 'show' );
            } else {
              Bert.alert( 'Video, Pdf, PowerPoint, Scorm must be alone on page', 'danger' );
            }
            break;
            
          case 'video':
            
            if ( testForItemsOnPage(that.contentTracker) )
            {
              
             Bert.alert(  
                        'Video must be the only item on the page!', 
                        'danger', 
                        'fixed-top', 
                        'fa-frown-o' 
                       );
             return;
             
            } else {
              $( '#cb-toolbar-text' ).hide();
              $( '#cb-toolbar-media' ).hide();
              addVideo();
            }
            break;
            
          case 'pdf':
            
            if ( testForItemsOnPage(that.contentTracker) )
            {
                  Bert.alert( 
                              'PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
                  
            } else {
              $( '#cb-toolbar-text' ).hide();
              $( '#cb-toolbar-media' ).hide();
              $( '#cb-toolbar-video' ).hide();
              $( '#add-pdf' ).modal( 'show' );
            }
            break;
            
          case 'powerpoint':
            
            if ( testForItemsOnPage(that.contentTracker) )
            {
                  Bert.alert( 
                              'PowerPoint must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
                  
            } else {
              $( '#cb-toolbar-text' ).hide();
              $( '#cb-toolbar-media' ).hide();
              $( '#cb-toolbar-video' ).hide();
              $( '#add-powerpoint' ).modal( 'show' );
            }
            break;
            
          case 'scorm':
            
            if ( testForItemsOnPage(that.contentTracker) )
            {
                  Bert.alert( 
                              'SCORM must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
                  
            } else {
              $( '#cb-toolbar-text' ).hide();
              $( '#cb-toolbar-media' ).hide();
              $( '#cb-toolbar-video' ).hide();
              $( '#add-scorm' ).modal( 'show' );
            }
            break;
            
          case 'test':
            
            if ( testForItemsOnPage(that.contentTracker) ) {
                  Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
            }
            
            if ( counter == 1 ) {
              Bert.alert( "A Course can't start with a test!", 'danger' );
              return;
            }
            
            $( '#cb-toolbar-text' ).hide();
            $( '#cb-toolbar-media' ).hide();
            $( '#cb-toolbar-video' ).hide();
            
            Session.set( 'obj', tbo );

            if ( Meteor.user().roles.teacher ) {
              FlowRouter.go( '/teacher/dashboard/test-maker/' + Meteor.userId() + `?${tbo.name}` );
            } else if ( Meteor.user().roles.admin ) {
              FlowRouter.go( '/admin/dashboard/test-maker/'   + Meteor.userId() + `?${tbo.name}` );
            }
  
            break;
            
          default:
            return;
        }

      }

    });

  //console.log('CourseBuilder:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'CourseBuilder:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------

  /*
   * ACE EDITOR INSTANTIATE

  let ace = AceEditor.instance( "editor",
                                {
                                  theme:"ambiance",
                                  mode:"ace/mode/text",
                                  setHighlightActiveLine:true,
                                  setShowPrintMargin:false,
                                  scrollToRow:0
                                }
  );
*/
//-------------------------------------------------------------------

  /*
   * SELECT2 INSTANTIATE
   */
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){
      $( '#tags' ).select2({
        allowClear:   true,
        tags:         true,
        placeholder: "Keywords"
      });
    });
    //console.log('CB:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'CB:: load select2.js fail' );
  });
//-------------------------------------------------------------------


  /*
   * HTML2CANVAS
   */
  $.getScript( '/js/html2canvas.js', function() {
    //console.log('CB:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'CB:: load html2canvas.js fail' );
  });
//-------------------------------------------------------------------

}); //END ONCREATED



/* *****************************************************************************
 * RENDERED
 *******************************************************************************/
Template.courseBuilderPage.onRendered( function() {

  $( '#cover' ).delay( 1000 ).fadeOut( 'slow',
                                      function() {
                                        $( "#cover" ).hide();
                                        $( ".dashboard-header-area" ).fadeIn( 'slow' );
                                      }
  );

  if (  FlowRouter.getQueryParam( "rtn" ) &&
        FlowRouter.getQueryParam( "id"  )
     )
  {
    //RESTORE THE SESSION
    tbo = Session.get( 'obj' );
    Session.set( 'obj', null );
    Session.set( 'test_id', FlowRouter.getQueryParam("id") );

    //Save the test
    $( '#cb-next-btn' ).click();
    return;
  }

  Meteor.setTimeout(function(){
    $( '#intro-modal' ).modal( 'show' );
  }, 0);
/*
  window.addEventListener( "beforeunload", function() {
    console.log( "Close web socket" );
    socket.close();
  });
*/

//-------------------------------------------------------------------
}); //END ONRENDERED




/* *****************************************************************************
 * HELPERS
 ******************************************************************************/
Template.courseBuilderPage.helpers({

  
  fname: () => {
    try {
      return Students.findOne({ _id: Meteor.userId() }).fname;
    } catch(e) {
      //console.log('ERROR: ' + e.name + ': ' + e.message );
      return;
    }
  },
  
	"files": function(){
	  
		return S3.collection.find();
		
	},
	
  page: () =>
    Template.instance().page.get(),

  total: () =>
    Template.instance().total.get()
});
//-------------------------------------------------------------------



/*
 * MODULE LEVEL VARIABLES
 */
let tbo       = {};

  tbo.titles  = [];
  tbo.texts   = [];
  tbo.images  = [];
  tbo.videos  = [];
  tbo.pages   = [];
  tbo.pdfs    = [];
  tbo.ppts    = [];
  tbo.scorms  = [];
  tbo.tests   = [];


/* *****************************************************************************
 * EVENTS
 *******************************************************************************/
Template.courseBuilderPage.events({

  /*
   * FOCUS #EDITOR

  'focus #editor'( e, t ){
    AceEditor.instance( "editor", null, function(e){
      e.$blockScrolling = Infinity;
    });
//-----------------------------------------------------------------------------
  },
*/
  
  
  

  /*
   *
   * .JS-BACK-TO-HOME  ::(CLICK)::
   */
  'click #course-builder-page-back'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
  
      t.titlesTracker = [];
      t.textsTracker  = [];
      t.imagesTracker = [];
  
      // ADVANCE PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
      tbo = {};
      tbo.titles  = [];
      tbo.texts   = [];
      tbo.images  = [];
      tbo.videos  = [];
      tbo.pages   = [];
      tbo.pdfs    = [];
      tbo.ppts    = [];
      tbo.scorms  = [];
      tbo.tests   = [];
      counter     = 0;
      
    if ( Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles.admin ) {
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
    }

//-------------------------------------------------------------------
  },



  /*
   * CB-NEXT  ::(CLICK)::
   */
  'click #cb-next-btn'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( t.page.get() < tbo.page ) {
        t.page.set( tbo.page );
    }
    
    if ( t.total.get() < tbo.total ) {
      t.total.set( tbo.total );
    }

    //SAVE TEST (IT'S OUTSIDE MAIN FLOW SO NEEDS TO BE CHECKED FIRST)
    if ( Session.get( 'test_id' ) ) {

      tbo.pages[ t.page.get() ] = {
                                    no: t.page.get(),
                                    page: Session.get( 'test_id' ),
                                    type: "test"
                                  };
      
      t.contentTracker.tests = 0;

      Session.set( 'test_id', null );
      
      t.contentTracker.tests = 0;

      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
      
      t.page.set(   t.page.get()  + 1 );
      t.total.set(  t.total.get() + 1 );

      tbo.page  = t.page.get();
      tbo.total = t.total.get();
      counter = t.page.get();
      
      Bert.alert( 
                  'Page successfully added.', 
                  'success', 
                  'growl-top-right' 
                );

    
      return;
    }


    if (  t.contentTracker.titles == 0 &&
          t.contentTracker.texts  == 0 &&
          t.contentTracker.images == 0 &&
          t.contentTracker.videos == 0 &&
          t.contentTracker.pdfs   == 0 &&
          t.contentTracker.ppts   == 0 &&
          t.contentTracker.scorms == 0 &&
          t.contentTracker.tests  == 0
        )
    {
          Bert.alert( 
                      'There is no content!', 
                      'danger', 
                      'fixed-top', 
                      'fa-frown-o' 
                    );
                    
          $(e.currentTarget).prop('disabled', false);
          return;
    }


    // ASSEMBLE THE PAGE
    //let cd = new CreateDOM( tbo );

    //DISABLE CLICK EVENT FOR ITEM INFO POP-UPS SO IT ISN"T CAPTURED
    t. titlesTracker.forEach(function(el){
      if ( el )
        $(`#tit-${el}`).off("mouseup");
    });

    t.textsTracker.forEach(function(el){
      if ( el )
        $(`#txt-${el}`).off("mouseup");
    });

    t.imagesTracker.forEach(function(el){
      if ( el )
        $(`#ig-${el}`).off("mouseup");
    });


    //SAVE VIDEO no, page, type
    if ( tbo.videos.length ) {
    
      tbo.pages[ t.page.get() ] = {
                                    no: t.page.get(),
                                    url: tbo.videos[0],
                                    type: "video"
                                  };
                                  
      tbo.videos                = [];

      // CLEAR THE DIV
      $( '#fb-template' ).empty();

      // CLEAR CONTENT TRACKER
      t.contentTracker.videos = 0;

      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
      
      // ADVANCE PAGE COUNTS
      t.page.set(  t.page.get()    + 1 );
      t.total.set( t.total.get()   + 1 );

      tbo.page  = t.page.get();
      tbo.total = t.total.get();
      counter = t.page.get();
      
      Bert.alert( 
                  'Page successfully added.', 
                  'success', 
                  'growl-top-right' 
                );
                
      $( '#cb-toolbar-video' ).hide();
      
      return;
    }

    //SAVE PDF
    if ( tbo.pdfs.length ) {
      let p   = t.page.get();
      
      // STORE THE PAGE
      tbo.pages[p] = {
                        no:   t.page.get(),
                        url:  tbo.pdfs[0].url,
                        type: "pdf",
                        pdf_id: tbo.pdfs[0].pdf_id
                     };
 
      // CLEAR PDF'S ARRAY     
      tbo.pdfs                = [];
      
      //CLEAR THE DIV
      $( '#fb-template' ).empty();
      
      //CLEAR CONTENT TRACKER
      t.contentTracker.pdfs = 0;
      
      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
  
      // ADVANCE PAGE COUNTS
      t.page.set(   p + 1 );
      t.total.set(  p + 1 );
      counter = t.page.get();
      
      //shadow page counts
      tbo.page  = t.page.get();
      tbo.total = t.total.get();
      
      Bert.alert( 
                  'Page successfully added.', 
                  'success', 
                  'growl-top-right' 
                );
      
      $( '#cb-toolbar-video' ).hide();
      return;
    }

    //SAVE PPT
    if ( tbo.ppts.length ) {
      tbo.pages[ t.page.get() ] = {
                                    no: t.page.get(),
                                    url: tbo.ppts[0],
                                    type: "ppt"
                                  };
                                  
      tbo.ppts                  = [];
      
      //CLEAR THE DIV
      $( '#fb-template' ).empty();
      
      //CLEAR CONTENT TRACKER
      t.contentTracker.ppts = 0;
      
      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
      
      //ADVANCE PAGE COUNTS
      t.page.set(   t.page.get()  + 1 );
      t.total.set(  t.total.get() + 1 );
      counter = t.page.get();
      
      tbo.page  = t.page.get();
      tbo.total = t.total.get();
      
      Bert.alert( 
                  'Page successfully added.', 
                  'success', 
                  'growl-top-right' 
                );
      
      return;
    }
    
    //SAVE SCORM
    if ( tbo.scorms.length ) {
      tbo.pages[ t.page.get() ] = {
                                    no:   t.page.get(),
                                    url:  tbo.scorms[0],
                                    type: "scorm"
                                  };
                                  
      tbo.scorms                = [];
      
      //CLEAR THE DIV
      $( '#fb-template' ).empty();
      
      //CLEAR CONTENT TRACKER
      t.contentTracker.scorms = 0;
      
      //ADVANCE PAGE COUNTS
      t.page.set(   t.page.get()  + 1 );
      t.total.set(  t.total.get() + 1 );
      counter = t.page.get();
      
      Bert.alert( 
                  'Page.successfully added.', 
                  'success', 
                  'growl-top-right' 
                );
      
      return;
      
    }
    

    /*
     * 
     * SAVE TITLES, TEXT, IMAGES
     *
     */
    if ( t.contentTracker.titles > 0 || t.contentTracker.texts > 0 || t.contentTracker.images > 0 ) {
      Bert.alert( 'Adding...', 'success', 'growl-top-right' );
      let p   = t.page.get()
        , url = ''
        , img;

        img = new Image();
  
        html2canvas( document.getElementById( 'fb-template' ) ).then( function( canvas ) {
          //document.body.appendChild(canvas);
          img = canvas.toDataURL()
           // STORE THE PAGE
          tbo.pages[p] = { 
                          no: p, 
                          page: img, 
                          type: "page" 
                         }; //cd.buildDOM();
  
          // CLEAR THE DIV
          $( '#fb-template' ).empty();
        });
    	
      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
  
      t.titlesTracker = [];
      t.textsTracker  = [];
      t.imagesTracker = [];
  
      // ADVANCE PAGE COUNTS
      t.page.set(   p   + 1 );
      t.total.set(  p   + 1 );
      counter = t.page.get();
      
      //shadow page counts
      tbo.page = t.page.get();
      tbo.total = t.total.get();
      $( '#cb-toolbar-text' ).hide();
      $( '#cb-toolbar-media' ).hide();
      return;
    }

/*
    // RE-INITIALIZE VARIABLES
    tbo.titles  = [];
    tbo.texts   = [];
    tbo.images  = [];


    CBTexts.cbTextReset();
    CBTitle.cbTitleReset();
    CBImage.cbImageReset();
    CBVideo.cbVideoReset();
*/
  return;
 //-------------------------------------------------------------------
  },




  /*
   *
   * #NEW-COURSE-SAVE  ::(CLICK)::
   *
   * id = intro-modal
   * opening modal dialog
   */
  'click #new-course-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //////////////////////////////////////////////////////////
    // HANDLE/HARDER ERROR CHECKING, NO ALLOW EMPTY FIELDS  //
    //////////////////////////////////////////////////////////

      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
  
      t.titlesTracker = [];
      t.textsTracker  = [];
      t.imagesTracker = [];
  
      // ADVANCE PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
      tbo = {};
      tbo.titles  = [];
      tbo.texts   = [];
      tbo.images  = [];
      tbo.videos  = [];
      tbo.pages   = [];
      tbo.pdfs    = [];
      tbo.ppts    = [];
      tbo.scorms  = [];
      tbo.tests   = [];
      counter     = 0; 
      
    let credits = t.$( '#course-builder-credits' ).val()

      , name    = t.$( '#course-builder-name'    ).val()

      , percent = t.$( '#course-builder-percent' ).val()

      , keys    = t.$( '#tags' ).val();

      if ( name == '' || credits == '' || percent == '' || keys == '' ) {
        
        Bert.alert( 
                    'All fields must be filled out!', 
                    'danger', 
                    'fixed-top', 
                    'fa-frown-o' 
                  );
        return;
      }
      
      if ( BuiltCourses.findOne({ name: name }) != undefined )
      {
        Bert.alert( 
                    'There is already a course with that name in your database!', 
                    'danger', 
                    'fixed-top', 
                    'fa-grown-o' 
                  );
        return;
      }
      
      tbo.name            = name;
      tbo.credits         = credits;
      tbo.passing_percent = percent;
      tbo.keywords        = keys;
      tbo.icon            = "/img/icon-4.png";

    //built_id = BuiltCourses.findOne({ name: name })._id;

    t.$( '#intro-modal' ).modal( 'hide' );
//-----------------------------------------------------------------------------
  },



  /*
   * #EXIT-CB  ::(CLICK)::
   *
   * Intro Modal Dialog
   */
  'click #exit-cb'( e, t ) {
    t.$( '#intro-modal' ).modal( 'hide' );
    
      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
  
      t.titlesTracker = [];
      t.textsTracker  = [];
      t.imagesTracker = [];
  
      // ADVANCE PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
      tbo = {};
      tbo.titles  = [];
      tbo.texts   = [];
      tbo.images  = [];
      tbo.videos  = [];
      tbo.pages   = [];
      tbo.pdfs    = [];
      tbo.ppts    = [];
      tbo.scorms  = [];
      tbo.tests   = [];
      counter     = 0;
      
    if ( Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles.admin ) {
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
    } 
  },
  
  
  
  
  /*
   *
   * #CB-SAVE  ::(CLICK)::
   *
   * bottom of screen
   */
  'click #cb-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    t.$( '#intro-modal' ).modal( 'hide' );
    if (
        t.page.get() === 1
       )
    {
          Bert.alert( 
                      'There is no content!', 
                      'danger', 
                      'fixed-top', 
                      'fa-frown-o' 
                    );
          return;
    }

    let role  = "admin"
      , cid   = Meteor.user().profile.company_id
      , uid   = Meteor.userId()
      //, apv   = ( Meteor.user().roles.teacher ) ? false : true
      , apv   = true
      , cd    = new Date();

    let built_id = BuiltCourses.insert({
                                          name:         tbo.name,
                                          pages:        tbo.pages,
                                          company_id:   cid,
                                          creator_type: role,
                                          creator_id:   uid,
                                          created_at:   cd,
                                      });
    Meteor.setTimeout(function(){
      Courses.insert({
                      built_id:         built_id,
                      credits:          Number( tbo.credits ),
                      name:             tbo.name,
                      passing_percent:  tbo.passing_percent,
                      company_id:       [cid],
                      times_completed:  0,
                      icon:             tbo.icon,
                      public:           false,
                      creator_type:     role,
                      creator_id:       uid,
                      created_at:       cd,
                      approved:         apv,
                      created_at:       cd
                    });
  
      Newsfeeds.insert({
                        owner_id:       Meteor.userId(),
                        poster:         Meteor.user().username,
                        poster_avatar:  Meteor.user().profile.avatar,
                        type:           "new-course",
                        private:        false,
                        news:           `A New Course has just been added: ${tbo.name}!`,
                        comment_limit:  3,
                        company_id:     Meteor.user().profile.company_id,
                        likes:          0,
                        date:           new Date()       
      });
    }, 300);
    
    Meteor.setTimeout(function(){
      Bert.alert( 
                  'Your test was saved!', 
                  'success', 
                  'growl-top-right' 
                );
    }, 500);
    
/*
      let params      = { _id: Meteor.userId() };
      let routeName   = "teacher-dashboard";
      let path        = FlowRouter.path( routeName, params );
      FlowRouter.go( path );
*/
      // CLEAR THE CONTENT TRACKER
      t.contentTracker.titles = 0;
      t.contentTracker.texts  = 0;
      t.contentTracker.images = 0;
      t.contentTracker.videos = 0;
      t.contentTracker.pdfs   = 0;
      t.contentTracker.ppts   = 0;
      t.contentTracker.scorms = 0;
      t.contentTracker.tests  = 0;
  
      t.titlesTracker = [];
      t.textsTracker  = [];
      t.imagesTracker = [];
  
      // ADVANCE PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
      tbo = {};
      tbo.titles  = [];
      tbo.texts   = [];
      tbo.images  = [];
      tbo.videos  = [];
      tbo.pages   = [];
      tbo.pdfs    = [];
      tbo.ppts    = [];
      tbo.scorms  = [];
      tbo.tests   = [];
      counter     = 0;

    if ( Meteor.user().roles.admin )
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
    if ( Meteor.user().roles.teacher )
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
    //Template.instance().page.set( 1 );
    //Template.instance().total.set( 1 );
//-------------------------------------------------------------------
  },
  
  
  
  /*
   *
   * #CB-TEST-SAVE  ::(CLICK)::
   *
   * id = add-test
   * add-test dialog
   */
  'click #cb-test-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set(   Template.instance().page.get()  + 1 );
    Template.instance().total.set(  Template.instance().total.get() + 1 );
    t.$( '#add-test' ).modal( 'hide' );
//-----------------------------------------------------------------------------
  },




  /*
   *
   * #CB-SCORM-SAVE  ::(CLICK)::
   *
   * id = add-scorm
   * scorm dialog
   */
  'click #cb-scorm-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //Meteor.call( 'scormStudentCourseStatus', 1, '68ac728a3a9686020674a6e614e2d7e3', 1 );
    //Meteor.call( 'scormListAllCourses' );
    //Meteor.call( 'scormListStudentCompletedCourses', 1, '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call( 'scormListCompanyCourses', 1 );
    //Meteor.call( 'scormListUserCourses', 1, '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call( 'scormListStudentStartedCourses', 1, '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call( 'scormCreateUser', '123', 'pass', 1 );
    /*
    let r = Meteor.call( 'scormGetCoursePlayURL', 'demo_user', 1, 1, function (error, result) {
            if (!error) {
              Session.set("resp", result);
            }
          });

    */
    Template.instance().page.set(   Template.instance().page.get()  + 1 );
    Template.instance().total.set(  Template.instance().total.get() + 1 );
    t.$( '#add-scorm' ).modal( 'hide' );
//-----------------------------------------------------------------------------
  },



  /*
   *
   * #COURSE-BUILDER-POWERPOINT  ::(CHANGE)::
   *
   */
   'change #course-builder-powerpoint'( e, t ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      CBPP.cbPowerPointChange( e, t, tbo, PowerPoints );  
   },
   
   

  /*
   *
   * #CB-POWERPOINT-SAVE  ::(CLICK)::
   *
   * id = add-powerpoint
   * powerpoint dialog
   */
  'click #cb-powerpoint-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    CBPP.cbPowerPointSave( e, t, tbo, contentTracker );
    t.$( '#add-powerpoint' ).modal( 'hide' );
//-----------------------------------------------------------------------------
  },



  /*
   *
   * #COURSE-BUILDER-PDF  ::(CHANGE)::
   *
   * PDF input element
   * type = files
   */
  'change #course-builder-pdf'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    CBPDF.cbPDFChange( e, t, tbo, Pdfs );
//-----------------------------------------------------------------------------
  },



  /*
   *
   * #CB-PDF-SAVE  ::(CLICK)::
   *
   * id = add-pdf
   * pdf dialog
   */
  'click #cb-pdf-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    CBPDF.cbPDFSave( e, t, tbo, t.contentTracker );
  },



  /*
   *
   * #COURSE-BUILDER-IMAGE ::(CHANGE)::
   *
   */
  'change #course-builder-image'( e, t ) {

    CBImage.cbImageChange( e, t, tbo /*, Images */ );
  },



  /*
   *
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *
   */
  'click #cb-image-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    CBImage.cbImageSave( e, t, tbo, t.contentTracker, t.imagesTracker );
  },



  /*
   *
   * #ADDED-TITLE  ::(BLUR)::
   *
   */
  'blur #added-title'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    CBTitle.cbAddedTitleBlur( e, t, tbo, t.contentTracker, t.titlesTracker );
  },



  /*
   *
   * #ADDED-TEXT  ::(BLUR)::
   *
   */
  'blur #added-text'( e, t ) {
    CBTexts.cbAddedTextBlur( e, t, tbo, t.contentTracker, t.textsTracker );
  },



  /*
   *
   * #ADDED-VIDEO  ::(CHANGE)::
   *
   */
  'change #added-video'( e, t ) {

    CBVideo.addedVideoURL( e, t, tbo, t.contentTracker );
  },
  
  
  /*
   * CB-INTRO-MODAL-CANCEL
   *
   */
   'click #cb-intro-modal-cancel'( e, t ) {
      e.preventDefault();
      
      t.$( '#intro-modal' ).modal( 'hide' );
      Meteor.setTimeout(function(){
        if ( Meteor.user().roles.admin ) {
          FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
          return;
        } else if ( Meteor.user().roles.teacher ) {
          FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
          return;
        }
      }, 500);
   },
   
   
   
  /*
   * KEEP VALUES CONSTRAINED
   */
  'blur #course-builder-credits'( e, t ) {
    let v = t.$( '#course-builder-credits' ).val();
    if ( v > 120 )  t.$( '#course-builder-credits' ).val( 120 );
    if ( v < 0   )  t.$( '#course-builder-credits' ).val(  0  );
  },

  
  /*
   * KEEP VALUES CONSTRAINED
   */
  'blur #course-builder-percent'( e, t ) {
    let v = t.$( '#course-builder-percent' ).val();
    if ( v > 100 )  t.$( '#course-builder-percent' ).val( 100 );
    if ( v < 0   )  t.$( '#course-builder-percent' ).val(  0  );
  },
  
  
  
  /* *****************************************************************
   * MOUSE OVER'S AND HOVER'S FOR CB DRAG AND DROP
   *
   ***************************************************************** */
   
   /*
    * MOUSEOVER TITLE
    */
  'mouseover .cb-img-title'( e, t ) { //hover
    $( '.cb-img-title' ).prop( 'src', '/img/title-dark.png' );
  },
//---------------------------------------------------------


  /*
   * MOUSEOUT TITLE
   */
  'mouseout .cb-img-title'( e, t ) {
    $( '.cb-img-title' ).prop( 'src', '/img/title.png' );
  },
//---------------------------------------------------------

  /*
   * MOUSEUP TITLE
   */
  'mouseup .cb-img-title'( e, t ) {
    $( '.cb-img-title' ).prop( 'src', '/img/title.png' );
  },
//---------------------------------------------------------


  /*
   * MOUSEOVER TEXT
   */
  'mouseover .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text-dark.png' );
  },
//----------------------------------------------------------


  /*
   * MOUSEOUT TEXT
   */
  'mouseout .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text.png' );
  },
//-----------------------------------------------------------


  /*
   * MOUSEUP TEXT
   */
  'mouseup .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text.png' );
  },
//---------------------------------------------------------


  /*
   * MOUSEOVER IMAGE
   */
  'mouseover .cb-img-image'( e, t ) {
     $( '.cb-img-image' ).prop( 'src', '/img/images-dark.png' );
   },
//------------------------------------------------------------


   /*
    * MOUSEOUT IMAGE
    */
  'mouseout .cb-img-image'( e, t ) {
    $( '.cb-img-image' ).prop( 'src', '/img/images.png' );
  },
//-------------------------------------------------------------


  /*
   * MOUSEUP IMAGE
   */
  'mouseup .cb-img-image'( e, t ) {
    $( '.cb-img-image' ).prop( 'src', '/img/images.png' );
  },
//---------------------------------------------------------  


  /*
   * MOUSEOVER PDF
   */
  'mouseover .cb-img-pdf'( e, t ) {
    $( '.cb-img-pdf' ).prop( 'src', '/img/pdf-dark.png' );
  },
//-------------------------------------------------------------


  /*
   * MOUSEOUT PDF
   */
  'mouseout .cb-img-pdf'( e, t ) {
    $( '.cb-img-pdf' ).prop( 'src', '/img/pdf.png' );
  },
//--------------------------------------------------------------


  /*
   * MOUSEUP PDF
   */
  'mouseup .cb-img-pdf'( e, t ) {
    $( '.cb-img-pdf' ).prop( 'src', '/img/pdf.png' );
  },
//---------------------------------------------------------


  /*
   * MOUSEOVER PPT
   */
  'mouseover .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt-dark.png' );
  },
//--------------------------------------------------------------


  /*
   * MOUSEOUT PPT
   */
  'mouseout .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt.png' );
  },
//--------------------------------------------------------------


  /*
   * MOUSEUP PPT
   */
  'mouseup .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt.png' );
  },
//---------------------------------------------------------


  /*
   * MOUSEOVER SCORM
   */
  'mouseover .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm-dark.png' );
  },
//---------------------------------------------------------------


  /*
  * MOUSEOUT SCORM
  */
  'mouseout .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm.png' );
  },
//----------------------------------------------------------------


  /*
   * MOUSEUP SCORM
   */
  'mouseup .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm.png' );
  },
//---------------------------------------------------------


  /*
   * MOUSEOVER TEST
   */
  'mouseover .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test-dark.png' );
  },
//-----------------------------------------------------------------


  /*
   * MOUSEOUT TEST
   */
  'mouseout .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test.png' );
  },
//-----------------------------------------------------------------


  /*
   * MOUSEUP TEST
   */
  'mouseup .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test.png' );
  },
//---------------------------------------------------------


  /*
   * MOUSEOVER VIDEO
   */
  'mouseover .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos-dark.png' );
  },
//------------------------------------------------------------------


  /*
   * MOUSEOUT VIDEO
   */
  'mouseout .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos.png' );
  },
//------------------------------------------------------------------


  /*
   * MOUSEUP VIDEO
   */
  'mouseup .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos.png' );
  },
//---------------------------------------------------------
});



function addTitle( x, y ) {

  let holder = $( `<input id="added-title" type="text" style="fdborder-radius:5px;z-index:2;position:absolute;width:65%;margin-left:12%;margin-right:12%" autofocus/>` )
    .css( 'color', 'grey' );
  $( '#fb-template' ).append(holder);
  
  let pos = $('#added-title').position();
  let x1  = pos.left;
  let y1  = pos.top;

  $( '#added-title').offset({ left: x - x1, top: y - y1 });
  $(holder).effect( "highlight", {}, 2000 );
}


function addText( x, y ) {

  $( '#fb-template' ).append( '<textarea id="added-text" rows="3" style="z-index:2;border-radius:5px;position:absolute;margin-left:10%;margin-right:10%;width:73%;" autofocus></textarea>' )
    .css( 'color', 'grey' );

  let pos = $('#added-text').position();
  let x1  = pos.left;
  let y1  = pos.top;
  
  $( '#added-text' ).offset({ left: x - x1, top:  y - y1 });
  $( '#added-text' ).effect( "highlight", {}, 2000 );
}



function addVideo() {

  $( '#fb-template' ).append( '<input id="added-video" type="text" style="border-radius:5px;width:75%;margin-left:12%;margin-right:12%;" placeholder="Add YouTube URL here" autofocus/>' )
    .css( 'border', '1px dashed grey' ); //.effect( "highlight", {}, 2000 );
}

function testForItemsOnPage( ct ) {
  if (
        ct.titles != 0 ||
        ct.texts  != 0 ||
        ct.images != 0 ||
        ct.videos != 0 ||
        ct.pdfs   != 0 ||
        ct.ppts   != 0 ||
        ct.scorms != 0
      )
  {
    return true;
  } else {
    return false;
  }
}

function testForVideoOrPdfOnPage( ct ) {
  if ( ct.videos != 0 || ct.pdfs != 0 ) {
    return true;
  } else {
    return false;
  }
}