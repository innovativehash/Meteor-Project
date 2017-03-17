/*
 * @module courseBuilderPage
 *
 * @programmer <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import async              from 'async';
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { BuiltCourses }   from '../../../both/collections/api/built-courses.js';
import { Pages }          from '../../../both/collections/api/pages.js';
import { Courses }        from '../../../both/collections/api/courses.js';
import { Students }       from '../../../both/collections/api/students.js';
import { Images }         from '../../../both/collections/api/images.js';
import { Pdfs }           from '../../../both/collections/api/pdfs.js';
import { PowerPoints }    from '../../../both/collections/api/powerpoints.js';
import { Newsfeeds }      from '../../../both/collections/api/newsfeeds.js';

import './course-builder-page.html';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.css';


/*
 * IMPORT BROKEN-OUT EVENT HANDLERS
 */
import * as CBCreateDOM from './createDOM.js';
import * as CBImage from './image-handling.js';
import * as CBTitle from './title-handling.js';
import * as CBTexts from './texts-handling.js';
import * as CBVideo from './video-handling.js';
import * as CBPDF   from './pdf-handling.js';
import * as CBPP    from './power-point-handling.js';
import * as CBSCORM from './scorm-handling.js';

//import {CreateDOM}  from './CB/createDOM.js';

let contentTracker 
  , counter         = 1
  , master_num      = 0
  , P               = new Mongo.Collection(null)
  , db_id           = ''
  , editor1
  , page      //this
  , total;    //this
    


/*=========================================================
 *  CREATED
 *=======================================================*/
Template.courseBuilderPage.onCreated( function() {
  //p  = FlowRouter.current().path;

  $( '#prompt' ).hide();
  
  Blaze._allowJavascriptUrls();

  $( '#cover' ).show();

  this.page   = new ReactiveVar(1)
  this.total  = new ReactiveVar(1);

  this.page.set(1);
  this.total.set(1);
  
  $('#p').attr('data-p', 1);
  
  Session.set('tbo', {});
  
  let that = this;

  /**************
   * JQUERY-UI
   *************/
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {

    //---------------------------
    //        DRAGGABLE
    //---------------------------
    $( ".draggable" ).draggable({
      start: function( event, ui ) {

      },
      cursor: "move",
      helper: "clone",
      snap:   true,
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

        let draggedType = ui.draggable.data( 'type' )
          , p = $('#p').attr('data-p')
          , t = $('#p').attr('data-t');
          
        switch ( draggedType ) {
          
          case 'title':
            // that.contentTracker
            if ( ! testForVideoOrPdfOnPage( Session.get('contentTracker'), p  ) ) {
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-toolbar-video' ).hide();
              
              addTitle( evt.pageX, evt.pageY );
            } else {
              Bert.alert( 'Video, Pdf, PowerPoint, Scorm must be alone on page', 
                          'danger' );
            }
            break;
            
          case 'text':
            
            if ( ! testForVideoOrPdfOnPage( Session.get('contentTracker'), p ) ) {
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-toolbar-video' ).hide();
              
              //CREATE A NEW EDITOR INSTANCE INSIDE THE <div id="editor">
              //ELEMENT, SETTING ITS VALUE TO HTML. 
			        let config  = {}
			          , html    = "";
			          
              $('#cb-text-toolbar').show()

			       editor1 = CKEDITOR.appendTo( 'editor1', config, html );
			          
              addText( evt.pageX, evt.pageY );
            } else {
              Bert.alert( 'Video, Pdf, PowerPoint, Scorm must be alone on page', 
                          'danger' );
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

            if ( ! testForVideoOrPdfOnPage( Session.get('contentTracker') ) ) {
              $( '#cb-toolbar-title' ).hide();
              $( '#cb-toolbar-video' ).hide();
              
              $( '#add-image' ).modal( 'show' );
            } else {
              Bert.alert( 'Video, Pdf, PowerPoint, Scorm must be alone on page', 
                          'danger' );
            }
            break;
            
          case 'video':
            
            if ( testForItemsOnPage( Session.get('contentTracker'), pv ))
            {
              
             Bert.alert(  
                        'Video must be the only item on the page!', 
                        'danger', 
                        'fixed-top', 
                        'fa-frown-o' 
                       );
             return;
             
            } else {
              $( '#cb-toolbar-title' ).hide();
              $( '#cb-media-toolbar' ).hide();

              addVideo();
            }
            break;
            
          case 'pdf':
            
            if ( testForItemsOnPage( Session.get('contentTracker'), p ) )
            {
                  Bert.alert( 
                              'PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
                  
            } else {
              
              $( '#cb-toolbar-title' ).hide();
              $( '#cb-media-toolbar' ).hide();
              
              $( '#add-pdf' ).modal( 'show' );
              
            }
            break;
            
          case 'powerpoint':
            
            if ( testForItemsOnPage( Session.get('contentTracker'), p ) )
            {
                  Bert.alert( 
                              'PowerPoint must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
                  
            } else {
              
              $( '#cb-toolbar-title' ).hide();
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-toolbar-video' ).hide();
              
              $( '#add-powerpoint' ).modal( 'show' );
              
            }
            break;
            
          case 'scorm':
            
            if ( testForItemsOnPage( Session.get('contentTracker'), p ) )
            {
                  Bert.alert( 
                              'SCORM must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
                  
            } else {
              
              $( '#cb-toolbar-title' ).hide();
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-toolbar-video' ).hide();
              
              $( '#add-scorm' ).modal( 'show' );
              
            }
            break;
            
          case 'test':

            if ( testForItemsOnPage( Session.get('contentTracker'), p ) ) {
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
          
            $( '#cb-toolbar-title'  ).hide();
            $( '#cb-media-toolbar' ).hide();
            $( '#cb-toolbar-video' ).hide();
            
            let tb = Session.get( 'tbo' );
            tb.page = p;
            tb.total = t;
            tb.name = 'foo';
            Session.set('tbo', tb );
            Session.set( 'obj', tb );

            if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
              FlowRouter.go( '/teacher/dashboard/test-maker/' 
                + Meteor.userId() + `?${tb.name}` );
            } else if ( Meteor.user().roles && Meteor.user().roles.admin ) {
              FlowRouter.go( '/admin/dashboard/test-maker/'   + Meteor.userId() 
                + `?${tb.name}` );
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

  /*************************
   * ACE EDITOR INSTANTIATE
   ************************/
/*
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



  /*********************
   * SELECT2 INSTANTIATE
   ********************/
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



  /*******************
   * HTML2CANVAS
   ******************/
  //$.getScript( '/js/html2canvas.js', function() {
    //console.log('CB:: chosen,jquery.min.js loaded...');
  //}).fail( function( jqxhr, settings, exception ) {
    //console.log( 'CB:: load html2canvas.js fail' );
  //});
//-------------------------------------------------------------------

}); //END ONCREATED



/*=========================================================
 * RENDERED
 *========================================================*/
Template.courseBuilderPage.onRendered( function() {


  
  $( '#cover' )
    .delay( 1000 )
    .fadeOut( 'slow',
              function() {
                $( "#cover" ).hide();
                $( ".dashboard-header-area" ).fadeIn( 'slow' );
              }
  );

  $('#test_v').hide();
  
  $('#cb-text-toolbar').hide();
  $('#cb-media-toolbar').hide();
  $('#cb-title-toolbar').hide();
  $('#cb-video-toolbar').hide();
  
  if (  FlowRouter.getQueryParam( "rtn" ) &&
        FlowRouter.getQueryParam( "id"  )
     )
  {
    
    //RESTORE THE SESSION
    let tb = Session.get( 'obj' );
    Session.set( 'obj', null );
    Session.set( 'tbo', tb );
    
    let ct = Session.get( 'contentTracker' );
    if ( tb && tb.page ) {
      ct.page_no[Number(tb.page)].tests++;
    }
    Session.set('contentTracker', ct);
    Session.set( 'test_id', FlowRouter.getQueryParam("id") );
    Session.set( 'Scratch', FlowRouter.getQueryParam('id') );
    
    //Save the test
    $( '#cb-next-btn' ).click();
      
    return;
  }
  
  if (  FlowRouter.getQueryParam( "rtn" ) &&
        FlowRouter.getQueryParam( "cancel" )
     )
  {
    //console.log( FlowRouter.getQueryParam('rtn'));
    //console.log( FlowRouter.getQueryParam('cancel'));
    //console.log( Session.get('tbo'));
    //console.log( Session.get('obj'));
  
    tb = Session.get( 'obj' );
    if ( tb && tb.page && tb.total ) {
      this.page.set( tb.page );
      this.total.set( tb.total );
    } else {
      console.log('fail');
    }
    Session.set('tbo', tb);
    Session.set('obj', null);
    tb = null;
    return
  }
  

  Meteor.setTimeout(function(){
    let returnFromTest = Session.get('test_id');

    //IF WE'RE RELOADING TO CLEAR URL AFTER RETURNING FROM TEST BUILDING
    if ( _.isNull( returnFromTest ) || _.isUndefined( returnFromTest ) ) {
      console.log('show modal');
      $( '#intro-modal' ).modal( 'show' );
      
    //OTHERWISE, WE'RE HERE FRESH
    } else {
      console.log('----------------------');
      console.log('RETURN');
      return;
    }
  }, 0);
/*
  window.addEventListener( "beforeunload", function() {
    console.log( "Close web socket" );
    socket.close();
  });
*/

//-------------------------------------------------------------------
}); //END ONRENDERED




/*=========================================================
 * HELPERS
 *=======================================================*/
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






/*=========================================================
 * EVENTS
 *=======================================================*/
Template.courseBuilderPage.events({

/**********************************************************
 * #CB-EDITOR-SAVE-TEXT  ::(CLICK)::
 *********************************************************/
 'click #cb-editor-save-text'( e, t ) {
   e.preventDefault();
   
   	let txt = editor1.getData(); //CKEDITOR.instances.editor1.getData();
		
		Bert.alert('Saving Text...', 'success');
    
    //CKEDITOR.instances.editor1.setData('');
    
	  editor1.destroy();
		editor1 = null;
		
    $('#cb-text-toolbar').hide()
	  
    CBTexts.cbAddedTextBlur(  e,
                              t, 
                              txt,
                              t.page.get(),
                              master_num++,
                              P
                            );
 },
//---------------------------------------------------------



/**********************************************************
 * .JS-CB-TEXT-EDIT  ::(CLICK)::
 *********************************************************/
 'click .js-cb-text-edit'( e, t ) {
    e.preventDefault();

      //IE #txt-0
      let currentItem = $( '#cb-current' ).val()
        , text        = $( `${currentItem}` ).text()
        , config      = {};
        
      editor1 = CKEDITOR.appendTo( 'editor1', config, text ); 
        
      $( `#${currentItem}` ).hide();
      
      //CKEDITOR.instances.editor1.setData(text);
      
      
      //$('#cb-text-toolbar').show()
      
      currentItem = null;
      
     
              
        //$( `${currentItem}` ).text( txt );
        //$( `${currentItem}` ).show();
 },
//---------------------------------------------------------



/**********************************************************
 * .JS-CB-TEXT-DELETE  ::(CLICK)::
 *********************************************************/
 'click .js-cb-text-delete'( e, t ) {
    e.preventDefault();
 
    //IE txt-0
    let cur = $( '#cb-current' ).val()
      , ct = Session.get('contentTracker')
      , page_no = t.page.get();
		
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');

    if ( Number(ct.page_no[page_no].texts) > 0 ) ct.page_no[page_no].texts--;
    Session.set('contentTracker', ct);
    
    $('#cb-text-toolbar').hide()

    P.update( { _id: Session.get('my_id') },
              { $pull: { objects:{ id: cur} } }); 
    
    console.log( P.find({}).fetch() );
    if (
        ct.page_no[page_no].titles == 0 &&
        ct.page_no[page_no].texts  == 0 &&
        ct.page_no[page_no].images == 0 &&
        ct.page_no[page_no].pdfs   == 0 &&
        ct.page_no[page_no].videos == 0 &&
        ct.page_no[page_no].ppts   == 0 &&
        ct.page_no[page_no].scorms == 0
        )
    {
      t.page.set( t.page.get() - 1 );
    }
    //editor1.destroy();
		editor1 = null;
//---------------------------------------------------------
},


  /********************************************************
   * .JS-TITLE-DELETE-BUTTON
   *******************************************************/
  'click .js-title-delete-button'( e, t ) {
    e.preventDefault();
    
    let cur = $( '#cb-current' ).val()
      , ct  = Session.get('contentTracker')
      , page_no = t.page.get();
    
    P.update( { _id: Session.get('my_id') },
          { $pull: { objects:{ id:{$eq: cur} } }});
          
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');
    
    if ( Number(ct.page_no[page_no].titles) > 0 ) ct.page_no[page_no].titles--;
    Session.set('contentTracker', ct);
    if (
        ct.page_no[page_no].titles == 0 &&
        ct.page_no[page_no].texts  == 0 &&
        ct.page_no[page_no].images == 0 &&
        ct.page_no[page_no].pdfs   == 0 &&
        ct.page_no[page_no].videos == 0 &&
        ct.page_no[page_no].ppts   == 0 &&
        ct.page_no[page_no].scorms == 0
        )
    {
      t.page.set( t.page.get() - 1 );
      t.total.set( t.total.get() - 1 );
    }
    $( '#cb-title-toolbar' ).hide(); 
//----------------------------------------------------------
  },
  
  
  /********************************************************
   * .JS-MEDIA-DELETE-BUTTON
   *******************************************************/
  'click .js-media-delete-button'( e, t ) {
    e.preventDefault();  
    
    let cur = $( '#cb-current' ).val()
      , ct  = Session.get('contentTracker')
      , page_no = t.page.get();
    
    P.update( { _id: Session.get('my_id') },
              { $pull: { objects:{ id:{$eq: cur} } }});
    
    if ( Number(ct.page_no[page_no].images) > 0 ) ct.page_no[page_no].images--;
    Session.set('contentTracker', ct)
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');        
    
    $( '#cb-media-toolbar' ).hide();
    
    if (
        ct.page_no[page_no].titles == 0 &&
        ct.page_no[page_no].texts  == 0 &&
        ct.page_no[page_no].images == 0 &&
        ct.page_no[page_no].pdfs   == 0 &&
        ct.page_no[page_no].videos == 0 &&
        ct.page_no[page_no].ppts   == 0 &&
        ct.page_no[page_no].scorms == 0
        )
    {
      t.page.set( t.page.get() - 1 );
    }
    
  },
  
  
/**********************************************************
 * .JS-MEDIA-OPACITY  ::(INPUT)::
 *********************************************************/
  'input .js-media-opacity'( e, t ) {
    e.preventDefault();
    
    let cur = $( '#cb-current' ).val()
      , id  = $( `#${cur}` ).data('pid')
      , opm = $(e.currentTarget).val()
      , pg  = $( `#${cur}` ).data('page');
    
    $( `#${cur}` ).css( 'opacity', opm );
    
    $( '#opm' ).val( op );
    //P.update( { _id: id, "objects.page_no":pg }, 
    //          {$set:{"objects.$.opacity": op }});
//---------------------------------------------------------
  },
  
  
 
 /**********************************************************
 * .JS-TITLE-EDIT-BUTTON
 *********************************************************/
 'click .js-title-edit-button'( e, t ) {
    e.preventDefault();
      
    //GET THE CURRENTLY SELECTED ELEMENT
    currentItem = $( '#cb-current' ).val();
    
    //PULL OUT IT'S ACTUAL TEXT
    text = $( `#${currentItem}` ).text();
      
    //HIDE THE CURRENT ELEMENT
    $( `#${currentItem}` ).hide();
    
    //let pos = $( `${currentItem}` ).position();
    
    //CREATE A NEW ELEMENT, ATTACH IT TO THE CANVAS, INJECT IT WITH THE TEXT
    $( '#fb-template' ).append( `<textarea  id="toolb-added-title" 
                                            rows="3" 
                                            style="font-size:18px;
                                            font-weight:bold;z-index:2;
                                            border-radius:5px;
                                            background-color:white;
                                            cursor:move;
                                            border:1px dashed !important;">
                                            ${text}
                                  </textarea>` 
                              ).css({ 'color': 'grey', 
                                      'position': `element(${currentItem})`, 
                                      'right': 0, 'bottom': 0 
                                    });
    
    //$( '#toolb-added-title' )
    $( '#toolb-added-title' ).effect( "highlight", {}, 2000 ).focus();
    
    $( '#toolb-added-title' ).blur(function(){
      let txt = $( '#toolb-added-title' ).val();

      $( '#toolb-added-title' ).remove();
  
      $( `#${currentItem}` ).text( txt );
      $( `#${currentItem}` ).show();  
      
    });
//---------------------------------------------------------   
 },   

  
  
  
/**********************************************************
 * .JS-TITLE-ITALIC-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-title-italic-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val()
      , id  = $( `#${cur}` ).data('pid')
      , pg  = $( `#${cur}` ).data('page');
    
    if ( $( `#${cur}` ).css('fontStyle') != 'italic' ) {
      $( `#${cur}` ).css('fontStyle', 'italic');
      //P.update( { _id: id, "objects.page_no": pg }, 
      //          {$set:{"objects.$.fontStyle": 'italic' }});
    } else {
      $( `#${cur}` ).css('fontStyle', 'normal');
      //P.update( { _id: id, "objects.page_no": pg }, 
      //          {$set:{ "objects.$.fontStyle": 'normal' }});
    }
//---------------------------------------------------------
  }, 
  
  
 /**********************************************************
 * .JS-TITLE-BOLD-BUTTON ::(CLICK)::
 *********************************************************/
  'click .js-title-bold-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val()
      , id  = $( `${cur}` ).data('pid')
      , pg  = $( `${cur}` ).data('page');
    
    if ( $( `#${cur}` ).css('fontWeight') != 'bold' ) {
      $( `#${cur}` ).css('fontWeight', 'bold');
      //P.update( { _id: id, "objects.page_no": pg }, 
      //          {$set:{ "objects.$.fontWeidht": 'bold'}});
    } else {
      $( `#${cur}` ).css('fontWeight', 'normal' );
      //P.update( { _id: id, "objects.page_no": pg }, 
      //          {$set:{ "objects.$.fontWeight": '' }});
    }
//---------------------------------------------------------
  },
  
 
 /**********************************************************
 * .JS-TITLE-UNDERLINE-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-title-underline-button'( e, t ) {
    e.preventDefault();
    
    let cur = $( '#cb-current' ).val()
      , id  = $( `#${cur}` ).data('pid')
      , pg  = $( `#${cur}` ).data('page');

    
    if ( $( `#${cur}` ).css( 'textDecoration' ) != 'underline' ) {
      $( `#${cur}` ).css( 'textDecoration', 'underline' );
      //P.update( { _id: id, "objects.page_no": pg }, 
      //          {$set:{ "objects.$.textDecoration": 'underline' }});
    } else {
      $( `#${cur}` ).css('textDecoration', '');
      //P.update( { _id: id, "objects.page_no": pg }, 
      //          {$set:{ "objects.$.textDecoration": ''}});
    }
//---------------------------------------------------------
  },
  
 
 /**********************************************************
 * .JS-TITLE-FONT-SIZE  ::(INPUT)::
 *********************************************************/
  'input .js-title-font-size'( e, t ) {
    e.preventDefault();
    
    let cur = $( '#cb-current' ).val()
      , id  = $( `#${cur}` ).data('pid')
      , fsz = $(e.currentTarget).val()
      , pg  = $( `#${cur}` ).data('page');

    $( `#${cur}` ).css( 'font-size',`${fsz}px` );
    
    $( '#fnt' ).val( fsz );
    //P.update( { _id: id, "objects.page_no": pg }, 
    //          {$set:{"objects.$.fontSize": fsz }});
    //console.log( P.find({ _id: id }).fetch() );
//---------------------------------------------------------
  },
  
  
  
/**********************************************************
 * .JS-TITLE-OPACITY  ::(INPUT)::
 *********************************************************/
  'input .js-title-opacity'( e, t ) {
    e.preventDefault();
    
    let cur = $( '#cb-current' ).val()
      , id  = $( `#${cur}` ).data('pid')
      , top = $(e.currentTarget).val()
      , pg  = $( `#${cur}` ).data('page');
    
    $( `#${cur}` ).css( 'opacity', top );
    
    $( '#opm' ).val( top );
    //P.update( { _id: id, "objects.page_no":pg }, 
    //          {$set:{"objects.$.opacity": op }});
//---------------------------------------------------------
  }, 
  
  
  /********************************************************
   * .JS-VIDEO-DELETE-BUTTON
   *******************************************************/
  'click .js-video-delete-button'( e, t ){
    e.preventDefault();
    
    let cur = $( '#cb-current' ).val()
      , ct = Session.get('contentTracker')
      , page_no = t.page.get();
    
 console.log( cur );   
 
    if ( cur.slice(0,3) == 'pdf' ) {
      if ( Number(ct.pdfs) > 0 ) ct.pdfs--;
      P.update( { _id: Session.get('my_id') },
                { $unset:{ objects:1 } });
      $(`#${cur}`).remove();
    } else if ( cur.slice(0,3) == 'vid' ) {
      if ( Number(ct.videos) > 0 ) ct.videos--;
      P.update( { _id: Session.get('my_id') },
                { $pull: { objects:{ id:{$eq: cur } } }
              });
              
      $('#fb-template').css( 'border', '' ); 
    }
console.log( P.find({}).fetch() );
    $( '#fb-template iframe' ).remove();
    $( '#cb-current' ).val('');
    if ( Number( ct.page_no[page_no].videos) > 0 ) ct.page_no[page_no].videos--;
    Session.set('contentTracker', ct);
    $( '#cb-video-toolbar' ).hide();    
//---------------------------------------------------------  
  },
  
  
  
  /********************************************************
   * .JS-BACK-TO-HOME  ::(CLICK)::
   *******************************************************/
  'click #course-builder-page-back'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
      
    t.$( '#cb-leave-confirm' ).modal('show');
    return;
//-------------------------------------------------------------------
  },



  /********************************************************
   * CB-LEAVE-NO  ::(CLICK)::
   ********************************************************/
  'click #cb-leave-no'( e, t ) {
    e.preventDefault();
    
    t.$( '#cb-leave-confirm' ).modal('hide');
  },
  
  
  
  /********************************************************
   * CB-LEAVE-YES  ::(CLICK)::    [LEAVE COURSE BUILDER]
   *******************************************************/
  'click #cb-leave-yes'( e, t ) {
    e.preventDefault();
    
    let ct;
    
      // CLEAR THE CONTENT TRACKER
    if ( ! _.isUndefined( Session.get('contentTracker') ) ) {
        let ct = Session.get('contentTracker');
        ct.titles = 0;
        ct.texts  = 0;
        ct.images = 0;
        ct.videos = 0;
        ct.pdfs   = 0;
        ct.ppts   = 0;
        ct.scorms = 0;
        ct.tests  = 0;
        Session.set('contentTracker', ct);
      }  
      // ADVANCE PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
      counter     = 1;
    
      Session.set( 'tbo',     null );
      Session.set( 'Scratch', null );
      Session.set( 'cinfo',   null );
      Session.set( 'my_id',   null );
      Session.set( 'test_id', null );
      
    t.$( '#cb-leave-confirm' ).modal('hide');
    
    //NECESSARY DELAY OR DIALOG CAUSES DISPLAY ISSUES ON DESTINATION
    Meteor.setTimeout(function(){
      try {
        if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
          FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
        } else if ( Meteor.user().roles && Meteor.user().roles.admin ) {
          FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
        }
      } catch(e) {
        console.log(e);
        console.log( 'cb lineno: 570' );
      }
    }, 500);
//---------------------------------------------------------  
  },



/********************************************************
 * CB-PREV  ::(CLICK)::    [PREVIOUS BUTTON CLICK]
 *******************************************************/
  'click #cb-prev-btn'( e, t ) {
    e.preventDefault(); 
  
    if ( t.page.get() <= 1 ) {
      return;
    } else {
    
      //DECREMENT PAGE NUMBER
      t.page.set(   t.page.get()  - 1 );
      
      $('#p').attr('data-p', t.page.get() - 1 );
      
    //}
    let rtn_arr
      , pp 
      , page_no = t.page.get()
      , my_id   = Session.get('my_id')
      , o       = [];

    try {
      pp = P.find({ _id: my_id }).fetch();

      if ( pp[0].objects.length != undefined ) {
        for( let i = 0, ilen = pp[0].objects.length; i < ilen; i++ ) {
          if ( pp[0].objects[i].page_no == page_no ){
            if ( pp[0].objects[i].type == 'test' ) {
              //DISPLAY TEST
              $( '#fb-template' ).hide();
console.log('prev test');              
              $( '#fb-template' ).empty();
              
              $( '#test_v' ).show(); 
            } else {
                $( '#test_v' ).hide(); 
                
                //CLEAR THE CANVAS
                $('#fb-template').empty();
                $( '#fb-template' ).show();
            }
          o.push( pp[0].objects[i] );
          }
        }
      } else {
          o.push(pp[0].objects );
      }
      rtn_arr = handlePrevious( o );   

      let funcs = rtn_arr[1];

      //ATTACH ELEMENTS RETURNED FROM CLASS TO DOM
      $('#fb-template').append( rtn_arr[0] ); 
      
      //ACTIVATE POSITIONING JQUERY FUNCTIONS RETURNED FROM CLASS
      for ( let i = 0, ilen = funcs.length; i < ilen; i++ ) {
        eval( funcs[i] );
      } 

      /***********************************************************
       * ATTACH MOUSE EVENTS TO NEWLY PLACED TITLE & TEXT ELEMENTS
       **********************************************************/
      for( let i = 0, ilen = pp[0].objects.length; i < ilen; i++ ) {
  //TITLES
        if (  pp[0].objects[i].type == 'title' ) {
  
          for ( let j = 0, jlen = o.length; j < jlen; j++ ) {
    
            eval(
                  $( `#${o[j].id}` ).on( "mouseup", function(){
                    e.preventDefault();
  
                    //SHOW RELATED EDITING TOOLBAR
                    $( '.js-title-edit-button'  ).show();
                    $( '#cb-title-toolbar' ).show();
                    
                    // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR 
                    //R/O HIDDEN FIELD
                    t.$( '#cb-current' ).val( `${o[j].id}` );
            
                  })          
              );
            }//for
        } else
  //TEXT
            if ( pp[0].objects[i].type == 'text' ) {
             for ( let j = 0, jlen = o.length; j < jlen; j++ ) {
      
                eval(
                      $( `#${o[j].id}` ).on( "mouseup", function(){
                        e.preventDefault();
      
                        //SHOW RELATED EDITING TOOLBAR
                        $('#cb-text-toolbar').show();
                        
                        // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR 
                        //R/O HIDDEN FIELD
                        t.$( '#cb-current' ).val( `${o[j].id}` );
                
                      })          
                  );
                }//for           
        } else 
  //IMAGES
            if ( pp[0].objects[i].type == 'image' ) {
        
              if ( o.length === undefined ) console.log('it sure is, nick');
  
               for ( let j = 0, jlen = o.length; j < jlen; j++ ) {
                  if ( o[j].dwidth == null ) {
                    P.update( { _id: my_id },
                              { $pull: { objects:{ dwidth:{ $eq: null} } }});
                    continue;
                  }
                  eval(
                        $( `#${o[j].id}` ).on( "mouseup", function(){
                          e.preventDefault();
        
                          //SHOW RELATED EDITING TOOLBAR
                          $( '#cb-media-toolbar' ).show();
                          
                          // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR 
                          //R/O HIDDEN FIELD
                          t.$( '#cb-current' ).val( `${o[j].id}` );
                  
                        })          
                    );
                  //console.log( o.id );
                }//for 
        }//else if
      }//outer for
    } catch(ReferenceError) {
      console.log( 'no record line:650' );
      return;
    }
  }
//---------------------------------------------------------  
  },
  
  
  
/********************************************************
 * CB-NEXT  ::(CLICK)::    [NEXT BUTTON CLICK]
 *******************************************************/
  'click #cb-next-btn'( e, t ) {
    e.preventDefault();
      
    //SHOW RELATED EDITING TOOLBAR
    $( '#cb-text-toolbar'  ).hide();
    $( '#cb-media-toolbar' ).hide();
    $( '#cb-title-toolbar' ).hide();
    $( '#cb-video-toolbar' ).hide();
    let plen;
    
console.log('in next');
  let ct      = Session.get('contentTracker')
    , total   = t.total.get()
    , page_no = t.page.get();

  try{
    let pp = P.find({ _id: Session.get('my_id') }).fetch();

    if ( pp[0].objects && pp[0].objects.length == undefined ) {
      if ( pp[0].objects.page_no == t.page.get() ) {
        plen = 1
      }
    } else {
      for( let i = 0, ilen = pp[0].objects.length; i < ilen; i++ ) {
        if (  pp[0].objects[i].page_no == t.page.get() ){
          plen = 1;
        } else {
          plen = 0;
        }
      }
    }
  } catch(e) {
   // console.log( e );
  }
  
    
//---------------------------------------------------------------
//SAVE TEST (IT'S OUTSIDE MAIN FLOW SO NEEDS TO BE CHECKED FIRST)
//---------------------------------------------------------------
    if ( Session.get( 'test_id' ) ) {
console.log('in next test');
  let tb  = Session.get('tbo')
    , p    
    , ct  = Session.get('contentTracker');
    
    if ( tb && tb.page ) {
      p = Number(tb.page) //the page the test is on 
    }
      P.update( { _id: Session.get('my_id') },
                { $push:
                    {
                      objects:
                        {
                          page_no:    p,
                          id:         `t-${master_num++}`, 
                          type:       "test", 
                          t_id:       Session.get('test_id')
                        }
                    }
                });
      
      Session.set( 'test_id', null );
      
      //ADVANCE TO NEXT PAGE
console.log( t.page.get() );
      t.page.set(   p  + 1 );
console.log( t.page.get() );      
      t.total.set(  p  + 1 );
console.log( t.total.get() );
      counter   = p + 1;
      
//SET UP CONTENT TRACKER FOR NEW PAGE     
if ( ! ct.page_no[counter] ) {
      ct.page_no[counter] = {};
      ct.page_no[counter].titles = 0;
      ct.page_no[counter].texts  = 0;
      ct.page_no[counter].images = 0;
      ct.page_no[counter].videos = 0;
      ct.page_no[counter].pdfs   = 0;
      ct.page_no[counter].ppts   = 0;
      ct.page_no[counter].scorms = 0;
      ct.page_no[counter].tests  = 0;
}
      Session.set('contentTracker', ct);
      
      //SQUIRREL AWAY CURRENT PAGE NUMBER
      $('#p').attr('data-p', counter );
      
      Bert.alert( 
                  'Test successfully added.', 
                  'success', 
                  'growl-top-right' 
                );
                
      $('#fb-template').empty();
      return;
    }
//-----------------------------------------------/TESTS----------  


/* -----------------------------------------------------------
 * SAVE / UPDATE: TITLES, TEXT, IMAGES, PDF, VIDEO. TEST VIEW
/* -------------------------------------------------------- */ 
console.log('next save t, t, i, p, v')
      if ( 
        (ct.page_no[page_no] && ct.page_no[page_no].titles) > 0 ||
        (ct.page_no[page_no] && ct.page_no[page_no].texts)  > 0 ||
        (ct.page_no[page_no] && ct.page_no[page_no].images) > 0 ||
        (ct.page_no[page_no] && ct.page_no[page_no].pdfs)   > 0 ||
        (ct.page_no[page_no] && ct.page_no[page_no].ppts)   > 0 ||
        (ct.page_no[page_no] && ct.page_no[page_no].videos) > 0 ||
        (ct.page_no[page_no] && ct.page_no[page_no].scorms) > 0 ||
        (ct.page_no[page_no] && ct.page_no[page_no].tests)  > 0 ||
        plen > 0
       ) 
    {

      Bert.alert( 'Adding...', 'success', 'growl-top-right' );
  
          let rtn_arr
          , pp
          , pos
          , str
          , page_no = t.page.get()
          , my_id   = Session.get('my_id')
          , o       = [];
        
        pp = P.find({ _id: my_id }).fetch();

        //ARE THERE RECORDS FOR THIS PAGE?
        for( let i = 0, ilen= pp[0].objects.length; i < ilen; i++ ) {
          if ( pp[0].objects[i].page_no == page_no ){
            o.push( pp[0].objects[i] );
          }
        }

        for ( let j = 0, jlen = o.length; j < jlen; j++ ) {

          if ( o[j].type == 'title' ) {

            P.update( { _id: my_id },{ $pull: { objects:{ id:{$eq: o[j].id} } }});
console.log('next titles');
            P.update( { _id: my_id },
                      { $push:
                        { objects:
                          {
                    page_no:          page_no,
                    type:             'title',
                    id:               o[j].id,
                    text:             $( `#${o[j].id}` ).text(),
                    offset:           $( `#${o[j].id}` ).offset(),
                    zIndex:           $( `#${o[j].id}` ).css('z-index'),
                    fontSize:         $( `#${o[j].id}` ).css('font-size'),
                    border:           $( `#${o[j].id}` ).css('border'),
                    fontWeight:       $( `#${o[j].id}` ).css('font-weight'),
                    fontStyle:        $( `#${o[j].id}` ).css('font-style'),
                    textDecoration:   $( `#${o[j].id}` ).css('text-decoration'),
                    opacity:          $( `#${o[j].id}` ).css('opacity')
                          }    
                        }
                      });

          } else
            if ( o[j].type == 'text' ) {
              P.update( { _id: my_id },{$pull: { objects:{ id:{$eq: o[j].id} } }});
console.log( 'next text' );
            P.update( { _id: my_id },
                      { $push:
                        { objects:
                          {
                    page_no:          page_no,
                    type:             'text',
                    id:               o[j].id,
                    text:             $( `#${o[j].id}` ).html().trim(),
                    offset:           $( `#${o[j].id}` ).offset(),
                    zIndex:           $( `#${o[j].id}` ).css('z-index'),
                    fontSize:         $( `#${o[j].id}` ).css('font-size'),
                    border:           $( `#${o[j].id}` ).css('border'),
                    fontWeight:       $( `#${o[j].id}` ).css('font-weight'),
                    fontStyle:        $( `#${o[j].id}` ).css('font-style'),
                    textDecoration:   $( `#${o[j].id}` ).css('text-decoration'),
                    opacity:          $( `#${o[j].id}` ).css('opacity')
                          }    
                        }
                      });              
            } else
              if ( o[j].type == 'image' ) {
console.log('next image');
//console.log( o[j] );
                P.update( { _id: my_id },{ $pull: { objects:{ id:{$eq: o[j].id} } }});
                P.update({ _id: my_id },
                         { $push:
                            { objects:
                              {
                        page_no:    page_no,
                        type:       'image',
                        id:         `${o[j].id}`,
                        iid:        `${o[j].iid}`,
                        img_lnk:    `${o[j].img_lnk}`,
                        offset:     $( `#${o[j].id}` ).offset(),
                        iwidth:     $( `#${o[j].iid}` ).width(),
                        iheight:    $( `#${o[j].iid}` ).height(),
                        opacity:    $( `#${o[j].id}` ).css('opacity'),
                        dwidth:     $( `#${o[j].id}` ).width(),
                        dheight:    $( `#${o[j].id}` ).height(),
                        src:        `${o[j].src}`                  
                              }
                            }
                         });                
            } else 
              if ( o[j].type == 'video' ) {
 console.log('next video');
                P.update( { _id: my_id },{ $pull: { objects:{ id:{$eq: o[j].id} } }});
                P.update( { _id: my_id },
                          { $push: 
                            { objects:
                              {
                                page_no:  page_no,
                                type:     'video',
                                url:      o[j].url
                              }
                            }
                          });
            } else
              if ( o[j].type == 'pdf' ) {
console.log('next pdf');
                P.update( { _id: my_id },{ $pull: { objects:{ id:{$eq: o[j].id} } }});
                P.update( { _id: my_id },
                          { $push: 
                            { objects: 
                              {
                                page_no:  page_no,
                                type:     'pdf',
                                url:      o[j].url,
                                s3:       o[j].s3,
                                pdf_lnk:  o[j].pdf_lnk
                              }
                            }
                          });
            }// else if
        }//for
      
      $( '.js-edit-button'  ).hide();
      $( '#cb-toolbar-title' ).hide();
      $( '#cb-toolbar-media').hide();
      $( '#cb-toolbar-video' ).hide();
      
      //CONDITIONALLY ADVANCE TOTAL  
      if ( plen >= 1 && t.page.get() >= t.total.get() ) {
        t.total.set( t.total.get() + 1 );
      }
        //ADVANCE TO NEXT PAGE
        t.page.set(   page_no  + 1 );
      
        
      counter = t.page.get();
      $('#p').attr('data-p', counter );
      
if ( ! ct.page_no[counter] ) {
      ct.page_no[counter] = {};
      ct.page_no[counter].titles = 0;
      ct.page_no[counter].texts  = 0;
      ct.page_no[counter].images = 0;
      ct.page_no[counter].videos = 0;
      ct.page_no[counter].pdfs   = 0;
      ct.page_no[counter].ppts   = 0;
      ct.page_no[counter].scorms = 0;
      ct.page_no[counter].tests  = 0;
}
      Session.set('contentTracker', ct);

      // CLEAR THE DIV
      $( '#fb-template' ).empty();
      $( '#fb-template' ).css('border','');
      
      //pp = P.find({ _id: my_id }).fetch();
      //console.log( pp[0].objects );
      //return;
    //}

//----------------SHOW CURRENT CONTENT IF THERE IS ANY------------------------

  (function(){
      
      let rtn_arr
        , pp 
        , page_no = t.page.get()
        , my_id   = Session.get('my_id')
        , o       = [];
      
      try {
        pp = P.find({ _id: my_id }).fetch();
  
        if ( pp[0].objects.length != undefined ) {
          for( let i = 0, ilen = pp[0].objects.length; i < ilen; i++ ) {
            if ( pp[0].objects[i].page_no == page_no ){
              if ( pp[0].objects[i].type == 'test' ) {
console.log('next test');                
                $( '#fb-template' ).hide();
                $( '#fb-template' ).empty();
                
                $( '#test_v' ).show(); 
                
              } else {
                $( '#test_v' ).hide(); 
                
                //CLEAR THE CANVAS
                $('#fb-template').empty();
                $( '#fb-template' ).show();
            }
              o.push( pp[0].objects[i] );
            }
          }
        } else {
            o.push(pp[0].objects );
        }
        
        //
        
        rtn_arr = handlePrevious( o );   
  
        let funcs = rtn_arr[1];
  
        //ATTACH ELEMENTS RETURNED FROM CLASS TO DOM
        $('#fb-template').append( rtn_arr[0] ); 
        
        //ACTIVATE POSITIONING JQUERY FUNCTIONS RETURNED FROM CLASS
        for ( let i = 0, ilen = funcs.length; i < ilen; i++ ) {
          eval( funcs[i] );
        } 
  
        /***********************************************************
         * ATTACH MOUSE EVENTS TO NEWLY PLACED TITLE & TEXT ELEMENTS
         **********************************************************/
        for( let i = 0, ilen = pp[0].objects.length; i < ilen; i++ ) {
    //TITLES
          if (  pp[0].objects[i].type == 'title' ) {
    
            for ( let j = 0, jlen = o.length; j < jlen; j++ ) {
      
              eval(
                    $( `#${o[j].id}` ).on( "mouseup", function(){
                      e.preventDefault();
    
                      //SHOW RELATED EDITING TOOLBAR
                      $( '.js-title-edit-button'  ).show();
                      $( '#cb-title-toolbar' ).show();
                      
                      // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR 
                      //R/O HIDDEN FIELD
                      t.$( '#cb-current' ).val( `${o[j].id}` );
              
                    })          
                );
              }//for
          } else
    //TEXT
              if ( pp[0].objects[i].type == 'text' ) {
               for ( let j = 0, jlen = o.length; j < jlen; j++ ) {
        
                  eval(
                        $( `#${o[j].id}` ).on( "mouseup", function(){
                          e.preventDefault();
        
                          //SHOW RELATED EDITING TOOLBAR
                          $('#cb-text-toolbar').show();
                          
                          // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR 
                          //R/O HIDDEN FIELD
                          t.$( '#cb-current' ).val( `${o[j].id}` );
                  
                        })          
                    );
                  }//for           
          } else 
    //IMAGES
              if ( pp[0].objects[i].type == 'image' ) {
          
                if ( o.length === undefined ) console.log('it sure is, nick');
    
                 for ( let j = 0, jlen = o.length; j < jlen; j++ ) {
                    if ( o[j].dwidth == null ) {
                      P.update( { _id: my_id },
                                { $pull: { objects:{ dwidth:{ $eq: null} } }});
                      continue;
                    }
                    eval(
                          $( `#${o[j].id}` ).on( "mouseup", function(){
                            e.preventDefault();
          
                            //SHOW RELATED EDITING TOOLBAR
                            $( '#cb-media-toolbar' ).show();
                            
                            // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR 
                            //R/O HIDDEN FIELD
                            t.$( '#cb-current' ).val( `${o[j].id}` );
                    
                          })          
                      );
                    //console.log( o.id );
                  }//for 
          }//else if
        }//outer for
      } catch(ReferenceError) {
        console.log( 'no record line:650' );
      }
  })();
} else {
conaole.log('IN ELSE');
  let p = t.page.get() + 1;
  
  if (  
        (ct.page_no[p] && ct.page_no[p].titles) == 0 &&
        (ct.page_no[p] && ct.page_no[p].texts)  == 0 &&
        (ct.page_no[p] && ct.page_no[p].images) == 0 &&
        (ct.page_no[p] && ct.page_no[p].pdfs)   == 0 &&
        (ct.page_no[p] && ct.page_no[p].ppts)   == 0 &&
        (ct.page_no[p] && ct.page_no[p].videos) == 0 &&
        (ct.page_no[p] && ct.page_no[p].scorms) == 0 
      )
  {
  t.page.set( t.page.get() + 1 );
  t.total.set( t.total.get() + 1 );
  counter = t.page.get();    
  $('#fb-template').empty();
  return;
  }
  

  console.log('shouldn\'t get here');
if ( ! ct.page_no[counter] ) {
      ct.page_no[counter] = {};
      ct.page_no[counter].titles = 0;
      ct.page_no[counter].texts  = 0;
      ct.page_no[counter].images = 0;
      ct.page_no[counter].videos = 0;
      ct.page_no[counter].pdfs   = 0;
      ct.page_no[counter].ppts   = 0;
      ct.page_no[counter].scorms = 0;
      ct.page_no[counter].tests  = 0;
}
      Session.set('contentTracker', ct);
  //t.page.set( t.total.get() );
  $('#p').attr('data-p', t.page.get() );
}

//------------------------------------------/SAVE TITLES, TEXTS, IMAGES-------

  
  return;
//----------------------------------/NEXT-----------------
  },



/********************************************************
 * #NEW-COURSE-SAVE  ::(CLICK)::  [INITIAL DIALOG]
 *******************************************************/
  'click #new-course-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();


    //////////////////////////////////////////////////////////
    // HANDLE/HARDER ERROR CHECKING, NO ALLOW EMPTY FIELDS  //
    //////////////////////////////////////////////////////////

      
      let ct = {};
      ct.page_no = [];
      ct.page_no[1] = {};
      ct.page_no[1].titles  = 0;
      ct.page_no[1].texts   = 0;
      ct.page_no[1].images  = 0;
      ct.page_no[1].pdfs    = 0;
      ct.page_no[1].videos  = 0;
      ct.page_no[1].ppts    = 0;
      ct.page_no[1].scorms  = 0;
      Session.set('contentTracker', ct);
  
      // ADVANCE PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
      counter   = t.page.get(); 
      
    let credits = t.$( '#course-builder-credits' ).val()

      , name    = t.$( '#course-builder-name'    ).val()

      , percent = t.$( '#course-builder-percent' ).val()

      , keys    = t.$( '#tags' ).val()
      , role
      , creator_id = Meteor.userId()
      , cid   = Meteor.user().profile.company_id;

      if ( percent == '' ) percent = 1001; //completion is passing
      
      if ( name == '' || credits == '' || keys == '' ) {
      
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
                    'There is already a course with that name!', 
                    'danger', 
                    'fixed-top', 
                    'fa-grown-o' 
                  );
        return;
      }
      
      if ( Meteor.user().roles.teacher )  role = 'teacher';
      if ( Meteor.user().roles.admin )    role = 'admin';
      
      if ( keys == null ) keys = [""];
      Session.set('cinfo', {
                            cname: name, 
                            credits: Number(credits),
                            passing_percent: Number(percent),
                            keywords: keys,
                            icon: "/img/icon-4.png",
                            company_id: cid,
                            creator_type: role,
                            creator_id: creator_id
      });
      
      let my_id = P.insert({ });
                           
      Session.set( 'my_id', my_id );
    
      t.$( '#intro-modal' ).modal( 'hide' );
//-----------------------------------------------/INITIAL DIALOG------
  },



  /********************************************************
   * #EXIT-CB  ::(CLICK)::
   *******************************************************/
  'click #exit-cb'( e, t ) {
    t.$( '#intro-modal' ).modal( 'hide' );
    
      // CLEAR THE CONTENT TRACKER
      if ( Session.get('contentTracker') != null ) {
        let ct    = Session.get('contentTracker');
        ct.titles = 0;
        ct.texts  = 0;
        ct.images = 0;
        ct.videos = 0;
        ct.pdfs   = 0;
        ct.ppts   = 0;
        ct.scorms = 0;
        ct.tests  = 0;
        Session.set('contentTracker', ct);
      }
      
      // ADVANCE PAGE COUNTS
      t.page.set(  1 );
      t.total.set( 1 );
      
      counter     = t.page.get();
      
      Session.set( 'tbo',     null );
      Session.set( 'Scratch', null );
      Session.set( 'cinfo',   null );
      Session.set( 'my_id',   null );
      Session.set( 'test_id', null );
      
    if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
    } else if ( Meteor.user().roles && Meteor.user().roles.admin ) {
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
    } 
    
  },
  
  
  
  
/********************************************************
 * #CB-SAVE  ::(CLICK)::  [SAVE COURSE]
 *******************************************************/
  'click #cb-save'( e, t ) {
    e.preventDefault();
    
    Session.set( 'Scratch', '' );
    
    let id      = Session.get('my_id')
      , pages   = P.findOne({ _id: id }).objects;

    delete pages._id; 
//    { objects: d.objects }
//DEBUG: Pages.insert({ objects: d.objects });

    //HANDLE CASE WHERE USER CLICKS SAVE WITHOUT SAVING CURRENT PAGE:
    //if ( end == null ) {    
    //Pages.insert({ page: rec, objs: d.objects });
    //}
    
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

    let uname = Students.findOne( { _id: Meteor.userId() },
                                  { fullName:1 } ).fullName
      //, uid   = Meteor.userId()
      //, apv   = ( Meteor.user().roles.teacher ) ? false : true
      , cinfo = Session.get('cinfo'); //{cname: name, credits: Number(credits),
                                      //passing_percent: Number(percent),
                                      //keywords: keys,
                                      //icon: "/img/icon-4.png" }
    Meteor.setTimeout(function(){

      Meteor.call('saveBuiltCourse',  cinfo.cname,
                                      cinfo.company_id, 
                                      cinfo.creator_type,
                                      cinfo.credits, 
                                      cinfo.keywords,
                                      cinfo.passing_percent,
                                      cinfo.icon,
                                      pages,
                                      uname,
                                      function(error, result)
      {
          if(error){
            alert('Error');
          }else{
            console.log( 'result is ' + result );
            //Session.set("data", result)
        
            Courses.insert({
              _id:              result,
              credits:          cinfo.credits,
              name:             cinfo.cname,
              passing_percent:  cinfo.passing_percent,
              company_id:       [cinfo.company_id],
              times_completed:  0,
              icon:             cinfo.icon,
              public:           false,
              creator_type:     cinfo.creator_type,
              creator_id:       cinfo.creator_id,
              created_at:       new Date(),
              approved:         true,
              type:             'course'
            });
          }
    }); 
      //-----------------------------------------------
      /*
       * IF THE COURSE CREATOR IS A TEACHER
       * ASSIGN TEACHER A FIXED 2 CREDITS
       *--------------------------------------------- */
       if ( Meteor.user().roles && Meteor.user().roles.teacher ) {

         Students.update({ _id: Meteor.userId() },
                         {
                           $inc: { current_credits: 2 }
                         });
                         
       }
      //-----------------------------------------------

      // CLEAR THE CONTENT TRACKER
      if ( Session.get('contentTracker') != null ) {
        let ct = Session.get('contentTracker');
        ct.titles = 0;
        ct.texts  = 0;
        ct.images = 0;
        ct.videos = 0;
        ct.pdfs   = 0;
        ct.ppts   = 0;
        ct.scorms = 0;
        ct.tests  = 0;
        Session.set('contentTracker', ct);
      }
      
      // SET PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
      counter     = 1;
      
    }, 300);

    P.remove({ _id: id });
    
    Session.set( 'tbo',             null );
    Session.set( 'my_id',           null );
    Session.set( 'cinfo',           null );
    Session.set( 'test_id',         null );
    Session.set( 'contentTracker',  null );
    
    Meteor.setTimeout(function(){
      Bert.alert( 
                  'Your Course was saved!', 
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

    if ( Meteor.user().roles && Meteor.user().roles.admin )
      FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
    if ( Meteor.user().roles && Meteor.user().roles.teacher )
      FlowRouter.go( 'teacher-dashboard', { _id: Meteor.userId() });
    //Template.instance().page.set( 1 );
    //Template.instance().total.set( 1 );
//---------------------------------------------/SAVE COURSE-------
  },
  
  
  
  /********************************************************
   * #CB-TEST-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-test-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set(   Template.instance().page.get()  + 1 );
    Template.instance().total.set(  Template.instance().total.get() + 1 );
    t.$( '#add-test' ).modal( 'hide' );
//-----------------------------------------------------------------------------
  },




  /********************************************************
   * #CB-SCORM-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-scorm-save'( e, t ) {
    e.preventDefault();

    //Meteor.call(  'scormStudentCourseStatus', 1, 
    //              '68ac728a3a9686020674a6e614e2d7e3', 1 );
    //Meteor.call( 'scormListAllCourses' );
    //Meteor.call(  'scormListStudentCompletedCourses', 1, 
    //              '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call( 'scormListCompanyCourses', 1 );
    //Meteor.call(  'scormListUserCourses', 1, 
    //              '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call(  'scormListStudentStartedCourses', 1, 
    //              '68ac728a3a9686020674a6e614e2d7e3' );
    //Meteor.call( 'scormCreateUser', '123', 'pass', 1 );
    
    
    /*
    let r = Meteor.call(  'scormGetCoursePlayURL', 
                          'demo_user', 
                          1, 
                          1, 
                          function (error, result) {
                                                if ( !error ) {
                                                  Session.set( "resp", result );
                                                }
                                              });
    */
    /*
    let c_id = 1;
    let r = Meteor.call( 'scormUploadCourse', c_id, ( err, res ) => {
      if ( !err ) {
        Session.set( 'resp', res );
      }  else {
        console.log( 'err = ' + err );
      }
    })
    */
    
    /*
    let patt = new RegExp( "no url" )
      , rslt = patt.test( r );
    console.log( 'pattern test = ' + rslt );
    Session.set( 'resp', rslt )
    */
      
    return;
    
    CBSCORM.cbScormSave( e, t, contentTracker );
    
    Template.instance().page.set(   Template.instance().page.get()  + 1 );
    Template.instance().total.set(  Template.instance().total.get() + 1 );
    t.$( '#add-scorm' ).modal( 'hide' );
//---------------------------------------------------------
  },


  /********************************************************
   * #COURSE-BUILDER-SCORM  ::(CHANGE)::
   *******************************************************/
  'change #course-builder-scorm'( e, t ) {
    e.preventDefault();
    
    CBSCORM.cbScormChange( e, t, Session.get('contentTracker') );
//---------------------------------------------------------
  },
  
  

  /********************************************************
   * #COURSE-BUILDER-POWERPOINT  ::(CHANGE)::
   *******************************************************/
   'change #course-builder-powerpoint'( e, t ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      
      CBPP.cbPowerPointChange( e, t, PowerPoints );
//---------------------------------------------------------
   },
   
   

  /********************************************************
   * #CB-POWERPOINT-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-powerpoint-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    CBPP.cbPowerPointSave( e, t, Session.get('contentTracker') );
    t.$( '#add-powerpoint' ).modal( 'hide' );
//---------------------------------------------------------
  },



  /********************************************************
   * #COURSE-BUILDER-PDF  ::(CHANGE)::
   *******************************************************/
  'change #course-builder-pdf'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    CBPDF.cbPDFChange( e, t, Pdfs );
//---------------------------------------------------------
  },



  /********************************************************
   * #CB-PDF-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-pdf-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    CBPDF.cbPDFSave(  e, 
                      t, 
                      t.page.get(),
                      Pdfs,
                      P,
                      master_num++
                    );
  },
//---------------------------------------------------------


  /********************************************************
   * #COURSE-BUILDER-IMAGE ::(CHANGE)::
   *******************************************************/
  'change #course-builder-image'( e, t ) {

    CBImage.cbImageChange( e, t /*, Images */ );
  },
//---------------------------------------------------------


  /********************************************************
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *******************************************************/
  'click #cb-image-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    CBImage.cbImageSave(  e, 
                          t,
                          t.page.get(), 
                          master_num++,
                          P 
                        );
  },
//---------------------------------------------------------


  /********************************************************
   * #ADDED-TITLE  ::(BLUR)::
   *******************************************************/
  'blur #added-title'( e, t ) {
    
    CBTitle.cbAddedTitleBlur( e, 
                              t, 
                              t.page.get(),
                              master_num++,
                              P
                            );
  },
//---------------------------------------------------------


  /********************************************************
   * #ADDED-TEXT  ::(BLUR)::
   *******************************************************/
/*
  'blur #added-text'( e, t ) {
    
    CBTexts.cbAddedTextBlur(  e, 
                              t, 
                              t.page.get(),
                              master_num++,
                              P
                            );
  },
*/
//---------------------------------------------------------


  /********************************************************
   * #ADDED-VIDEO  ::(CHANGE)::
   *******************************************************/
  'change #added-video'( e, t ) {

    CBVideo.addedVideoURL(  e, 
                            t, 
                            t.page.get(), 
                            P,
                            master_num
                          );
  },
//---------------------------------------------------------  
  
  
  /********************************************************
   * CB-INTRO-MODAL-CANCEL
   *******************************************************/
   'click #cb-intro-modal-cancel'( e, t ) {
      e.preventDefault();
      
      t.$( '#intro-modal' ).modal( 'hide' );
      Meteor.setTimeout(function(){
        if ( Meteor.user().roles && Meteor.user().roles.admin ) {
          FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
          return;
        } else if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
          FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
          return;
        }
      }, 500);
   },
 //---------------------------------------------------------  
   
   
  /********************************************************
   * KEEP VALUES CONSTRAINED
   *******************************************************/
  'keyup #course-builder-credits'( e, t ) {
    let v = t.$( '#course-builder-credits' ).val();
    if ( v > 120 )  t.$( '#course-builder-credits' ).val( 120 );
    if ( v < 0   )  t.$( '#course-builder-credits' ).val(  0  );
  },
//---------------------------------------------------------
  
  
  /********************************************************
   * KEEP VALUES CONSTRAINED
   *******************************************************/
  'keyup #course-builder-percent'( e, t ) {
    let v = t.$( '#course-builder-percent' ).val();
    if ( v > 100 )  t.$( '#course-builder-percent' ).val( 100 );
    if ( v < 0   )  t.$( '#course-builder-percent' ).val(  0  );
  },
 //--------------------------------------------------------- 
  
  
  /* ******************************************************
   *
   * MOUSE OVER'S AND HOVER'S FOR CB DRAG AND DROP
   *
   *******************************************************/
   
   
   /*
    * MOUSEOVER TITLE
    */
  'mouseover .cb-img-title'( e, t ) { //hover
    $( '.cb-img-title' ).prop( 'src', '/img/title-dark.png' );
  },
//---------------------------------------------------------


  /********************************************************
   * MOUSEOUT TITLE
   *******************************************************/
  'mouseout .cb-img-title'( e, t ) {
    $( '.cb-img-title' ).prop( 'src', '/img/title.png' );
  },
//---------------------------------------------------------


  /********************************************************
   * MOUSEUP TITLE
   *******************************************************/
  'mouseup .cb-img-title'( e, t ) {
    $( '.cb-img-title' ).prop( 'src', '/img/title.png' );
  },
//---------------------------------------------------------


  /********************************************************
   * MOUSEOVER TEXT
   *******************************************************/
  'mouseover .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text-dark.png' );
  },
//----------------------------------------------------------


  /********************************************************
   * MOUSEOUT TEXT
   *******************************************************/
  'mouseout .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text.png' );
  },
//-----------------------------------------------------------


  /********************************************************
   * MOUSEUP TEXT
   *******************************************************/
  'mouseup .cb-img-text'( e, t ) {
    $( '.cb-img-text' ).prop( 'src', '/img/text.png' );
  },
//---------------------------------------------------------


  /********************************************************
   * MOUSEOVER IMAGE
   *******************************************************/
  'mouseover .cb-img-image'( e, t ) {
     $( '.cb-img-image' ).prop( 'src', '/img/images-dark.png' );
   },
//------------------------------------------------------------


   /*******************************************************
    * MOUSEOUT IMAGE
    ******************************************************/
  'mouseout .cb-img-image'( e, t ) {
    $( '.cb-img-image' ).prop( 'src', '/img/images.png' );
  },
//-------------------------------------------------------------


  /********************************************************
   * MOUSEUP IMAGE
   *******************************************************/
  'mouseup .cb-img-image'( e, t ) {
    $( '.cb-img-image' ).prop( 'src', '/img/images.png' );
  },
//---------------------------------------------------------  


  /********************************************************
   * MOUSEOVER PDF
   *******************************************************/
  'mouseover .cb-img-pdf'( e, t ) {
    $( '.cb-img-pdf' ).prop( 'src', '/img/pdf-dark.png' );
  },
//-------------------------------------------------------------


  /********************************************************
   * MOUSEOUT PDF
   *******************************************************/
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


  /********************************************************
   * MOUSEOVER PPT
   *******************************************************/
  'mouseover .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt-dark.png' );
  },
//--------------------------------------------------------------


  /********************************************************
   * MOUSEOUT PPT
   *******************************************************/
  'mouseout .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt.png' );
  },
//--------------------------------------------------------------


  /********************************************************
   * MOUSEUP PPT
   *******************************************************/
  'mouseup .cb-img-ppt'( e, t ) {
    $( '.cb-img-ppt' ).prop( 'src', '/img/ppt.png' );
  },
//---------------------------------------------------------


  /********************************************************
   * MOUSEOVER SCORM
   *******************************************************/
  'mouseover .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm-dark.png' );
  },
//---------------------------------------------------------------


  /********************************************************
  * MOUSEOUT SCORM
  ********************************************************/
  'mouseout .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm.png' );
  },
//----------------------------------------------------------------


  /********************************************************
   * MOUSEUP SCORM
   *******************************************************/
  'mouseup .cb-img-scorm'( e, t ) {
    $( '.cb-img-scorm' ).prop( 'src', '/img/scorm.png' );
  },
//---------------------------------------------------------


  /********************************************************
   * MOUSEOVER TEST
   *******************************************************/
  'mouseover .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test-dark.png' );
  },
//-----------------------------------------------------------------


  /********************************************************
   * MOUSEOUT TEST
   *******************************************************/
  'mouseout .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test.png' );
  },
//-----------------------------------------------------------------


  /********************************************************
   * MOUSEUP TEST
   *******************************************************/
  'mouseup .cb-img-test'( e, t ) {
    $( '.cb-img-test' ).prop( 'src', '/img/test.png' );
  },
//---------------------------------------------------------


  /********************************************************
   * MOUSEOVER VIDEO
   *******************************************************/
  'mouseover .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos-dark.png' );
  },
//------------------------------------------------------------------


  /********************************************************
   * MOUSEOUT VIDEO
   *******************************************************/
  'mouseout .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos.png' );
  },
//------------------------------------------------------------------


  /********************************************************
   * MOUSEUP VIDEO
   *******************************************************/
  'mouseup .cb-img-video'( e, t ) {
    $( '.cb-img-video' ).prop( 'src', '/img/videos.png' );
  },
//---------------------------------------------------------
});


/**********************************************************
 * ADD TITLE
 *********************************************************/
function addTitle( x, y ) {

  let holder = $( `<input id="added-title" 
                          type="text" 
                          style="fdborder-radius:5px;z-index:2;
                                 position:absolute;width:65%;margin-left:12%;
                                 margin-right:12%" autofocus/>` 
                ).css( 'color', 'grey' );
  $( '#fb-template' ).append(holder);
  
  let pos = $('#added-title').position();
  let x1  = pos.left;
  let y1  = pos.top;

  $( '#added-title').offset({ left: x - x1, top: y - y1 });
  $(holder).effect( "highlight", {}, 2000 );
}


/**********************************************************
 * ADD TEXT
 *********************************************************/
function addText( x, y ) {
  $( '#cb-text-toolbar' ).show();
/*
  $( '#fb-template' ).append( '<textarea  id="added-text" ' +
                                          'rows="3" ' + 
                                          'style="z-index:2;border-radius:5px;'+
                                          'position:absolute;margin-left:10%;' +
                                          'margin-right:10%;' +
                                          'width:73%;" autofocus></textarea>' 
                            ).css( 'color', 'grey' );

  let pos = $('#added-text').position();
  let x1  = pos.left;
  let y1  = pos.top;
  
  $( '#added-text' ).offset({ left: x - x1, top:  y - y1 });
  $( '#added-text' ).effect( "highlight", {}, 2000 );
*/
}


/**********************************************************
 * ADD VIDEO
 *********************************************************/
function addVideo() {

  $( '#fb-template' ).append( '<input id="added-video" ' +
                                      'type="text" ' +
                                      'style="border-radius:5px;width:75%;' +
                                      'margin-left:12%;margin-right:12%;" ' +
                                      'placeholder="Add YouTube URL here" ' +
                                      'autofocus/>' 
                    ).css( 'border', '1px dashed grey' ); 
                    //.effect( "highlight", {}, 2000 );
}


/**********************************************************
 * ADD TEST FOR ITEMS ON PAGE
 *********************************************************/
function testForItemsOnPage( ct, p ) {
if (
        ct && ct.page_no[p] && ct.page_no[p].titles != 0 ||
        ct && ct.page_no[p] && ct.page_no[p].texts  != 0 ||
        ct && ct.page_no[p] && ct.page_no[p].images != 0 ||
        ct && ct.page_no[p] && ct.page_no[p].videos != 0 ||
        ct && ct.page_no[p] && ct.page_no[p].pdfs   != 0 ||
        ct && ct.page_no[p] && ct.page_no[p].ppts   != 0 ||
        ct && ct.page_no[p] && ct.page_no[p].scorms != 0 ||
        ct && ct.page_no[p] && ct.page_no[p].tests  != 0
      )
  {
    return true;
  } else {
    return false;
  }
}


/**********************************************************
 * TEST FOR VIDEO OR PDF ON PAGE
 *********************************************************/
function testForVideoOrPdfOnPage( ct, p ) {
  
  if ( (ct && ct.page_no[p] && ct.page_no[p].videos != 0) || (ct && ct.page_no[p] && ct.page_no[p].pdfs != 0) ) {
    return true;
  } else {
    return false;
  }
}   

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