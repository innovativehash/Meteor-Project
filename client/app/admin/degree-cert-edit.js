/*
 * @module degreeCertEdit
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Certifications } from '../../../both/collections/api/certifications.js';
import { Diplomas }       from '../../../both/collections/api/diplomas.js';
import { Courses }        from '../../../both/collections/api/courses.js'


import '../../templates/admin/degree-cert-edit.html';

let certificate       = {}
  , count             = 0
  , current_num       = 1
  , type
  , rec_id;

certificate.courses   = [];



Template.degreeCertEdit.onCreated(function(){
  
  /*
   * JQUERY-UI DRAG & DROP
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function(){

    $( ".sortable" ).sortable({
      /*
        start: function(event, ui) {
            var start_pos = ui.item.index();
            ui.item.data('start_pos', start_pos);
        },
        update: function(event, ui) {
            var start_pos = ui.item.data('start_pos');
            var end_pos = ui.item.index();
            console.log(start_pos + ' - ' + end_pos);
        }
      */
    });
    $( ".sortable" ).disableSelection();
    
    $( '#drop1,#drop2, #drop3, #drop4, #drop5, #drop6, #drop7'  ).droppable({
      
      over: function( event, ui ) {
        $(this).effect( "highlight", {}, 500 );
      },
      
      drop: function( evt, ui ) {
        
        let iid = $(this).attr('id') //i.e drop1
        num     = iid.slice(4);
        
        try {
          if ( ui.draggable ) {
            /*
            if ( certificate && certificate.courses ) 
              certificate.courses[num] = 
                { dc: `${ui.draggable[0].dataset.dc}`,
                  di: `${ui.draggable[0].dataset.di}`
                }
            */
            $(this).removeClass('ui-droppable');
            
            //$(this).empty().html( ui.draggable );
            
            let id    = ui.draggable.context.id; //i.e cert-holder-0
           
            $(this).text( $( `#${id}` ).text() );
            $(this).attr('data-dc', `${ui.draggable[0].dataset.dc}`);
            $(this).attr('data-di', `${ui.draggable[0].dataset.di}`);
           
            $( `#${id}` ).remove();
            
          }
        } catch(e) {
          return;
        }
        
        let counter = $( '#num' ).data('num');
        let cnt;
        
        cnt = 7 - counter - current_num;
        current_num += 1;
        if ( cnt == 0 ) return;
        
        
        $( `#drop${current_num}` ).show();
        
        Meteor.setTimeout(function(){
          $( `#${iid}` ).css( 'border','2px solid #d3d3d3' ).css( 'color', 'black' );
        }, 700);

      }
    });

  //console.log('certificate:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'certificate:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------

});

Template.degreeCertEdit.onRendered(function(){

  Tracker.autorun(function(){
      let d		= document.getElementById( 'dc-course-list' );

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
  
  $( '#drop2' ).hide();
  $( '#drop3' ).hide();
  $( '#drop4' ).hide();
  $( '#drop5' ).hide();
  $( '#drop6' ).hide();
  $( '#drop7' ).hide();  

});



Template.degreeCertEdit.helpers({

  vitals: () => {
      type    = FlowRouter.getQueryParam( "dorc" )
      rec_id  = FlowRouter.getQueryParam( "id" )
      let v   = {};
      
    type.charAt(0).toUpperCase() + type.slice(1);
    
    //CLEANSE INPUT: WHITELIST
    if ( type != 'Certifications' && type != 'Diplomas' ) {
      throw new Error( 'invalid input' );
      return;
    }
    
    try {
      let dc  = eval( `${type}.find({ _id: rec_id }).fetch()[0]` );
      
      //ADD PROPERTY
      v.title = dc.name;
      let len = dc.courses.length;
      
      //ADD PROPERTY
      v.count = len;
      
      return v;
    } catch(e) {
      return;
    }
  },
  
  data: () => {
  
    let type  = FlowRouter.getQueryParam( "dorc" )
      , id    = FlowRouter.getQueryParam( "id" )
      , col
      , ary   = [];
    
    try {
      switch( type ) {
        case 'Diplomas':

          col   = Diplomas.find({ _id: id }).fetch()[0];
          title = `Degree ${col.name}`;
        
          for ( let i = 0, len = col.courses.length; i < len; i++ ) {
            ary[i]    = Courses.find({ _id: col.courses[i]}).fetch()[0];
            ary[i].id = i;  //add property
          }
          return ary;
          break;
          
        case 'Certifications':
          col   = Certifications.find({ _id: id }).fetch()[0];
          title = `Certificate ${col.name}`;
          
          for ( let i = 0, len = col.courses.length; i < len; i++ ) {
            ary[i] = Courses.find({ _id: col.courses[i]}).fetch()[0];
            ary[i].id = i;
          }
          return ary;
          break;
      }
    } catch( e ) {
      return;
    }
  },
  
});


Template.degreeCertEdit.events({

  /*
   *
   * SAVE EDIT
   *
   */
  'click #degree-cert-save-edit'( e, t ) {
    e.preventDefault();
    let count = $( '#num' ).data('num')
      , counter       = 0
      , cnt           = 0
      , credits_total = 0
      , exp_date      = undefined
      , ary           = [];
    
    //I.E. id #0, #1, #2, #drop1, #drop2, #drop3, #drop4
    cnt = 7 - count; 
    
    // $( '#0 p' ).text() , $( '#0 p' ).data('di') , $( '#0 p' ).data('dc')
    for ( counter; counter < count; counter++ ) {
      ary[`${counter}`] = $( `#${counter} p` ).data( 'di' );
      credits_total       += Number( $( `#${counter} p` ).data( 'dc' ) );
    }
  
    for ( let j = 1; j <= cnt; j++, counter++ ) {
      if ( $( `#drop${j}` ).data('di') ) {
        ary[`${counter}`] = $( `#drop${j}` ).data( 'di' );
        credits_total       += Number( $( `#drop${j}` ).data( 'dc' ) );
      }
    }

    return;
    switch( type ) {
      case 'Certifications':
            Certifications.update({ _id: rec_id },
                                  {$addToSet: 
                                    {courses: [ 
                                      ary
                                              ]
                                    }
                                  },
                                  {$set:
                                    { credits:          credits_total,
                                      expiry_date:      exp_date || "",
                                      created_at:       new Date()
                                    }
                                  }
            );
            break;
            
      case 'Diplomas':
        
        break;
    }

    Bert.alert( 'Record successfully edited', 'success', 'growl-top-right' );
    FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
  },
  
  
  /*
   *
   * BACK TO DEGREES AND CERTS PAGE
   *
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();
    
    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() })  ;
  },
  
  
  /*
   *
   * BACK TO DASHBOARD
   *
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
  },
  
  
  
 /*
   * #CERT-SEARCH  ::(KEYUP)::
   *
   */
  'keyup #cert-search'( e, t ) {
    
    // SEARCH TERM
    let tf 	= document.getElementById( 'cert-search' ).value;
    let d		= document.getElementById( 'dc-course-list' );
    
     while ( d.hasChildNodes() ) {
     	d.removeChild( d.lastChild );
     }
     
     let patt1 = `/^${tf}/i`;
     let patt2 = `/^${tf}/`;

    let items = Courses.find({ $and: [ 
                                       { company_id: { $eq: Meteor.user().profile.company_id } },
                                       { name: { $in: [ eval(patt1), eval(patt2) ] } } 
                                     ] 
                            }).fetch();
                            
    let len = items.length;
  
     for( let i = 0; i < len; i++ ) {

     	let child 			= document.createElement( 'div' );

      child.className   = "d-cur ui-widget-content degree-drop draggable";
      child.id          = `cert-holder-${i}`;
      child.innerHTML   = `${items[i].name}`;
      child.dataset.dc  = `${items[i].credits}`;
     	child.dataset.di  = `${items[i]._id}`;
      
      d.appendChild( child );
      
     	
    	$( `#cert-holder-${i}` ).draggable({ 
                                     /* helper:  "clone", */
                                     snap:    true,
                                     revert:  'invalid',
                                     drag:    function(event, ui) {
                                         //if ( flags[i] ) return false;
                                     }
    	                          });
    
     }
     
//-------------------------------------------------------------------
  },
  
});


/********************************************************************
 * HELPER FUNCTIONS
 ********************************************************************/
 
function initC( d, c ) {
  let len = c.length;
  
  for( let i = 0; i < len; i++ ) {

     	let child 			= document.createElement( 'div' );
     	
      child.className   = "d-cur ui-widget-content degree-drop draggable";
      child.id          = `cert-holder-${i}`;
      child.innerHTML   = c[i].name;
      child.dataset.dc  = `${c[i].credits}`;
     	child.dataset.di  = `${c[i]._id}`;
     	
      
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