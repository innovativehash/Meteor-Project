import '../../../public/bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css';

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { BuiltCourses }   from '../../../both/collections/api/built-courses.js';
import { Courses }        from '../../../both/collections/api/courses.js';
import { Students }       from '../../../both/collections/api/students.js';

import '../../templates/admin/course-builder-page.html';

/*
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.structure.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.theme.min.css';
*/


/*******************************************************************************
 * CREATED
 *******************************************************************************/
Template.courseBuilderPage.onCreated( function() {

  $( '#cover' ).show();
  
  this.page   = new ReactiveVar(1);
  this.total  = new ReactiveVar(1);


  /*
   * JQUERY-UI
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {
    $( '#fb-template' ).show();
    $( '#cb-vid-disp' ).hide();
    $( '#cb-pdf-disp' ).hide();
    $( '#img-preview' ).hide();

    $( ".draggable" ).draggable({
      start: function( event, ui ) {

      },
      //cursor: "move",
      helper: "clone",
      zIndex: 99
    });
  
    $( '#fb-template' ).droppable({
      accept: '.draggable',
      drop: function( evt, ui ) {
        //$( this )
          //.addClass( "ui-state-highlight" )
        //$(this).html( ui.draggable.data('dt'));
        //.css( 'border', '1px dashed blue' ).css( 'color', 'grey' );

        let draggedType = ui.draggable.data( 'type' );
        switch ( draggedType ) {
          case 'title':
            //$( '#add-title' ).modal( 'show' );
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
            addVideo();
            break;
          case 'pdf':
            $( '#add-pdf' ).modal( 'show' );
            break;
          case 'powerpoint':
            $( '#add-powerpoint' ).modal( 'show' );
            break;
          case 'scorm':
            $( '#add-scorm' ).modal( 'show' );
            break;
          case 'test':
            $( '#add-test' ).modal( 'show' );
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
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign Courses:: load select2.js fail' );
  });
//-------------------------------------------------------------------

}); //END ONCREATED



/*******************************************************************************
 * RENDERED
 *******************************************************************************/
Template.courseBuilderPage.onRendered( function() {
  
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', 
                                      function() {
                                        $( "#cover" ).hide();
                                        $( ".dashboard-header-area" ).fadeIn( 'slow' );
                                      }
                                    );

  $( '#intro-modal' ).modal( 'show' );

          window.addEventListener("beforeunload", function() {
            console.log("Close web socket");
            socket.close();
        });
//------------------------------------------------------------------- 
}); //END ONRENDERED





/*******************************************************************************
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


let ig  = ''
  , ext = ''
  , tbo = {}
  , tit_id    = -1
  , txt_id    = -1
  , img_id    = -1
  , vid_id    = -1
  , titles = []
  , texts  = []
  , images = []
  , videos = [];

/*******************************************************************************
 * EVENTS
 *******************************************************************************/
Template.courseBuilderPage.events({

  /*
   * FOCUS #EDITOR
   
  'focus #editor'( e, t ){  
    AceEditor.instance( "editor", null, function(e){
      e.$blockScrolling = Infinity;
    });
//-------------------------------------------------------------------
  },
*/


  /*
   * CLICK #DB-TEST-SAVE
   * id = add-test
   * add-test dialog
   */
  'click #cb-test-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$( '#add-test' ).modal( 'hide' );
//-------------------------------------------------------------------
  },



  /*
   * CLICK #CB-SCORM-SAVE
   * id = add-scorm
   * scorm dialog
   */
  'click #cb-scorm-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$( '#add-scorm' ).modal( 'hide' );
//-------------------------------------------------------------------
  },



  /*
   * CLICK #CB-POWERPOINT-SAVE
   * id = add-powerpoint
   * powerpoint dialog
   */
  'click #cb-powerpoint-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$( '#add-powerpoint' ).modal( 'hide' );
//-------------------------------------------------------------------
  },



  /*
   * CHANGE #COURSE-BUILDER-PDF
   * PDF input element 
   * type = files
   */
  'change #course-builder-pdf'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log( 'aborted' );
      return;
    }

    let fil = t.$( '#course-builder-pdf' ).get(0).files[0];
    let fr = new FileReader();

    fr.onload = function() {
      ig  = this.result;
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL( fil ); 
//-------------------------------------------------------------------
  },



  /*
   * CLICK #CB-PDF-SAVE
   * id = add-pdf
   * pdf dialog
   */
  'click #cb-pdf-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    Meteor.call( 'saveBuiltCoursePdf',
                  built_id, 
                  ig, 
                  Template.instance().page.get() );

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );

    t.$( '#fb-template' ).hide();
    /*
    let obj =
    '<object data="' + ig + '" type="application/pdf" width="10%" height="100%">' +
    '<iframe src="' + ig + '" width="100%" height="100%" style="border: none;">' +
    'This browser does not support PDFs. Please download the PDF to view it: <a href="' + ig + '">Download PDF</a>' +
    '</iframe>' + 
    '</object>';
   */ 
    t.$( '#fb-template' ).hide();

    //t.$('#cb-pdf-disp').html(obj);
    t.$( '#cb-pdf-disp' ).show();

    //492px x 285px
    t.$( '#cb-pdf-disp' ).html( '<embed src="'  + 
                                ig              + 
                                '"'             + 
                                ' width="100%" height="100%" style="margin:auto;padding:0;" />' 
                              );

    ig = null;
    
    t.$( '#add-pdf' ).modal( 'hide' );
//-------------------------------------------------------------------
  },



  /*
   * CLICK #NEW-COURSE-SAVE
   * id = intro-modal
   * opening modal dialog
   */
  'click #new-course-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let credits = t.$( '#course-builder-credits' ).val();

    let name    = t.$( '#course-builder-name'    ).val();

    let percent = t.$( '#course-builder-percent' ).val();

    let keys    = t.$( '#tags' ).val();


    tbo.name            = name;
    tbo.credits         = credits;
    tbo.passing_percent = percent;
    tbo.pages           = [];
    tbo.keywords        = keys;
    tbo.num             = 1;
    tbo.company_id      = Meteor.user().profile.company_id;
    tbo.times_completed = 0;
    tbo.icon            = "/img/icon-4.png";
    tbo.public          = false;

    //built_id = BuiltCourses.findOne({ name: name })._id;
   
    t.$( '#intro-modal' ).modal( 'hide' );
    t.$( '#course-banner' ).text( name );
//-------------------------------------------------------------------
  },


  /*
   * CLICK .JS-BACK-TO-HOME
   */
  'click .js-back-to-home'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    //t.currentScreen.set('courseBuilder');
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK #CB-SAVE
   * bottom of screen
   */
  'click #cb-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
/*
    let built_id = BuiltCourses.insert({  
                                        name: tbo.name, 
                                        credits: tbo.credits, 
                                        passing_percent: tbo.percent, 
                                        pages: tbo.pages,
                                        keywords: tbo.keywords 
                                      });

    Courses.insert({  
                    built_id: built_id, 
                    credits: tbo.credits, 
                    num: tbo.num, 
                    name: tbo.name, 
                    passing_percent: tbo.percent,
                    company_id: tbo.company_id, 
                    times_completed: tbo.times_completed, 
                    icon: tbo.icon, 
                    public: tbo.public, 
                    created_at: new Date() 
                  });
*/
console.log( texts );
console.log( titles );
console.log( images );
console.log( videos );
//-------------------------------------------------------------------
  },



  'change #course-builder-image'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let mark = ( e.currentTarget.files[0].name ).lastIndexOf('.') + 1;

    ext   = ( e.currentTarget.files[0].name ).slice( mark );
    ext   = ( ext == ( 'jpg' || 'jpeg' ) ) ? 'image/jpeg' : 'image/png';

    let fil = t.$( '#course-builder-image' ).get(0).files[0];
    let fr  = new FileReader();

    let myimage = new Image();
    fr.onload   = function() {
      ig        = this.result;

      //orig
      myimage.src = ig;
      console.log( 'img.width   = ' + myimage.width );
      console.log( 'img.height  = ' + myimage.height );
      let b                     = new Buffer( ig, 'base64' ).length
      console.log( 'img.size ' + b );
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL(fil);

    Meteor.setTimeout( function() {
      if ( ig ) {
        //t.$( '#fb-template' ).hide();
        //t.$( '#img-preview' ).attr( "src", ig );
        //t.$( '#img-preview' ).show();
        let img = $( '<img id="logo-preview" />' );
            img.attr( "src", ig ); // ig
            img.appendTo( '.image-preview' );
      } else {
          img = null;
      }
    }, 200);
//-------------------------------------------------------------------    
  },



  'click #cb-image-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $('#fb-template').show();

    images.push({ page: Template.instance().page.get(), id: ++img_id, image: ig });

    t.$('#fb-template').append(`<img id="img-preview${images[img_id].id}" src="${ig}" class="draggable ui-widget-content" style="cursor:move;">`);

    t.$('.draggable').draggable({
      zIndex: 99,
    });
    
    
    t.$( `#img-preview${images[img_id].id}` ).on('mousedown',  (e) => {
      e.preventDefault();
      //console.log( e );
      images[img_id].position = $(`#img-preview${images[img_id].id}`).position();
      console.log( $(`#img-preview${images[img_id].id}`).position() );
    });

    ig  = null;
    ext = null;
    t.$( '#add-image' ).modal( 'hide' );
    t.$( '#media-enter' ).hide();
   // t.$('#fb-template').show();
//-------------------------------------------------------------------
  },


  'blur #added-title'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
   
    //if ( $(e.currentTarget)[0].id != 'added-title') return;
    
    let tit = t.$('#added-title').val();
    titles.push( {page: Template.instance().page.get(), id: ++tit_id, text: tit} );

    t.$('#added-title').remove();

    t.$('#media-enter').css( 'border', '' ).css( 'color', 'grey' );

    t.$('#fb-template').append(`<span id="span_title${titles[tit_id].id}" style = "position:absolute;top:0px;left:5px;cursor:move;border:none !important;" class = "draggable ui-widget-content"><h2 id="tit${titles[tit_id].id}">${tit}</h2></span>`);

    t.$('.draggable').draggable({  
      //cursor: "move",
      zIndex: 99 
    });
/*
    t.$( `#tit${titles[tit_id].id}` ).on( 'mousedown',  (e) => {
      e.preventDefault();
      //console.log( e );
      //console.log( $('#sp1').position() );
    });
*/
    t.$( `#tit${titles[tit_id].id}` ).bind( 'mouseup', (e) => {
      e.preventDefault();
      //console.log( e );
      //let top = $(`#sp${text_ids}`).offset().top + window.screenY;
      //let left = $(`#sp${text_ids}`).offset().left + window.screenX;

      //console.log( e );
      //titles.position = {};
      titles[tit_id].position = $(`#span_title${titles[tit_id].id}`).position();

      console.log( $(`#span_title${titles[tit_id].id}`).position() );
    });
    t.$('#media-enter').hide();
  },

  'blur #added-text'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    //if ( $(e.currentTarget)[0].id != 'added-text') return;
   
    let txt = t.$('textarea#added-text').val().trim();

    t.$('#added-text').remove();
    texts.push( {page: Template.instance().page.get(), id:++txt_id, text: txt} );

    t.$('#media-enter').css( 'border', '' ).css( 'color', 'grey' );

    t.$('#fb-template').append(`<span id="span_text${texts[txt_id].id}" style = "position:absolute;top:318px;left:5px;border:none !important;cursor:move;" class = "draggable ui-widget-content"><p id="txt${texts[txt_id].id}">${txt}</p></span>`);
    t.$('.draggable').draggable({
        //cursor: "move",
        zIndex: 99
    });
/*   
    t.$( `#txt${texts[txt_id].id}` ).on('mousedown',  (e) => {
      e.preventDefault();
      //console.log( e );
      //console.log( $('#sp1').position() );
    });
*/
    t.$( `#txt${texts[txt_id].id}` ).bind('mouseup', (e) => {
      e.preventDefault();
      //console.log( e );
      //let top = $(`#sp${text_ids}`).offset().top + window.screenY;
      //let left = $(`#sp${text_ids}`).offset().left + window.screenX;

      //console.log( e );
      texts[txt_id].position = $(`#span_text${texts[txt_id].id}`).position(); 

      console.log( $(`#span_text${texts[txt_id].id}`).position() );
    });
    t.$('#media-enter').hide();
  },



  'change #added-video'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log('in added-video blur/change')
    if ( e.currentTarget.id == 'intro-modal') return;
////////////////////////////
//    VIDEO MUST BE ON IT'S OWN page
////////////////////////////

    let vid = t.$( '#added-video' ).val();

    t.$('#added-video').remove();

    videos.push( {page: Template.instance().page.get(), id:++vid_id, url: vid} );

    t.$('#media-enter').css( 'border', '' ).css( 'color', 'grey' );

    t.$( '#fb-template' ).html( vid );
    //t.$( '#cb-vid-disp' ).addClass('draggable ui-widget-content');
    //t.$('.draggable').draggable({
        //cursor: "move",
        //zIndex: 99
    //});

    t.$('#media-enter').hide();
    //t.$( '#cb-vid-disp' ).show();
    
   // t.$( '#fb-template' ).hide()
    //t.$('#fb-template').append(`<span id="span_vids${texts[txt_id].id}" style = "position:absolute;border:none !important;cursor:move;" class = "draggable ui-widget-content"><p id="txt${texts[txt_id].id}">${txt}</p></span>`);
   

//    BuiltCourses.update({ _id: built_id }, 
//                        { $addToSet:
//                          { pages:
//                            { 
//                              page: Template.instance().page.get(), 
//                              video: vid 
//                            }
//                          }
//                        });

    //Template.instance().page.set( Template.instance().page.get() + 1 );
    //Template.instance().total.set( Template.instance().total.get() + 1 );
//-------------------------------------------------------------------
  },

}); //END EVENTS


function addTitle() {
  $('#fb-template').show();
  let holder = $('#media-enter');
  holder.append('<input id="added-title" type="text" style="width:75%;margin-left:12%;margin-right:12%;"/>')
    .css( 'border', '1px dashed grey' ).css( 'color', 'grey' );
  $('#media-enter').show();
  $('div#media-enter').effect("highlight", {}, 2000);
}

function addText() {
  $('#fb-template').show();
  $('#media-enter').append('<textarea id="added-text" rows="3" style="width: 95%;margin: 20px;"></textarea>')
    .css( 'border', '1px dashed grey' ).css( 'color', 'grey' );
  $('#media-enter').show();
  $('div#media-enter').effect("highlight", {}, 2000);
}

function addVideo() {
  console.log('in addVideo()');
  $('#fb-template').show();
  $('#media-enter').append('<input id="added-video" type="text" style="width:75%;margin-left:12%;margin-right:12%;"/>')
    .css( 'border', '1px dashed grey' ).css( 'color', 'grey' );
  $('#media-enter').show();
  $('div#media-enter').effect("highlight", {}, 2000);
}

function addImage() {

}