
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { BuiltCourses }   from '../../../both/collections/api/built-courses.js';
import { Courses }        from '../../../both/collections/api/courses.js';

import '../../templates/admin/course-builder-page.html';

/*
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.structure.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.theme.min.css';
*/


let course_id = '';

/*
 * CREATED
 */
Template.courseBuilderPage.onCreated( function() {

  $('#cover').show();
  
  this.page   = new ReactiveVar(1);
  this.total  = new ReactiveVar(1);


  /*
   * JQUERY-UI
   */
  $.getScript('/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {
    
    $( ".draggable" ).draggable({
      start: function( event, ui ) {
        $('#fb-template').show();
        $('#cb-vid-disp').hide();
        $('#cb-pdf-disp').hide();
        $('#img-preview').hide();
      },
      cursor: "move",
      helper: "clone",
      zIndex: 99
    });
  
    $('#fb-template').droppable({
      accept: '.draggable',
      drop: function( evt, ui ) {
        $( this )
          //.addClass( "ui-state-highlight" )
        //$(this).html( ui.draggable.data('dt'));
        .css('border', '1px dashed blue').css('color', 'blue');

        let draggedType = ui.draggable.data('type');
        switch (draggedType) {
          case 'title':
            $('#add-title').modal('show');
            break;
          case 'text':
            $('#add-text').modal('show');
            Meteor.setTimeout(function(){
              AceEditor.instance("editor",null,function(e){
                e.setValue("");
              });
            }, 300);
            break;
          case 'image':
            $('#add-image').modal('show');
            break;
          case 'video':
            $('#add-video').modal('show');
            break;
          case 'pdf':
            $('#add-pdf').modal('show');
            break;
          case 'powerpoint':
            $('#add-powerpoint').modal('show');
            break;
          case 'scorm':
            $('#add-scorm').modal('show');
            break;
          case 'test':
            $('#add-test').modal('show');
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
   */
  let ace = AceEditor.instance("editor",{
      theme:"ambiance",
      mode:"ace/mode/text",
      setHighlightActiveLine:true,
      setShowPrintMargin:false,
      scrollToRow:0
  });
});



/*
 * RENDERED
 */
Template.courseBuilderPage.onRendered( function() {
  
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
    
  });

  $('#intro-modal').modal('show');
  
});



/*
 * HELPERS
 */
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


let ig  = ''
  , ext = ''
  , credits
  , name
  , percent;

/*
 * EVENTS
 */
Template.courseBuilderPage.events({

  /*
   * FOCUS #EDITOR
   */
  'focus #editor'( e, t ){  
    AceEditor.instance("editor",null,function(e){
      e.$blockScrolling = Infinity;
    });
//-------------------------------------------------------------------
  },


  /*
   * CHANGE #COURSE-BUILDER-IMAGE
   */
  'change #course-builder-image'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let mark = (e.currentTarget.files[0].name).lastIndexOf('.') + 1;

    ext   = (e.currentTarget.files[0].name).slice( mark );
    ext   = (ext == ('jpg' || 'jpeg') ) ? 'image/jpeg' : 'image/png';

    let fil = $('#course-builder-image').get(0).files[0];
    let fr  = new FileReader();

    let myimage = new Image();
    fr.onload   = function() {
      ig        = this.result;

      //orig
      myimage.src = ig;
      console.log( 'img.width   = ' + myimage.width );
      console.log( 'img.height  = ' + myimage.height );
      let b                     = new Buffer(ig, 'base64').length
      console.log( 'img.size ' + b );
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL(fil);
    Meteor.setTimeout( function() {
      if ( ig ) {
        t.$('#fb-template').hide();
        t.$('#img-preview').attr("src",ig);
        t.$('#img-preview').show();
        let img = $('<img id="logo-preview" />');
            img.attr("src", ig ); // ig
            img.appendTo('.image-preview');
      } else {
          img = null;
      }
    }, 200);
//-------------------------------------------------------------------    
  },


  /*
   * CLICK #CB-VIDEO-SAVE
   */
  'click #cb-video-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let vid = t.$('#course-builder-video').val();
    console.log('vid is ' + vid);
    BuiltCourses.update({ _id: course_id }, {$addToSet:{pages:{ page: Template.instance().page.get(), video: vid}}});

    t.$('#fb-template').hide();
    t.$('#cb-vid-disp').html( vid );
    t.$('#cb-vid-disp').show();
    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );

    t.$('#add-video').modal('hide');
//-------------------------------------------------------------------
  },



  /*
   * CLICK #DB-TEST-SAVE
   */
  'click #db-test-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$('#add-test').modal('hide');
//-------------------------------------------------------------------
  },



  /*
   * CLICK #CB-SCORM-SAVE
   */
  'click #cb-scorm-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$('#add-scorm').modal('hide');
//-------------------------------------------------------------------
  },



  /*
   * CLICK #CB-POWERPOINT-SAVE
   */
  'click #cb-powerpoint-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$('#add-powerpoint').modal('hide');
//-------------------------------------------------------------------
  },



  /*
   * CHANGE #COURSE-BUILDER-PDF
   */
  'change #course-builder-pdf'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let fil = $('#course-builder-pdf').get(0).files[0];
    let fr = new FileReader();

    fr.onload = function() {
      ig  = this.result;
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL(fil); 
//-------------------------------------------------------------------
  },



  /*
   * CLICK #CB-PDF-SAVE
   */
  'click #cb-pdf-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    Meteor.call('saveBuiltCoursePdf', course_id, ig, Template.instance().page.get());

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );

    t.$('#fb-template').hide();
    /*
    let obj =
    '<object data="' + ig + '" type="application/pdf" width="10%" height="100%">' +
    '<iframe src="' + ig + '" width="100%" height="100%" style="border: none;">' +
    'This browser does not support PDFs. Please download the PDF to view it: <a href="' + ig + '">Download PDF</a>' +
    '</iframe>' + 
    '</object>';
   */ 
    t.$('#fb-template').hide();
    //t.$('#cb-pdf-disp').html(obj);
    t.$('#cb-pdf-disp').show();
    //492px x 285px
    t.$('#cb-pdf-disp').html('<embed src="' + ig + '"' + ' width="100%" height="100%" style="margin:auto;padding:0;" />');
    ig = null;
    
    t.$('#add-pdf').modal('hide');
//-------------------------------------------------------------------
  },



  /*
   * CLICK #CB-IMAGE-SAVE
   */
  'click #cb-image-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Meteor.call('saveBuiltCourseImage', course_id, ig, Template.instance().page.get());

    //t.$('#fb-template').html('<div><img src="' + ig + '"' + '></div>');

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );

    ig  = null;
    ext = null;
    t.$('#add-image').modal('hide');
//-------------------------------------------------------------------
  },


  /*
   * CLICK #CB-TEXT-SAVE
   */
  'click #cb-text-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let editorText;
    AceEditor.instance("editor",null,function(e){
      editorText = e.getValue();
    });
    
    BuiltCourses.update({ _id: course_id }, {$addToSet:{pages:{ page: Template.instance().page.get(), text: editorText }}});

    t.$('#fb-template').html('<div><strong><p style="text-align:center;">' + editorText + '</p></strong></div>');
    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$('#add-text').modal('hide');
//-------------------------------------------------------------------
  },


  /*
   * CLICK #CB-TITLE-SAVE
   */
  'click #cb-title-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let ttl = t.$('#course-builder-title').val();

    BuiltCourses.update({ _id: course_id }, {$addToSet: {pages:{ page: Template.instance().page.get(), title: ttl }}});

    t.$('#fb-template').html('<div><strong><h3 style="text-align:center;">' + ttl + '</h3></strong></div>');
    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
    t.$('#add-title').modal('hide');
//-------------------------------------------------------------------
  },

  
  /*
   * CLICK #NEW-COURSE-SAVE
   */
  'click #new-course-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let credits = t.$('#course-builder-credits').val();
    let name    = t.$('#course-builder-name').val();
    let percent = t.$('#course-builder-percent').val();

    BuiltCourses.insert({ name: name, credits: credits, passing_percent: percent, pages: [] });
    

    Meteor.setTimeout(function() {
      course_id = BuiltCourses.findOne({ name: name })._id;
    }, 300);

    Courses.insert({  course_id: course_id, 
                      credits: credits, 
                      num: 1, 
                      name: name, 
                      passing_percent: percent,
                      company_id: Meteor.user().profile.company_id,
                      times_completed: 0,
                      icon: "/img/icon-4.png",
                      public: false,
                      created_at: new Date()
    });
    
    t.$('#intro-modal').modal('hide');
    t.$('#course-banner').text(name);
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
   */
  'click #cb-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();


//-------------------------------------------------------------------
  }
    //BlazeLayout.render( 'certificateLayout', {main: "certificate"} );
});
