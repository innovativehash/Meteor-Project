/*
 * @module certs
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
 
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { Courses }        from '../../../both/collections/api/courses.js';
import { Certifications } from '../../../both/collections/api/certifications.js';

import '../../templates/admin/certs.html';


let certificate       = {}
  , count             = 0;

certificate.courses   = [];


/*
 * CREATED
 */
Template.certs.onCreated(function(){

  $( "#certificate-cover" ).show();

  /*
   * JQUERY-UI DRAG & DROP
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function(){

    $( '#drop1,#drop2, #drop3, #drop4, #drop5, #drop6, #drop7' ).droppable({
      over: function( event, ui ) {
        $(this).effect( "highlight", {}, 500 );
      },
      drop: function( evt, ui ) {
        let iid = $(this).attr('id')
        num     = iid.slice(4);
        
        try {
          if ( ui.draggable ) {
            if ( certificate && certificate.courses ) 
              certificate.courses[num] = 
                { 
                  dc: `${ui.draggable[0].lastChild.firstChild.dataset.dc}`,
                  di: `${ui.draggable[0].lastChild.firstChild.dataset.di}`
                }
            
            $(this).removeClass('ui-droppable');
            
            let id    = ui.draggable.context.id;
            $(this).text( $( `#${id}` ).text() );
            $( `#${id}` ).remove();
            
          }
        } catch(e) {
          return;
        }
       
        Meteor.setTimeout(function(){
          $( `#${iid}` ).css('border','2px solid #d3d3d3' );
        }, 700);

      }
    });

  //console.log('certificate:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'certificate:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------


});

/*
 * RENDERED
 */
Template.certs.onRendered(function(){

  $( '#certificate-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#certificate-cover" ).hide();
    $( ".certificate-area" ).fadeIn( 'slow' );
  });

  $( '#cert-search' ).prop('selectionStart', 0)
                     .prop('selectionEnd', 0);
                     
  Tracker.autorun(function(){
      let d		= document.getElementById( 'cojo' );

      try {
        while ( d.hasChildNodes() ) {
     	    d.removeChild( d.lastChild );
        }
        let c = Courses.find( { company_id: Meteor.user().profile.company_id }, 
                              { limit: 7 }).fetch();
        return initC( d, c );
      } catch (e) {
        return;
      }    
  });
});
//-----------------------------------------------------------------------------


/*
 * DESTROYED
 */
Template.certs.onDestroyed(function(){
  certificate = null;
  $( '#cert-search' ).val('');
});
//-----------------------------------------------------------------------------



/*
 * HELPERS
 */
Template.certs.helpers({

});
//-----------------------------------------------------------------------------


/*
 * EVENTS
 */
Template.certs.events({

  /*
   * #ENTER-CERTIFICATE-NAME  ::(BLUR)::
   */
  'blur #enter-certificate-name'( e, t ) {
    e.preventDefault()
    e.stopImmediatePropagation();
    
    let cert_id = undefined
      , cert_nm = $( '#enter-certificate-name' ).val();
      
    cert_id = Certifications.findOne({ name: cert_nm });
    if ( cert_id && cert_id._id ) {
      $( '#enter-certificate-name' ).val('');
      $( '#cName' ).text('');
      Bert.alert('Sorry, but there is already a Certification by that name', 'danger');
      return;
    }
    $( '#cName' ).text( cert_nm );
//-------------------------------------------------------------------
  },


  
  /*
   * #CERT-SEARCH  ::(KEYUP)::
   *
   */
  'keyup #cert-search'( e, t ) {
    
    // SEARCH TERM
    let tf 	= document.getElementById( 'cert-search' ).value;
    
    let d		= document.getElementById( 'cojo' );

     while ( d.hasChildNodes() ) {
     	d.removeChild( d.lastChild );
     }
     
     let patt1 = `/^${tf}/i`;
     let patt2 = `/^${tf}/`;

    let items = Courses.find({ $and: [ 
                                       { company_id: { $eq: Meteor.user().profile.company_id } },
                                       { name: { $in: [ 
                                                        eval(patt1), eval(patt2) 
                                                      ] 
                                         
                                                } 
                                       } 
                                     ] 
                              }).fetch();
                              
    let len = items.length;
     
     for( let i = 0; i < len; i++ ) {
  
     	let child 			= document.createElement( 'div' );
     	let sp          = document.createElement( 'span' );
     	let im          = document.createElement( 'img' );
     	
     	im.src        = "/img/icon-7.png";
     	im.className  = '';
     	im.id         = `cert-img-${i}`;
     	im.dataset.dc = `${items[i].credits}`;
     	im.dataset.di = `${items[i]._id}`;
     	
     	sp.appendChild( im );
     	
      child.className = "d-cur draggable ui-widget-content";
      child.id        = `cert-holder-${i}`;
      child.innerHTML = `${items[i].name}`;
      
      child.appendChild( sp );
      d.appendChild( child );
     	
    	$( `#cert-holder-${i}` ).draggable({ 
                                     helper:  "clone", 
                                     snap:    true,
                                     revert:  'invalid',
                                     drag:    function(event, ui) {
                                         //if ( flags[i] ) return false;
                                     }
    	                          });
     }
//-------------------------------------------------------------------
  },
  
  
  
  /*
   * .JS-CERTIFICATE-SAVE  ::(CLICK)::
   */
  'click .js-certificate-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let credits_total = 0,
        ids           = [],
        c_id          = undefined,
        course_name   = $( '#enter-certificate-name' ).val()
        exp_date      = $( '#enter-expiration-date' ).val()
        cert_id       = undefined;

    try {
      c_id = Meteor.user().profile.company_id;
    } catch( e ) {
      return;
    }
    
    if ( ! certificate.courses || certificate.courses.length <= 0) {
      Bert.alert( 'No Courses Selected!', 'danger');
      return;
    }

    if ( course_name == "" ) {
      Bert.alert( 'You Must Give the Certificate a Name!', 'danger' );
      return;
    }

    cert_id = Certificates.findOne({ name: course_name });
    if ( cert_id && cert_id._id ) {
      $( '#enter-certificate-name' ).val('');
      $( '#cName' ).text('');
      Bert.alert('Sorry, but there is already a Certification by that name', 'delete');
      return;
    }
    
    for ( let i = 0, len = certificate.courses.length; i < len; i++ ){
      if ( certificate.courses[i] ) {
        credits_total += Number( certificate.courses[i].dc );
        ids.push(certificate.courses[i].di);
      }
    }

    Certifications.insert({
      name:             course_name,
      courses:          ids,
      credits:          credits_total,
      num:              ids.length,
      icon:             "/img/icon-6.png",
      company_id:       c_id,
      type:             "Certifications",
      times_completed:  0,
      expiry_date:      exp_date || "",
      created_at:       new Date()
    });

    Bert.alert( 'Certificate Created!', 'success', 'growl-top-right' );

    Meteor.setTimeout(function(){
      FlowRouter.go(  'admin-degrees-and-certifications', 
                      { _id: Meteor.userId() }
      );
    }, 1500);
//-------------------------------------------------------------------
  },



  /*
   * #DEGREE-CERTIFICATE-PAGE ::(CLICK)::
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go(  'admin-degrees-and-certifications', 
                    { _id: Meteor.userId() }
    );
//-------------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE ::(CLICK)::
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },

});
//-----------------------------------------------------------------------------



function initC( d, c ) {
  let len = c.length;
  
  for( let i = 0; i < len; i++ ) {

     	let child 			= document.createElement( 'div' );
     	let sp          = document.createElement( 'span' );
     	let im          = document.createElement( 'img' );
     	
     	im.src        = "/img/icon-7.png";
     	im.className  = '';
     	im.id         = `cert-img-${i}`;
     	im.dataset.dc = `${c[i].credits}`;
     	im.dataset.di = `${c[i]._id}`;
     	
     	sp.appendChild( im );
     	
      child.className = "d-cur draggable ui-widget-content";
      child.id        = `cert-holder-${i}`;
      child.innerHTML = c[i].name;
      
      child.appendChild( sp );
      d.appendChild( child );
     	
     	$( `#cert-holder-${i}` ).draggable({   
     	                                      snap: true, 
     	                                      revert: 'invalid',
                                            drag:    function(event, ui) { 
                                              //if ( flags[i] ) return false;
                                            }
     	});
     	                                      
      $( '#cert-search' ).prop('selectionStart', 0)
                         .prop('selectionEnd', 0);
    
  }
}

/*
 * REPLACE TEXT NODE()
 */
function replaceTextNode( t, item ) {

  let textNode    = t.contents().first();
  let replaceWith = `${item.name}`;
  textNode.replaceWith( replaceWith );

}