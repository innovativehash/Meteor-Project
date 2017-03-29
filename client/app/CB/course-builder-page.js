/*
 * @module courseBuilderPage
 *
 * @programmer <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import async              from 'async';
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { Courses }        from '../../../both/collections/api/courses.js';
import { Students }       from '../../../both/collections/api/students.js';
import { Images }         from '../../../both/collections/api/images.js';
import { Pdfs }           from '../../../both/collections/api/pdfs.js';
import { PowerPoints }    from '../../../both/collections/api/powerpoints.js';

import './course-builder-page.html';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.css';


/*
 * IMPORT BROKEN-OUT EVENT HANDLERS
 */
import * as CBCreateDOM from './CB_MODULES/createDOM.js';
import * as CBImage     from './CB_MODULES/image-handling.js';
import * as CBTitle     from './CB_MODULES/title-handling.js';
import * as CBTexts     from './CB_MODULES/texts-handling.js';
import * as CBVideo     from './CB_MODULES/video-handling.js';
import * as CBPDF       from './CB_MODULES/pdf-handling.js';
import * as CBPP        from './CB_MODULES/power-point-handling.js';
import * as CBSCORM     from './CB_MODULES/scorm-handling.js';
import * as TTL         from './CB_MODULES/cb-title.js';
import * as Render      from './CB_MODULES/render.js';

import { PageObject }   from './CB_MODULES/cb-page-object.js';


let P           = new PageObject()
  , pp          = new Mongo.Collection(null)
  , master_num  = 0
  , page
  , total
  , rtn
  , return_page
  , editor1;


/*=========================================================
 *  CREATED
 *=======================================================*/
Template.courseBuilderPage.onCreated( function() {
  //p  = FlowRouter.current().path;

  $( '#prompt' ).hide();
  
  Blaze._allowJavascriptUrls();

  $( '#cover' ).show();

  this.rtn          = new ReactiveVar( FlowRouter.getQueryParam('rtn') );
  this.return_page  = new ReactiveVar(this.rtn.get());
  this.page         = new ReactiveVar(1)
  this.total        = new ReactiveVar(1);

  this.page.set(1);
  this.total.set(1);
  
  $('#p').attr('data-p', 1);
  
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
        $( '#fb-template' ).css({ 'background-color': 'white', 'border': '1px dashed #d3d3d3' });

        let draggedType = ui.draggable.data( 'type' );
          //, p = $('#p').attr('data-p')
          //, t = $('#p').attr('data-t');
          
        switch ( draggedType ) {
          
          case 'title':
             try {

              let arr = P.dumpPage( that.page.get() );

              if ( arr.length > 0 ) {
                for( let titi = 0, titlen = arr.length; titi < titlen; titi++ ) {
                  if ( arr[titi].type == 'test' ) {
                    Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                    return;                   
                  } else 
                      if ( arr[titi].type == 'pdf' ) {
                        Bert.alert( 
                              'A PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                        return;                                          
                  } else
                      if ( arr[titi].type == 'video' ) {
                         Bert.alert( 
                              'A Video must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                          return;                                                                 
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }           
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              $( '#cb-text-toolbar'  ).hide();
              
              addTitle( evt.pageX, evt.pageY );
            break;
            
          case 'text':
              try {

              let arr = P.dumpPage( that.page.get() );

              if ( arr.length > 0 ) {
                for( let txt = 0, txtlen = arr.length; txt < txtlen; txt++ ) {
                  if ( arr[txt].type == 'test' ) {
                    Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                    return;                   
                  } else 
                      if ( arr[txt].type == 'pdf' ) {
                        Bert.alert( 
                              'A PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                        return;                                          
                  } else
                      if ( arr[txt].type == 'video' ) {
                         Bert.alert( 
                              'A Video must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                          return;                                                                 
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }                      
              $( '#cb-title-toolbar' ).hide()
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              
              //CREATE A NEW EDITOR INSTANCE INSIDE THE <div id="editor">
              //ELEMENT, SETTING ITS VALUE TO HTML. 
			        let config  = {}
			          , html    = "";
			          
			        $( '.js-cb-text-edit' ).hide();
			        $( '.js-cb-text-delete' ).hide();
			        $( '#cb-editor-save-text' ).show();
              $( '#cb-text-toolbar' ).show();

			       editor1 = CKEDITOR.appendTo( 'editor1', config, html );
			          
              //addText( evt.pageX, evt.pageY );
              break;
              
          case 'g-image':
               try {

              let arr = P.dumpPage( that.page.get() );

              if ( arr.length > 0 ) {
                for( let img = 0, imglen = arr.length; img < imglen; img++ ) {
                  if ( arr[img].type == 'test' ) {
                    Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                    return;                   
                  } else 
                      if ( arr[img].type == 'pdf' ) {
                        Bert.alert( 
                              'A PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                        return;                                          
                  } else
                      if ( arr[img].type == 'video' ) {
                         Bert.alert( 
                              'A Video must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                          return;                                                                 
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }                                 
            if( S3.collection.findOne() ) {
              let id = S3.collection.findOne()._id;
              S3.collection.remove({ _id: id });
            }

              $( '#cb-title-toolbar' ).hide();
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              $( '#cb-text-toolbar'  ).hide();
            
            $( '#add-image' ).modal( 'show' );

            break;
            
          case 'video':
                try {

              let arr = P.dumpPage( that.page.get() );

              if ( arr.length > 0 ) {
                for( let vid = 0, vidlen = arr.length; vid < vidlen; vid++ ) {
                  if ( arr[vid].type == 'test' ) {
                    Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                    return;                   
                  } else 
                      if ( arr[vid].type == 'pdf' ) {
                        Bert.alert( 
                              'A PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                        return;                                          
                  } else
                      if ( arr[vid].type == 'video' ) {
                         Bert.alert( 
                              'A Video must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                          return;                                                                 
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }                                            
            try{
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                Bert.alert('Video must be on a page by itself', 'danger');
                return;
              }
            } catch (e) {
              ;
            }
            
              $( '#cb-title-toolbar' ).hide();
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              $( '#cb-text-toolbar'  ).hide();

            addVideo();
            break;
            
          case 'pdf':
                 try {

              let arr = P.dumpPage( that.page.get() );

              if ( arr.length > 0 ) {
                for( let pdf = 0, pdflen = arr.length; pdf < pdflen; pdf++ ) {
                  if ( arr[pdf].type == 'test' ) {
                    Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                    return;                   
                  } else 
                      if ( arr[pdf].type == 'pdf' ) {
                        Bert.alert( 
                              'A PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                        return;                                          
                  } else
                      if ( arr[pdf].type == 'video' ) {
                         Bert.alert( 
                              'A Video must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                          return;                                                                 
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }                                                       
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                Bert.alert('Pdf must be on a page by itself', 'danger' );
                return;
              }
            } catch ( e ) {
              ;
            }
              
              $( '#cb-title-toolbar' ).hide();
              $( '#cb-media-toolbar' ).hide();
              $( '#cb-video-toolbar' ).hide();
              $( '#cb-text-toolbar'  ).hide();
              
            $( '#add-pdf' ).modal( 'show' );
          
            break;
            
          case 'powerpoint':
                 try {

              let arr = P.dumpPage( that.page.get() );

              if ( arr.length > 0 ) {
                for( let ppt = 0, pptlen = arr.length; ppd < pptlen; ppt++ ) {
                  if ( arr[ppt].type == 'test' ) {
                    Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                    return;                   
                  } else 
                      if ( arr[ppt].type == 'pdf' ) {
                        Bert.alert( 
                              'A PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                        return;                                          
                  } else
                      if ( arr[ppt].type == 'video' ) {
                         Bert.alert( 
                              'A Video must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                          return;                                                                 
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }                                                       
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                Bert.alert( 
                              'PowerPoint must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                return;
              }
            } catch ( e ) {
              ;
            } 
                  
            $( '#cb-title-toolbar' ).hide();
            $( '#cb-media-toolbar' ).hide();
            $( '#cb-video-toolbar' ).hide();
            $( '#cb-text-toolbar'  ).hide();
              
            $( '#add-powerpoint' ).modal( 'show' );
              
            break;
            
          case 'scorm':
                 try {

              let arr = P.dumpPage( that.page.get() );

              if ( arr.length > 0 ) {
                for( let scm = 0, scmlen = arr.length; scm < scmlen; scm++ ) {
                  if ( arr[scm].type == 'test' ) {
                    Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                    return;                   
                  } else 
                      if ( arr[scm].type == 'pdf' ) {
                        Bert.alert( 
                              'A PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                        return;                                          
                  } else
                      if ( arr[scm].type == 'video' ) {
                         Bert.alert( 
                              'A Video must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                          return;                                                                 
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }                                                       
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                  Bert.alert( 
                              'SCORM must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
              }
            } catch ( e ) {
                ;
            }      
            
            $( '#cb-title-toolbar' ).hide();
            $( '#cb-media-toolbar' ).hide();
            $( '#cb-video-toolbar' ).hide();
            $( '#cb-text-toolbar'  ).hide();
              
            $( '#add-scorm' ).modal( 'show' );
              
            break;
            
          case 'test':
                 try {

              let arr = P.dumpPage( that.page.get() );

              if ( arr.length > 0 ) {
                for( let tst = 0, tstlen = arr.length; tst < tstlen; tst++ ) {
                  if ( arr[tst].type == 'test' ) {
                    Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                    return;                   
                  } else 
                      if ( arr[tst].type == 'pdf' ) {
                        Bert.alert( 
                              'A PDF must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                        return;                                          
                  } else
                      if ( arr[tst].type == 'video' ) {
                         Bert.alert( 
                              'A Video must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                          return;                                                                 
                  }
                }//for
              }//if
            } catch ( e ) {
                ;
            }                                                       
            try {
              let arr = P.dumpPage( that.page.get() );
              if ( arr.length > 0 ) {
                  Bert.alert( 
                              'A Test must be the only item on the page!', 
                              'danger', 
                              'fixed-top', 
                              'fa-frown-o' 
                            );
                  return;
              }
            } catch ( e ) {
                ;
            }
            
            $( '#cb-title-toolbar'  ).hide();
            $( '#cb-text-toolbar'   ).hide()
            $( '#cb-media-toolbar'  ).hide();
            $( '#cb-video-toolbar'  ).hide();
            
            let test_session_bak      = {}; 
            test_session_bak.page     = that.page.get();
            test_session_bak.total    = that.total.get();
            test_session_bak.name     = Session.get('cinfo').cname;
            test_session_bak.rtn_page = that.return_page.get();
            Session.set( 'obj', test_session_bak );
            
            if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
              FlowRouter.go( '/teacher/dashboard/test-maker/' 
                + Meteor.userId() + `?${test_session_bak.name}` );
            } else if ( Meteor.user().roles && Meteor.user().roles.admin ) {
              FlowRouter.go( '/admin/dashboard/test-maker/'   + Meteor.userId() 
                + `?${test_session_bak.name}` );
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

});  //END ONCREATED



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
    let test_session_bak = Session.get( 'obj' );
    Session.set( 'obj', null );
    
    Session.set( 'test_id', FlowRouter.getQueryParam("id") );
    Session.set( 'Scratch', FlowRouter.getQueryParam("id") );
    
    //SAVE THE TEST
    P.append({
      page_no:  test_session_bak.page,
      type:     'test',
      id:       Session.get('test_id'),
    });
    
    //SHOW THE TEST
    $('#fb-template').empty();
    $('#fb-template').hide();
    $('#test_v').show();
    
    this.page.set( test_session_bak.page );
    this.total.set( test_session_bak.total );
    this.return_page.set(test_session_bak.rtn_page);
    console.log( this.return_page.get() );
    P.print()
    return;
  }
  
  if (  FlowRouter.getQueryParam( "rtn" ) &&
        FlowRouter.getQueryParam( "cancel" )
     )
  {
    let test_session_bak = Session.get( 'obj' );
    if ( test_session_bak && test_session_bak.page && test_session_bak.total ) {
      this.page.set( test_session_bak.page );
      this.total.set( test_session_bak.total );
    } else {
      console.log('fail');
    }
    if ( test_session_bak && test_session_bak.rtn_page ) {
      this.return_page.set( test_session_bak.rtn_page);
      this.rtn.set( test_session_bak.rtn_page );
    }
    
    Session.set('obj', null);
    test_session_bak = null;
    return;
  }
  

  Meteor.setTimeout(function(){
    let returnFromTest = Session.get('test_id');

    //IF WE'RE RELOADING TO CLEAR URL AFTER RETURNING FROM TEST BUILDING
    if ( _.isNull( returnFromTest ) || _.isUndefined( returnFromTest ) ) {
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

  cbNavBack: () => {
    if ( Template.instance().return_page.get() == 'library' ) {
      return 'Back To Library';
    } else if ( Template.instance().return_page.get() == 'courses' ) {
      return 'Back To Courses';
    }
  },
  
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


/********************************************************
 * CB-NEXT  ::(CLICK)::    [NEXT BUTTON CLICK]
 *******************************************************/
  'click #cb-next-btn'( e, t ) {
    e.preventDefault();

    //HIDE EDITING TOOLBARS
    $( '#cb-text-toolbar'  ).hide();
    $( '#cb-media-toolbar' ).hide();
    $( '#cb-title-toolbar' ).hide();
    $( '#cb-video-toolbar' ).hide();
 
    let p   = t.page.get()
      , tt  = t.total.get();
       
    
    $('#fb-template').empty().show();
    $('#test_v').hide();
    
    if ( p < tt ) {
      p++;
      t.page.set( p );
      
      let arr = P.dumpPage(p);
      Render.render( e, t, arr, P );
      
      return;
      
    } else {
      
      //let key = `page_${p}`
        //, insertion = {};
      //insertion[key] = P.dumpPage(p);
      /*
      pp.update({ _id: Session.get('my_id') }, 
                {$push:
                  { pages: P.dumpPage(p) } 
                });
      */
      try {
        let arr = P.dumpPage( p );
     
        if ( p == tt && arr.length == 0 ){
          return;
          
        } else {
          
          t.page.set( p + 1 );
          t.total.set( p + 1 );
            return;
        }
      } catch (e) {
          ;
      }
      
      return;
    }
    
  },
//---------------------------------------------------------



/********************************************************
 * CB-PREV  ::(CLICK)::    [PREVIOUS BUTTON CLICK]
 *******************************************************/
  'click #cb-prev-btn'( e, t ) {
    e.preventDefault(); 
 
    //HIDE EDITING TOOLBARS
    $( '#cb-text-toolbar'  ).hide();
    $( '#cb-media-toolbar' ).hide();
    $( '#cb-title-toolbar' ).hide();
    $( '#cb-video-toolbar' ).hide();  
    
    let p = t.page.get();
    
    if ( p <= 1 ) {
      p = 1;
    } else {
      p -= 1;
    }
    
    t.page.set( p );
    
    $( '#fb-template' ).empty();
    
    let arr = P.dumpPage(p);
    
    Render.render( e, t, arr, P );
    
    
  },
  
  

/********************************************************
 * #CB-INITIAL-DIALOG  ::(CLICK)::  [INITIAL DIALOG]
 *******************************************************/
  'click #cb-initial-dialog'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();


      // ADVANCE PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
      let credits = t.$( '#course-builder-credits' ).val()

      , name    = t.$( '#course-builder-name'    ).val()

      , percent = t.$( '#course-builder-percent' ).val()

      , keys    = t.$( '#tags' ).val()
      , role
      , creator_id  = Meteor.userId()
      , cid         = Meteor.user() && Meteor.user().profile && Meteor.user().profile.company_id;

      if ( percent  == '' ) percent = 1001; //completion is passing
      
      if ( name     == '' || credits == '' ) {
      
        Bert.alert( 
                    'BOTH Course Name AND Credits MUST be filled out!', 
                    'danger', 
                    'fixed-top', 
                    'fa-frown-o' 
                  );
        return;
      }
      
      if ( Courses.findOne({ name: name }) != undefined )
      {
        Bert.alert( 
                    'There is already a course with that name!', 
                    'danger', 
                    'fixed-top', 
                    'fa-grown-o' 
                  );
        return;
      }
      
      if (  Meteor.user() && 
            Meteor.user().roles && 
            Meteor.user().roles.teacher )  role = 'teacher';
            
      if (  Meteor.user() && 
            Meteor.user().roles && 
            Meteor.user().roles.admin )    role = 'admin';
      
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
      
      let my_id = pp.insert({ pages: [] });
                           
      Session.set( 'my_id', my_id );
    
      t.$( '#intro-modal' ).modal( 'hide' );
//-----------------------------------------------/INITIAL DIALOG------
  },


  /********************************************************
   * CB-INTRO-MODAL-CANCEL
   *******************************************************/
   'click #cb-intro-modal-cancel'( e, t ) {
      e.preventDefault();
      
      let ret_route = FlowRouter.getQueryParam("rtn");
      
      t.$( '#intro-modal' ).modal( 'hide' );
      
      Meteor.setTimeout(function(){
        if (  Meteor.user() && 
              Meteor.user().roles && 
              Meteor.user().roles.admin ) 
        {
          if ( ret_route == 'courses' ) {
            FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
            return;
          } else if ( ret_route == 'library' ) {
            FlowRouter.go( 'admin-add-from-library', { _id: Meteor.userId() });
          }
          
        } else if ( Meteor.user() && 
                    Meteor.user().roles && 
                    Meteor.user().roles.teacher ) {
          FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
          return;
        }
      }, 500);
   },
 //--------------------------------------------------------- 



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
    
    // ADVANCE PAGE COUNTS
    t.page.set( 1 );
    t.total.set( 1 );
      
    Session.set( 'my_id',           null );
    Session.set( 'cinfo',           null );
    Session.set( 'test_id',         null );
    Session.set( 'Scratch',         null );
      
    t.$( '#cb-leave-confirm' ).modal('hide');
    
    //NECESSARY DELAY OR DIALOG CAUSES DISPLAY ISSUES ON DESTINATION
    Meteor.setTimeout(function(){
      try {
        if ( t.return_page.get() == 'courses' ) {
          if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
            FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
          } else if ( Meteor.user().roles && Meteor.user().roles.admin ) {
            FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
          }
        } else if ( t.return_page.get() == 'library' ) {
          if ( Meteor.user().roles && Meteor.user().roles.teacher ) {
            FlowRouter.go( 'teacher-courses', { _id: Meteor.userId() });
          } else if ( Meteor.user().roles && Meteor.user().roles.admin ) {
            FlowRouter.go( 'admin-add-from-library', { _id: Meteor.userId() });
          }         
        }
      } catch( e ) {
        console.log( e );
        console.log( 'cb lineno: 983' );
      }
    }, 500);
//---------------------------------------------------------  
  },
  
  

  /********************************************************
   * #EXIT-CB  ::(CLICK)::
   *******************************************************/
  'click #exit-cb'( e, t ) {
    t.$( '#intro-modal' ).modal( 'hide' );
    
      // ADVANCE PAGE COUNTS
      t.page.set(  1 );
      t.total.set( 1 );
      
      Session.set( 'cinfo',   null );
      Session.set( 'my_id',   null );
      Session.set( 'test_id', null );
      Session.set( 'Scratch', null );
      
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
    
    t.$( '#intro-modal' ).modal( 'hide' );

//NEED A BETTER CHECK THAT THERE'S CONTENT
/*
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
*/
    let uname = Students.findOne( { _id: Meteor.userId() },
                                  { fullName:1 } ).fullName
      //, uid   = Meteor.userId()
      //, apv   = ( Meteor.user().roles.teacher ) ? false : true
      , cinfo = Session.get('cinfo'); //{cname: name, credits: Number(credits),
                                      //passing_percent: Number(percent),
                                      //keywords: keys,
                                      //icon: "/img/icon-4.png" }
P.print();
let pobj = P.dump();
    Meteor.setTimeout(function(){

      Meteor.call('saveBuiltCourse',  cinfo.cname,
                                      cinfo.company_id, 
                                      cinfo.creator_type,
                                      cinfo.credits, 
                                      cinfo.keywords,
                                      cinfo.passing_percent,
                                      cinfo.icon,
                                      pobj,
                                      uname,
                                      function( error, result )
      {
          if( error ) {
            alert( 'Error' );
          } else {
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
              type:             'course',
              isArchived:       false
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

      // SET PAGE COUNTS
      t.page.set( 1 );
      t.total.set( 1 );
      
    }, 300);

    P = null;
    
    Session.set( 'my_id',           null );
    Session.set( 'cinfo',           null );
    Session.set( 'test_id',         null );
    Session.set( 'Scratch',         null );
    
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



//--------------TOOLBAR HANDLERS---------------------------


//--BEGIN TITLES TOOLBAR-----------------------------------

 /**********************************************************
 * .JS-TITLE-EDIT-BUTTON
 *********************************************************/
 'click .js-title-edit-button'( e, t ) {
    e.preventDefault();
      
    TTL.titleEditText( e, t, P );
//---------------------------------------------------------   
 },   

 
   /********************************************************
   * .JS-TITLE-DELETE-BUTTON
   *******************************************************/
  'click .js-title-delete-button'( e, t ) {
    e.preventDefault();
    
    TTL.titleDelete( e, t, P, pp );
//----------------------------------------------------------
  },
 
  
/**********************************************************
 * .JS-TITLE-ITALIC-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-title-italic-button'( e, t ) {
    e.preventDefault();

    TTL.titleItalic( e, t, P );
//---------------------------------------------------------
  }, 
  
  
 /**********************************************************
 * .JS-TITLE-BOLD-BUTTON ::(CLICK)::
 *********************************************************/
  'click .js-title-bold-button'( e, t ) {
    e.preventDefault();

    TTL.titleBold( e, t, P );
//---------------------------------------------------------
  },
  
 
 /**********************************************************
 * .JS-TITLE-UNDERLINE-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-title-underline-button'( e, t ) {
    e.preventDefault();
    
    TTL.titleUnderline( e, t, P );
//---------------------------------------------------------
  },
  
 
 /**********************************************************
 * .JS-TITLE-FONT-SIZE  ::(INPUT)::
 *********************************************************/
  'input .js-title-font-size'( e, t ) {
    e.preventDefault();
    
    TTL.titleFontSizeInput( e, t );
  },
//---------------------------------------------------------



 /**********************************************************
 * .JS-TITLE-FONT-SIZE  ::(MOUSEUP)::
 *********************************************************/
  'mouseup .js-title-font-size'( e, t ) {
    //e.preventDefault();

    TTL.titleFontSizeMU( e, t, P );
    return;
  },
//---------------------------------------------------------  
  
  
  
/**********************************************************
 * .JS-TITLE-OPACITY  ::(INPUT)::
 *********************************************************/
  'input .js-title-opacity'( e, t ) {
    e.preventDefault();
    
    TTL.titleOpacityInput( e, t );
  }, 
//---------------------------------------------------------



 /**********************************************************
 * .JS-TITLE-OPACITY  ::(MOUSEUP)::
 *********************************************************/
  'mouseup .js-title-opacity'( e, t ) {
    //e.preventDefault();

    TTL.titleOpacityMU( e, t, P );
    return;
  },
 //--------------------------------------------------------- 
  
//---------------------------------------END TITLES TOOLBAR-


//---BEGIN TEXT TOOLBAR------------------------------------

/**********************************************************
 * .JS-CB-TEXT-EDIT  ::(CLICK)::
 *********************************************************/
 'click .js-cb-text-edit'( e, t ) {
    e.preventDefault();

      $( '#cb-editor-save-text' ).show();
      $( '.js-cb-text-edit' ).hide();
      $( '.js-cb-text-delete' ).hide();
      
      //IE #txt-0
      let currentItem = $( '#cb-current' ).val()
        , text        = $( `#${currentItem}` ).text().trim()
        , config      = {};
      
      $( `#${currentItem}` ).attr('data-editing', true);
      $( `#${currentItem}` ).hide();
      
      editor1 = CKEDITOR.appendTo( 'editor1', config, text ); 
        
      //CKEDITOR.instances.editor1.setData(text);
      
      
      //$('#cb-text-toolbar').show()
      
      currentItem = null;
      
    //TXT.textEdit( e, t, editor1 );
 },
//---------------------------------------------------------



/**********************************************************
 * #CB-EDITOR-SAVE-TEXT  ::(CLICK)::
 *********************************************************/
 'click #cb-editor-save-text'( e, t ) {
   e.preventDefault();
   
   let cur = $('#cb-current').val()
    , txt = editor1 && editor1.getData(); //CKEDITOR.instances.editor1.getData();
	  
	 if ( txt == '' || txt == undefined || txt == null ) {
	   Bert.alert('You must enter text to be saved', 'danger');
	   return;
	 }
	 
   if ( $( `#${cur}` ).attr('data-editing') ) {
    let idx = P.indexOf( `${cur}` )
      , pos = $( `#${cur}` ).offset();
    
    P.remove( `${cur}` );
    
    P.insert( idx, { 
      page_no:        t.page.get(),
      type:           'text',
      id:             cur,
      text:           txt.trim(),
      offset:         pos,
      zIndex:         $( `#${cur}` ).css('z-index'),
      fontSize:       $( `#${cur}` ).css('font-size'),
      border:         $( `#${cur}` ).css('border'),
      fontWeidht:     $( `#${cur}` ).css('font-weight'),
      fontStyle:      $( `#${cur}` ).css('font-style'),
      textDecoration: $( `#${cur}` ).css('text-decoration'),
      opacity:        $( `#${cur}` ).css('opacity')
    });
    P.print();
    
	  editor1 && editor1.destroy();
		editor1 = null;
		
		$('#cb-text-toolbar').hide();

    $( `#${cur}` ).attr('data-editing', false);
    $( `#${cur} p` ).remove();
    $( `#${cur}` ).append( txt );
    $( `#${cur}` ).show();
		return;
   } else {
    
     
    editor1 && editor1.destroy();
		editor1 = null;
		
		$('#cb-text-toolbar').hide();
	
    CBTexts.cbAddedTextBlur(  e,
                              t, 
                              txt,
                              t.page.get(),
                              master_num++,
                              P
                            );
   }
   
		//Bert.alert('Saving Text...', 'success');
    
    //CKEDITOR.instances.editor1.setData('');
    
 },
//---------------------------------------------------------



/**********************************************************
 * .JS-CB-TEXT-DELETE  ::(CLICK)::
 *********************************************************/
 'click .js-cb-text-delete'( e, t ) {
    e.preventDefault();
 
    //I.E. txt-0
    let cur = $( '#cb-current' ).val()
      , page_no = t.page.get();
		
		P.remove( `${cur}` );
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');

    
    $('#cb-text-toolbar').hide()

    pp.update( { _id: Session.get('my_id') },
              { $pull: { pages:{ id: cur} } }); 
    
    console.log( pp.find({}).fetch() );
    P.print();
    //editor1.destroy();
		//editor1 = null;
//---------------------------------------------------------
},


//---------------------------------------END TEXT TOOLBAR-


//------BEGIN VIDEO TOOLBAR--------------------------------

  /********************************************************
   * .JS-VIDEO-DELETE-BUTTON
   *******************************************************/
  'click .js-video-delete-button'( e, t ){
    e.preventDefault();
    
    let cur = $( '#cb-current' ).val()
      , page_no = t.page.get();
    
 		P.remove( `${cur}` );
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');
     pp.update( { _id: Session.get('my_id') },
              { $pull: { pages:{ id: cur} } }); 
    
    console.log( pp.find({}).fetch() );
    P.print();
   
    $('#fb-template').css( 'border', '' ); 
    
    $( '#fb-template iframe' ).remove();
    $( '#cb-current' ).val('');
    
    $( '#cb-video-toolbar' ).hide();    
//---------------------------------------------------------  
  },


//--------------------------------------END VIDEO TOOLBAR--


//--------BEGIN MEDIA TOOLBAR------------------------------

  /********************************************************
   * .JS-MEDIA-DELETE-BUTTON
   *******************************************************/
  'click .js-media-delete-button'( e, t ) {
    e.preventDefault();  
    
    let cur     = $( '#cb-current' ).val()
      , page_no = t.page.get();
    
 		P.remove( `${cur}` );
 		
    $( `#${cur}` ).remove();
    $( '#cb-current' ).val('');
    
     pp.update( { _id: Session.get('my_id') },
              { $pull: { pages:{ id: cur} } }); 
    
    console.log( pp.find({}).fetch() );
    P.print();
    
    //P.update( { _id: Session.get('my_id') },
              //{ $pull: { objects:{ id:{$eq: cur} } }});
    
    $( '#cb-media-toolbar' ).hide();
    
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
 

//-------------------------------------END MEDIA TOOLBAR---



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
                          P,
                          Images
                        );
  },
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
   * #COURSE-BUILDER-PDF  ::(CHANGE)::
   *******************************************************/
  'change #course-builder-pdf'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    CBPDF.cbPDFChange( e, t );
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
//---------------------------------------------------------




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
  $( '#fb-template' ).append( 
                              '<textarea  id="added-text" ' +
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
                                      'placeholder="Add YouTube OR Vimeo URL here" ' +
                                      'autofocus>' 
                    );
                    //.effect( "highlight", {}, 2000 );
                    //.css( 'border', '1px dashed grey' );
}