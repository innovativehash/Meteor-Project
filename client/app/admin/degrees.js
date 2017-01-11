/*
 * @module degrees
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
 
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Courses }      from '../../../both/collections/api/courses.js';
import { Diplomas }     from '../../../both/collections/api/diplomas.js';

import '../../templates/admin/degrees.html';


let degree      = {}
  , count       = 0;

degree.courses  = [];


/*
 * CREATED
 */
Template.degrees.onCreated(function() {

  $( "#degree-cover" ).show();


  /*
   * JQUERY-UI DRAG & DROP
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function(){

    $( '#drop1,#drop2, #drop3, #drop4, #drop5, #drop6, #drop7' ).droppable({
      over: function( event, ui ) {
        $(this).effect( "highlight", {}, 1000 );
      },  
      drop: function( evt, ui ) {
        $(this).html( ui.draggable );

        //$(this)[0].textContent = ui.draggable[0].textContent;

        if ( degree && degree.courses ) 
          degree.courses[count++] = 
            { dc: `${ui.draggable[0].lastChild.firstChild.dataset.dc}`,
              di: `${ui.draggable[0].lastChild.firstChild.dataset.di}`
            }
      }
    });

  //console.log('degree:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'degree:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------

});


/*
 * RENDERED
 */
Template.degrees.onRendered(function(){

  $( '#degree-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#degree-cover" ).hide();
    $( ".certificate-area" ).fadeIn( 'slow' );
  });

  $( '#degree-search' ).prop( 'selectionStart', 0 )
                       .prop( 'selectionEnd', 0 );
                       
    Tracker.autorun(function(){
      let d		= document.getElementById( 'dojo' );

      try {
        while ( d.hasChildNodes() ) {
     	    d.removeChild( d.lastChild );
        }
        let c   = Courses.find({ company_id: Meteor.user().profile.company_id }, {limit: 7}).fetch();
        return initC( d, c );
      } catch (e) {
        return;
      }
    });
});



/*
 * DESTROYED
 */
Template.degrees.onDestroyed(function(){
  degree = null;
  $( '#degree-search' ).val('');
});



/*
 * HELPERS
 */
Template.degrees.helpers({
/*
  initDegrees: ( b ) => {
    if ( b ) {
      console.log( 'terminating... ' );
      return;
    }
    
    Tracker.autorun(function(){
      let d		= document.getElementById( 'dojo' );
      try {
        while ( d.hasChildNodes() ) {
     	    d.removeChild( d.lastChild );
        }
        let c   = Courses.find({ company_id: Meteor.user().profile.company_id }, {limit: 7}).fetch();
        return initC( d, c );
      } catch (e) {
        return;
      }
    });
  },
*/
});



/*
 * EVENTS
 */
Template.degrees.events({

  /*
   * #ENTER-DEGREE-NAME  ::(BLUR)::
   */
  'blur #enter-degree-name'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $( '#dName' ).text( $( '#enter-degree-name' ).val() );
//-------------------------------------------------------------------
  },


  'keyup #degree-search'( e, t ) {
    
    // SEARCH TERM
    let tf 	= document.getElementById( 'degree-search' ).value;
    
    let d		= document.getElementById( 'dojo' );

     while ( d.hasChildNodes() ) {
     	d.removeChild( d.lastChild );
     }
     
    let patt1 = `/^${tf}/i`;
    let patt2 = `/^${tf}/`;

    let items = Courses.find({ $and: [{ company_id: { $eq: Meteor.user().profile.company_id } },{ name: { $in: [ eval(patt1), eval(patt2) ] } } ] }).fetch();
    let len = items.length;

     for( let i = 0; i < len; i++ ) {
  
     	let child 			= document.createElement( 'div' );
     	let sp          = document.createElement( 'span' );
     	let im          = document.createElement( 'img' );
     	
     	im.src        = "/img/icon-7.png";
     	im.className  = '';
     	im.id         = `deg-img-${i}`;
     	im.dataset.dc = `${items[i].credits}`;
     	im.dataset.di = `${items[i]._id}`;
     	
     	sp.appendChild( im );
     	
      child.className = "d-cur draggable ui-widget-content";
      child.id        = `deg-holder-${i}`;
      child.innerHTML = `${items[i].name}`;
      
      child.appendChild( sp );
      d.appendChild( child );

     	$( `#deg-holder-${i}` ).draggable({    
     	                                    helper: "clone", 
     	                                    snap: true, 
     	                                  });
     }
     
  },


  /*
   * .JS-DEGREE-SAVE ::(CLICK)::
   */
  'click .js-degree-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let credits_total = 0,
        ids           = [],
        course_name   = $( '#enter-degree-name' ).val();

    if ( degree && degree.courses && degree.courses.length <= 0) {
      Bert.alert( 'No Courses Selected!', 'danger' );
      return;
    }

    if ( course_name == "" ) {
      Bert.alert( 'You Must Give the Degree a Name!', 'danger' );
      return;
    }

    for ( let i = 0, len = degree.courses.length; i < len; i++ ){
      credits_total += Number( degree.courses[i].dc );
      ids[i]        = degree.courses[i].di;
    }

    Diplomas.insert({
      name:             course_name,
      courses:          ids,
      credits:          credits_total,
      icon:             "/img/icon-5.png",
      company_id:       Meteor.user().profile.company_id,
      type:             "degree",
      times_completed:  0,
      created_at:       new Date()
    });

    Bert.alert( 'Degree Created!', 'success', 'growl-top-right' );

    Meteor.setTimeout(function(){
      FlowRouter.go(  'admin-degrees-and-certifications', 
                      { _id: Meteor.userId() });
    }, 1500);
//-------------------------------------------------------------------
  },



  /*
   * #FC  ::(CLICK)::
   */
  'click #fc'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
//-------------------------------------------------------------------
  },


  /*
   * #DEGREE-CERTIFICATE-PAGE  ::(CLICK)::
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE  ::(CLICK)::
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
});
//------------------------------------------------------------------------------


function initC( d, c ) {
  let len = c.length;

  for( let i = 0; i < len; i++ ) {

     	let child 			= document.createElement( 'div' );
     	let sp          = document.createElement( 'span' );
     	let im          = document.createElement( 'img' );
     	
     	im.src        = "/img/icon-7.png";
     	im.className  = '';
     	im.id         = `deg-img-${i}`;
     	im.dataset.dc = `${c[i].credits}`;
     	im.dataset.di = `${c[i]._id}`;
     	
     	sp.appendChild( im );
     	
      child.className = "d-cur ui-widget-content draggable";
      child.id        = `deg-holder-${i}`;
      child.innerHTML = c[i].name;
      
      child.appendChild( sp );
      d.appendChild( child );
/*     	
     	handle: "img", 
     	helper: "", 
     	cursorAt:{left:-5}
     	snap: true,
*/
     	$( `#deg-holder-${i}` ).draggable({ helper: "clone", snap: true});
     	                                      
      $( '#degree-search' ).prop( 'selectionStart', 0 )
                           .prop( 'selectionEnd', 0 );
    
  }
}