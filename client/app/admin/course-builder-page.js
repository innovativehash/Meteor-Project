import '../../../public/bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css';

import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { BuiltCourses }   from '../../../both/collections/api/built-courses.js';
import { Courses }        from '../../../both/collections/api/courses.js';
import { Students }       from '../../../both/collections/api/students.js';

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

/*
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.structure.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.theme.min.css';
*/


/* *****************************************************************************
 * CREATED
 *******************************************************************************/
Template.courseBuilderPage.onCreated( function() {
  //p  = FlowRouter.current().path;

  $( '#cover' ).show();

  this.page   = new ReactiveVar(1);
  this.total  = new ReactiveVar(1);

  //tracker to make sure page always has content before it can be saved/next(ed)
  this.contentTracker = { titles:0,
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

  this.page.set(1);
  this.total.set(1);
  
  let that = this;

  /*
   * JQUERY-UI
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {

    //-------------------------
    //      DIALOG
    //-------------------------
    $( "#dialog" ).dialog({
      autoOpen: false,
      close: function( event, ui ) {
        $( '#js-bold-button' ).removeClass( 'active' );
        $( '#js-italic-button' ).removeClass( 'active' );
        $( '#js-underline-button' ).removeClass( 'active' );
      }
    });

    // DIALOG BOLD BUTTON
    $( '#js-bold-button' ).on( "click", function(e){
      let bold  = $( '#js-cb-text-dialog' ).val()
        , id    = bold.slice( bold.lastIndexOf( '-' ) + 1 );

      if ( $(this).hasClass( 'active' ) ) {
         ( `${bold}` ).css( 'font-weight', '' );
      } else {
        $( `${bold}` ).css( 'font-weight', 'bold' );
      }
      if ( bold.indexOf( 'txt' ) != -1 ) {
        tbo.texts[id].fontWeight = $( `${bold}` ).css( 'font-weight' );
      } else if ( italic.indexOf( 'tit' ) != -1 ) {
        tbo.titles[id].fontWeight = $( `${bold}` ).css( 'font-weight' );
      }
    });

    // DIALOG ITALIC BUTTON
    $( '#js-italic-button' ).on( "click", function(e){

      let italic  = $( '#js-cb-text-dialog' ).val()
        , id      = italic.slice( italic.lastIndexOf( '-' ) + 1 );

      if ( $(this).hasClass( 'active' ) ) {
        $( `${italic}` ).css( 'font-style', '');
      } else {
        $( `${italic}` ).css( 'font-style', 'italic' );
      }
      if ( italic.indexOf( 'txt' ) != -1 ) {
        tbo.texts[id].fontStyle = $( `${italic}` ).css( 'font-style' );
      } else if ( italic.indexOf( 'tit' ) != -1 ) {
        tbo.titles[id].fontStyle = $( `${italic}` ).css( 'font-style' );
      }
    });

    // DIALOG UNDERLINE BUTTON
    $( '#js-underline-button' ).on( "click", function(e){

      let underline = $( '#js-cb-text-dialog' ).val()
        , id        = underline.slice( underline.lastIndexOf( '-' ) + 1);

      if ( $(this).hasClass( 'active' ) ) {
        $( `${underline}` ).css( 'text-decoration', '' );
      } else {
        $( `${underline}` ).css( 'text-decoration', 'underline' );
      }
      if ( underline.indexOf( 'txt' ) != -1 ) {
        tbo.texts[id].textDecoration = $( `${underline}` ).css( 'text-decoration' );
      } else if ( underline.indexOf('tit') != -1 ) {
        tbo.titles[id].textDecoration = $( `${underline}` ).css( 'text-decoration' );
      }
    });


    //-------------------------------
    //       DIALOG OPACITY SLIDER
    //-------------------------------
    $( "#slider-range" ).slider({

      slide: function( event, ui ) {
        let opacity = $( '#js-cb-text-dialog' ).val();

        $( "label[for='slider-range']" ).html( ui.value );

        $( `${opacity}`).css( 'opacity', ui.value/100 );
      }
    });

    $( "#slider-range" ).slider( "value", 100 );



    //---------------------------
    //        DRAGGABLE
    //---------------------------
    $( ".draggable" ).draggable({
      start: function( event, ui ) {

      },
      //cursor: "move",
      helper: "clone",
      zIndex: 1000
    });


    //-----------------------------
    //        DROPPABLE
    //-----------------------------
    $( '#fb-template' ).droppable({
      accept: '.draggable',
      drop: function( evt, ui ) {
        //$( this )
          //.addClass( "ui-state-highlight" )
        //$(this).html( ui.draggable.data('dt'));
        //.css( 'border', '1px dashed blue' ).css( 'color', 'grey' );
        $( '.notice' ).remove();
        $( '#fb-template' ).css( 'background-color', 'white' );

        let draggedType = ui.draggable.data( 'type' );
        switch ( draggedType ) {
          case 'title':
            addTitle();
            break;
          case 'text':
            addText();
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
          case 'image':
          $( '#add-image' ).modal( 'show' );
            //addImage();
            break;
          case 'video':
            if ( testForItemsOnPage(that.contentTracker) )
            {
             Bert.alert( 'Video must be the only item on the page!', 'danger', 'fixed-top', 'fa-frown-o' );
             return;
            } else {
              addVideo();
            }
            break;
          case 'pdf':
            if ( testForItemsOnPage(that.contentTracker) )
            {
                  Bert.alert( 'PDF must be the only item on the page!', 'danger', 'fixed-top', 'fa-frown-o' );
                  return;
            } else {
              $( '#add-pdf' ).modal( 'show' );
            }
            break;
          case 'powerpoint':
            if ( testForItemsOnPage(that.contentTracker) )
            {
                  Bert.alert( 'PowerPoint must be the only item on the page!', 'danger', 'fixed-top', 'fa-frown-o' );
                  return;
            } else {
              $( '#add-powerpoint' ).modal( 'show' );
            }
            break;
          case 'scorm':
            if ( testForItemsOnPage(that.contentTracker) )
            {
                  Bert.alert( 'SCORM must be the only item on the page!', 'danger', 'fixed-top', 'fa-frown-o' );
                  return;
            } else {
              $( '#add-scorm' ).modal( 'show' );
            }
            break;
          case 'test':
            if ( testForItemsOnPage(that.contentTracker) )
            {
                  Bert.alert( 'A Test must be the only item on the page!', 'danger', 'fixed-top', 'fa-frown-o' );
                  return;
            } else {

              Session.set( 'obj', tbo );

              if ( Meteor.user().roles.teacher ) {
                FlowRouter.go( '/teacher/dashboard/test-maker/' + Meteor.userId() + `?${tbo.name}` );
              } else if ( Meteor.user().roles.admin ) {
                FlowRouter.go( '/admin/dashboard/test-maker/' + Meteor.userId()   + `?${tbo.name}` );
              }
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
    $(document).ready(function(){
      $( '#tags' ).select2({
        allowClear: true,
        tags: true
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
    tbo = Session.get('obj');
    Session.set( 'obj', null );
    Session.set( 'test_id', FlowRouter.getQueryParam("id"));

    //Save the test
    $('#cb-next-btn').click();
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
 *******************************************************************************/
Template.courseBuilderPage.helpers({

  fname: () => {
    try {
      return Students.findOne({ _id: Meteor.userId() }).fname;
    } catch(e) {
      //console.log('ERROR: ' + e.name + ': ' + e.message );
      return;
    }
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
let tbo         = {};

  //tbo.titles  = [];
  //tbo.texts   = [];
  //tbo.images  = [];
  tbo.videos  = [];
  tbo.pages   = [];


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
  'click .page-back-home'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

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
    if ( Session.get('test_id') ) {

      tbo.pages[ t.page.get() ] = {
                                    no: tbo.page,
                                    page: Session.get('test_id'),
                                    type: "test"
                                  };

      Session.set('test_id', null);
      t.contentTracker.tests = 0;

      t.page.set( t.page.get()    + 1);
      t.total.set( t.total.get()  + 1);

      tbo.page  = t.page.get();
      tbo.total = t.total.get();
      Bert.alert( 'Page successfully added.', 'success', 'growl-top-right' );

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
          Bert.alert( 'There is no content!', 'danger', 'fixed-top', 'fa-frown-o' );
          $(e.currentTarget).prop('disabled', false);
          return;
    }


    // ASSEMBLE THE PAGE
    //let cd = new CreateDOM( tbo );

    //DISABLE CLICK EVENT FOR ITEM INFO POP-UPS SO IT ISN"T CAPTURED
    t. titlesTracker.forEach(function(el){
      $(`#div_title-${el}`).off("mouseup");
    });

    t.textsTracker.forEach(function(el){
      $(`#span_text-${el}`).off("mouseup");
    });

    t.imagesTracker.forEach(function(el){
      $(`#ig-${el}`).off("mouseup");
    });

    //SAVE VIDEO
    if ( tbo.videos.length ) {
      tbo.pages[ t.page.get() ] = tbo.videos[0];
      tbo.videos                = [];

      // CLEAR THE DIV
      $( '#fb-template' ).empty();

      // CLEAR CONTENT TRACKER
      t.contentTracker.videos = 0;

      // ADVANCE PAGE COUNTS
      t.page.set(  t.page.get()    + 1 );
      t.total.set( t.total.get()   + 1 );

      tbo.page  = t.page.get();
      tbo.total = t.total.get();
      Bert.alert( 'Page successfully added.', 'success', 'growl-top-right' );

      return;
    }


    //SAVE TITLES, TEXT, IMAGES
    Bert.alert( 'Adding...', 'success', 'growl-top-right' );
    let p   = t.page.get();

    //LOCK THINGS OUT FOR NORMAL ITEM INFO POP-UP TIMER
    Meteor.setTimeout(function(){
      let img = new Image();

      html2canvas(document.getElementById( 'fb-template' )).then( function(canvas) {
        //document.body.appendChild(canvas);
        img = canvas.toDataURL()

         // STORE THE PAGE
        tbo.pages[p] = { no: p, page: img }; //cd.buildDOM();

        // CLEAR THE DIV
        $( '#fb-template' ).empty();

        //document.getElementById("foo").src = img;
      });
    }, 2000);

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
    //shadow page counts
    tbo.page = t.page.get();
    tbo.total = t.total.get();


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


    let credits = t.$( '#course-builder-credits' ).val()

      , name    = t.$( '#course-builder-name'    ).val()

      , percent = t.$( '#course-builder-percent' ).val()

      , keys    = t.$( '#tags' ).val();

      if ( name == '' || credits == '' || percent == '' || keys == '' ) {
        Bert.alert( 'All fields must be filled out!', 'danger', 'fixed-top', 'fa-frown-o' );
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
          Bert.alert( 'There is no content!', 'danger', 'fixed-top', 'fa-frown-o' );
          return;
    }

    if ( BuiltCourses.findOne({ name: tbo.name }) != undefined )
    {
      Bert.alert( 'There is already a course with that name in your database!', 'danger', 'fixed-top', 'fa-grown-o' );
      return;
    }


    let role  = ( Meteor.user().roles.teacher ) ? "teacher" : "admin"
      , cid   = Meteor.user().profile.company_id
      , uid   = Meteor.userId()
      //, apv   = ( Meteor.user().roles.teacher ) ? false : true
      , apv   = true
      , cd    = new Date();

    let built_id = BuiltCourses.insert({
                                          name: tbo.name,
                                          pages: tbo.pages,
                                          company_id: cid,
                                          creator_type: role,
                                          creator_id: uid,
                                          created_at: cd,
                                      });

    Courses.insert({
                    built_id: built_id,
                    credits: tbo.credits,
                    num: 1,
                    name: tbo.name,
                    passing_percent: tbo.passing_percent,
                    company_id: cid,
                    times_completed: 0,
                    icon: tbo.icon,
                    public: false,
                    creator_type: role,
                    creator_id: uid,
                    created_at: cd,
                    approved: apv
                  });

    Meteor.setTimeout(function(){
      Bert.alert( 'Your test was saved!', 'success', 'growl-top-right' );
    }, 500);
    

      if ( Meteor.user().roles.teacher ) {

      let params      = { _id: Meteor.userId() };
      let routeName   = "teacher-dashboard";
      let path        = FlowRouter.path( routeName, params );
      FlowRouter.go( path );
      //FlowRouter.go( '/teacher/dashboard/' + Meteor.userId() );
      } else if ( Meteor.user().roles.admin ) {
        FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
      }


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

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
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

    Template.instance().page.set( Template.instance().page.get()    + 1 );
    Template.instance().total.set( Template.instance().total.get()  + 1 );
    t.$( '#add-scorm' ).modal( 'hide' );
//-----------------------------------------------------------------------------
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

    CBPDF.cbPDFChange( e, t, tbo );
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
    CBImage.cbImageChange( e, t, tbo );
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
  }

});



function addTitle() {

  let holder = $( '<input id="added-title" type="text" style="border-radius:5px;z-index:2;position:absolute;width:65%;margin-left:12%;margin-right:12%" autofocus/>' )
    .css( 'color', 'grey' );
  $( '#fb-template' ).append(holder);

  $(holder).effect( "highlight", {}, 2000 );
}


function addText() {

  $( '#fb-template' ).append( '<textarea id="added-text" rows="3" style="z-index:2;border-radius:5px;position:absolute;margin-left:10%;margin-right:10%;width:73%;" autofocus></textarea>' )
    .css( 'color', 'grey' );

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