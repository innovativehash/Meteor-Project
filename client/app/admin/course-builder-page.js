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

    //-------------------------
    //      DIALOG
    //-------------------------
    $( "#dialog" ).dialog({
      autoOpen: false,
      close: function( event, ui ) {
        $('#js-bold-button').removeClass('active');
        $('#js-italic-button').removeClass('active');
        $('#js-underline-button').removeClass('active');
      }
    });

    // DIALOG BOLD BUTTON
    $('#js-bold-button').on("click", function(e){
      let bold = $('#js-cb-text-dialog').val();

      if ( $(this).hasClass('active') ) {
        $(`${bold}`).css('font-weight', '');
      } else {
        $(`${bold}`).css('font-weight', 'bold');
      }
    });

    // DIALOG ITALIC BUTTON
    $('#js-italic-button').on("click", function(e){
      let italic = $('#js-cb-text-dialog').val();

      if ( $(this).hasClass('active') ) {
        $(`${italic}`).css('font-style', '');
      } else {
        $(`${italic}`).css('font-style', 'italic');
      }
    });

    // DIALOG UNDERLINE BUTTON
    $('#js-underline-button').on("click", function(e){
      let underline = $('#js-cb-text-dialog').val();

      if ( $(this).hasClass('active') ) {
        $(`${underline}`).css('text-decoration', '');
      } else {
        $(`${underline}`).css('text-decoration', 'underline');
      }
    });


    //-------------------------------
    //       DIALOG OPACITY SLIDER
    //-------------------------------
    $( "#slider-range" ).slider({

      slide: function( event, ui ) {
        let opacity = $('#js-cb-text-dialog').val();

        $("label[for='slider-range']").html( ui.value );

        $( `${opacity}`).css('opacity', ui.value/100 );
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
    //----------------------------
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



let ig      = ''
  , ext     = ''
  , tbo     = {}
  , tit_id  = -1
  , txt_id  = -1
  , img_id  = -1
  , vid_id  = -1
  , titles  = []
  , texts   = []
  , images  = []
  , videos  = [];

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
//-----------------------------------------------------------------------------
  },
*/


  /**
   *
   * .JS-BACK-TO-HOME  ::(CLICK)::
   */
  'click .page-back-home'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //t.currentScreen.set('courseBuilder');
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });

//-------------------------------------------------------------------
  },




 /**
   *
   * #NEW-COURSE-SAVE  ::(CLICK)::
   *
   * id = intro-modal
   * opening modal dialog
   */
  'click #new-course-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let credits = t.$( '#course-builder-credits' ).val()

      , name    = t.$( '#course-builder-name'    ).val()

      , percent = t.$( '#course-builder-percent' ).val()

      , keys    = t.$( '#tags' ).val();


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
//-----------------------------------------------------------------------------
  },




  /**
   *
   * #CB-SAVE  ::(CLICK)::
   *
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





  /**
   *
   * #DB-TEST-SAVE  ::(CLICK)::
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




  /**
   *
   * #CB-SCORM-SAVE  ::(CLICK)::
   *
   * id = add-scorm
   * scorm dialog
   */
  'click #cb-scorm-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$( '#add-scorm' ).modal( 'hide' );
//-----------------------------------------------------------------------------
  },



  /**
   *
   * #CB-POWERPOINT-SAVE  ::(CLICK)::
   *
   * id = add-powerpoint
   * powerpoint dialog
   */
  'click #cb-powerpoint-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$( '#add-powerpoint' ).modal( 'hide' );
//-----------------------------------------------------------------------------
  },



  /**
   *
   * #COURSE-BUILDER-PDF  ::(CHANGE)::
   *
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

    let fil   = t.$( '#course-builder-pdf' ).get(0).files[0]
      , fr    = new FileReader();

    fr.onload = function() {
      ig      = this.result;
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL( fil );
//-----------------------------------------------------------------------------
  },



  /**
   *
   * #CB-PDF-SAVE  ::(CLICK)::
   *
   * id = add-pdf
   * pdf dialog
   */
  'click #cb-pdf-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    /*
    Meteor.call( 'saveBuiltCoursePdf',
                  built_id,
                  ig,
                  Template.instance().page.get() );

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
*/
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
    t.$( '#media-enter' ).hide();
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
//-----------------------------------------------------------------------------
  },




  /**
   *
   * #COURSE-BUILDER-IMAGE ::(CHANGE)::
   *
   */
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

      //DEBUG INFO:
      console.log( 'img.width   = ' + myimage.width );
      console.log( 'img.height  = ' + myimage.height );
      let b                     = new Buffer( ig, 'base64' ).length
      console.log( 'img.size ' + b );
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL( fil );

    Meteor.setTimeout( function() {
      if ( ig ) {
        let img = $( '#preview-image' );

        img.attr( "src", ig ); // ig
        img.appendTo( '.image-preview' );
      } else {
          img = null;
      }
    }, 200);

    t.$( '#course-builder-image' ).val('');
//-----------------------------------------------------------------------------
  },



  /**
   *
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *
   */
  'click #cb-image-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //$( '#fb-template' ).show();

    images.push({ page: Template.instance().page.get(), id: ++img_id, image: ig });


    t.$( '#fb-template' ).append( `<div id="ig-${img_id}" style="display:inline-block;"><img id="img-preview-${img_id}" src="${ig}" style="cursor:move;"></div>` );

    $(`#ig-${img_id}`).draggable();
    $(`#img-preview-${img_id}`).resizable();


    t.$( `#ig-${img_id}` ).on( 'mousedown',  (e) => {
      e.preventDefault();

      images[img_id].position = $( `#ig-${img_id}` ).position();
      console.log( images[img_id].position );
    });

    if ( ! t.$( `#close-img-${img_id}` ).length ) {
        $( `#ig-${img_id}` ).append( `<button type="button"
                                              id="close-img-${img_id}"
                                              class="btn btn-danger btn-xs">
                                        <span class="glyphicon glyphicon-trash"></span>
                                      </button>` );

        //CLOSE BUTTON EVENT
        t.$( `#close-img-${img_id}` ).on( "click", (e) => {
          e.preventDefault();
          $( `#${e.currentTarget.parentNode.id}` ).remove();
        });
    }


    ig  = null;
    ext = null;
    $('#preview-image').attr( 'src', null );
    t.$( '#add-image' ).modal( 'hide' );

//-----------------------------------------------------------------------------
  },



  /**
   *
   * #ADDED-TITLE  ::(BLUR)::
   *
   */
  'blur #added-title'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( t.$( '#added-title' ).val() == undefined || t.$( '#added-title' ).val() == '' ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
      return;
    }


    let tit = t.$( '#added-title' ).val();

    if ( t.$( '#added-title' ).length ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
    }

    t.$('.draggable').draggable();



    /* DON'T FORGET, SOME OF THESE MAY BE DELETED BY USER.  REMOVE THEM FROM ARRAY AT THAT TIME */
    titles.push( {page: t.page.get(), id: ++tit_id, text: tit} );


    t.$( '#fb-template' ).append( `<div id="div_title-${tit_id}"
                                        style = "z-index:2;border-radius:5px;background-color:white;font-size:18px;position:absolute;top:200px;left:300px;cursor:move;border:none !important;">
                                    <span style="font-size:20px;"
                                           id="tit-${tit_id}">&nbsp;&nbsp;&nbsp;&nbsp;<strong>${tit}</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span><sup id="tmp-title-${tit_id}"></sup>
                                  </div>`);

      t.$( `#tmp-title-${tit_id}` ).hide();

      t.$( `#div_title-${tit_id}` ).draggable();

      t.$( `#tit-${tit_id}` ).resizable();


      //-------------------------------
      // TITLE OBJECT CLICK EVENT
      //-------------------------------
      //`#tit${titles[tit_id].id}`
    (function(tit_id){
      document.getElementById( `div_title-${tit_id}` ).onclick = (e) => {
        e.preventDefault();

        titles[tit_id].position = $( `#div_title-${tit_id}` ).position();
        console.log( titles[tit_id].position );


      //------------------------------
      // TITLE  COBJECT WIDGET BUTTONS
      //------------------------------
      if ( ! t.$( `#close-title-${tit_id}` ).length ) {
        $( `#div_title-${tit_id}` ).append( `<button type="button"
                                                     id="close-title-${tit_id}"
                                                     class="btn btn-danger btn-xs">
                                              <span class="glyphicon glyphicon-trash"></span>
                                            </button>` );

        //CLOSE BUTTON EVENT
        t.$( `#close-title-${tit_id}` ).on( "click", (e) => {
          e.preventDefault();
          $( `#${e.currentTarget.parentNode.id}` ).remove();
        });
      }
      if ( ! t.$( `#gear-title-${tit_id}` ).length ) {
          $( `#div_title-${tit_id}` ).prepend( `<button type="button"
                                                        id="gear-title-${tit_id}"
                                                        class="btn btn-danger btn-xs">
                                                  <span class="glyphicon glyphicon-cog"></span>
                                                </button>` );

          //GEAR BUTTON EVENT
        t.$( `#gear-title-${tit_id}` ).on( "click", (e) => {
          e.preventDefault();
          $('#js-cb-text-dialog').val( `#tit-${tit_id}` );
          $( '#dialog' ).dialog( "open" );
        });
      }

      // BUTTONS TIMER
      Meteor.setTimeout(function(){
        if ( t.$( `#tmp-title-${tit_id}` ).css( 'display' ) == 'inline' ) {
          t.$( `#tmp-title-${tit_id}` ).hide();
        }
        t.$( `#close-title-${tit_id}` ).off( "click" );
        t.$( `#close-title-${tit_id}` ).remove();

        t.$( `#gear-title-${tit_id}` ).off( "click" );
        t.$( `#gear-title-${tit_id}` ).remove();

      }, 2000);

      // TITLE OBJECT RESIZE EVENT
      t.$( `#tit-${tit_id}` ).on( "resize", function( event, ui ) {
        let factor = 2 +  Math.round( ui.size.height / 2 ) * 2;
        t.$( `#tmp-title-${tit_id}` ).show();
        t.$( `#tmp-title-${tit_id}` ).text( " " + factor + "px" ).css( 'background-color', 'red' ).css( 'color', 'white' ).css('border-radius', '10px');
        $( this ).css( 'font-size', factor );
      });

      };//onclick
    })(tit_id);//anon function
  //---------------------------------------------------------------------------
  },




  /**
   *
   * #ADDED-TEXT  ::(BLUR)::
   *
   */
  'blur #added-text'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //if ( $(e.currentTarget)[0].id != 'added-text') return;

     if ( t.$( '#added-text' ).val() == undefined || t.$( '#added-text' ).val() == '' ) {
      t.$( '#added-text' ).remove();
      return;
    }

    let txt = t.$( 'textarea#added-text' ).val().trim();

    t.$( '#added-text' ).remove();

    texts.push( {page: Template.instance().page.get(), id:++txt_id, text: txt} );

    t.$( '#fb-template' ).append( `<span id="span_text-${txt_id}"
                                         style = "z-index:1;border-radius:5px;background-color:white;position:absolute;top:200px;left:300px;border:none !important;cursor:move;"
                                         class = "draggable ui-widget-content">
                                     <span style="font-size:16px;"
                                                  id="txt-${txt_id}">&nbsp;&nbsp;&nbsp;&nbsp;${txt}&nbsp;&nbsp;&nbsp;&nbsp;
                                     </span>
                                     <sup id="tmp-txt-${txt_id}"></sup>
                                  </span>`);

    t.$( `#tmp-txt-${txt_id}` ).hide();

    t.$( `#span_text-${txt_id}` ).draggable();

    t.$( `#txt-${txt_id}` ).resizable();

    //--------------------------
    // TEXT OBJECT CLICK EVENT
    //--------------------------
  (function(txt_id) { // txt-${txt_id}
    document.getElementById( `span_text-${txt_id}` ).onclick =  (e) => {
      e.preventDefault();

      texts[txt_id].position = $( `#span_text-${txt_id}` ).position();
      console.log( texts[txt_id].position );

      //---------------------------
      // TEXT OBJECT WIDGET BUTTONS
      //---------------------------
      if ( ! t.$( `#close-ta-${txt_id}` ).length ) {
        $( `#span_text-${txt_id}`).append( `<button type="button"
                                                    id="close-ta-${txt_id}"
                                                    class="btn btn-danger btn-xs">
                                              <span class="glyphicon glyphicon-trash"></span>
                                            </button>` );

        //CLOSE BUTTON EVENT
        t.$( `#close-ta-${txt_id}` ).on( "click", (e) => {
          e.preventDefault();

          $( `#${e.currentTarget.parentNode.id}` ).remove();
        });
      }
      if ( ! t.$( `#gear-ta-${txt_id}` ).length ) {
        $( `#span_text-${txt_id}`).prepend( `<button type="button"
                                                     id="gear-ta-${txt_id}"
                                                     class="btn btn-primary btn-xs">
                                              <span class="glyphicon glyphicon-cog"></span>
                                            </button>` );

        //GEAR BUTTON EVENT
        t.$( `#gear-ta-${txt_id}` ).on( "click", (e) => {
          e.preventDefault();
          $('#js-cb-text-dialog').val( `#txt-${txt_id}` );
          $( '#dialog' ).dialog( "open" );
        });
      }

      //BUTTONS TIMER
      Meteor.setTimeout(function(){
        if ( t.$( `#tmp-txt-${txt_id}` ).css( 'display' ) == 'inline' ) {
          t.$( `#tmp-txt-${txt_id}` ).hide();
        }
        t.$( `#close-ta-${txt_id}` ).off( "click" );
        t.$( `#close-ta-${txt_id}` ).remove();

        t.$( `#gear-ta-${txt_id}` ).off( "click" );
        t.$( `#gear-ta-${txt_id}` ).remove();
      }, 2000);

      //TEXT OBJECT RESIZE EVENT
      t.$( `#txt-${txt_id}` ).on( "resize", function( event, ui ) {
        let factor = 2 +  Math.round( ui.size.height / 2 ) * 2;
        t.$( `#tmp-txt-${txt_id}` ).show();
        t.$( `#tmp-txt-${txt_id}` ).text( " " + factor + "px" ).css( 'background-color', 'red' ).css( 'color', 'white' ).css('border-radius', '10px');
        t.$( this ).css( 'font-size', factor );
      });

    }//onclick
  })(txt_id);//anon func
//-----------------------------------------------------------------------------
  },




  /**
   *
   * #ADDED-VIDEO  ::(CHANGE)::
   *
   */
  'change #added-video'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.id == 'intro-modal' ) return;
////////////////////////////
//    VIDEO MUST BE ON IT'S OWN page
////////////////////////////

    let vid = t.$( '#added-video' ).val();

    t.$( '#added-video' ).remove();

    videos.push( {page: Template.instance().page.get(), id: ++vid_id, url: vid} );

    t.$( '#fb-template' ).html( vid );

    if ( ! t.$( `#close-vid-${vid_id}` ).length ) {
        $( '#fb-template' ).append( `<button type="button"
                                                     id="close-vid-${vid_id}"
                                                     class="btn btn-danger btn-xs">
                                              <span class="glyphicon glyphicon-trash"></span>
                                            </button>` );

        //CLOSE BUTTON EVENT
        t.$( `#close-vid-${vid_id}` ).on( "click", (e) => {
          e.preventDefault();
          $( '#fb-template iframe' ).remove();
          $( `#close-vid-${vid_id}` ).remove();
        });
    }

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
//-----------------------------------------------------------------------------
  },

}); //END



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
