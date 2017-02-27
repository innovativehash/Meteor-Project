/*
 * @module cbToolbar
 *
 * @programmer <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';


import './cb-toolbar.html';


let text        = ''
  , currentItem = '';


/*=========================================================
 * CREATED
 *========================================================*/
Template.cbToolbar.onCreated(function(){
  
});



/*======================================
 * RENDERED
 *=====================================*/
Template.cbToolbar.onRendered(function(){
  
  $( '#cb-toolbar-text'  ).hide();
  $( '#cb-toolbar-media' ).hide();
  $( '#cb-toolbar-video' ).hide();
  $( '.js-edit-button' ).hide();
  
});



/*==========================
 * EVENTS
 *========================*/
Template.cbToolbar.events({
  
  
/**********************************************************
 * .JS-BOLD-BUTTON ::(CLICK)::
 *********************************************************/
  'click .js-bold-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    
    if ( $( `${cur}` ).css('fontWeight') != 'bold' ) {
      $( `${cur}` ).css('fontWeight', 'bold');
    } else {
      $( `${cur}` ).css('fontWeight', 'normal' );
    }
//---------------------------------------------------------
  },
  
  
/**********************************************************
 * .JS-ITALIC-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-italic-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    
    if ( $( `${cur}` ).css('fontStyle') != 'italic' ) {
      $( `${cur}` ).css('fontStyle', 'italic');
    } else {
      $( `${cur}` ).css('fontStyle', 'normal');
    }
//---------------------------------------------------------
  },
  
  
/**********************************************************
 * .JS-UNDERLINE-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-underline-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    console.log( 'cur = ' + cur );
    
    if ( $( `${cur}` ).css( 'textDecoration' ) != 'underline' ) {
      $( `${cur}` ).css( 'textDecoration', 'underline' );
    } else {
      $( `${cur}` ).css('textDecoration', '');
    }
//---------------------------------------------------------
  },
  
  
/**********************************************************
 * .JS-DELETE-BUTTON  ::(CLICK)::
 *********************************************************/
  'click .js-delete-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val()
      , c
      , l;
    
    switch ( cur.slice(1,3) ) {
      case 'ti': //TITLE
        $( '#cb-current' ).val( `${cur}` );
        
        $( `${cur}` ).remove();
        $( '#cb-current' ).val('');
        c = Session.get('contentTracker');
        c.titles--;
        Session.set('contentTracker', c);
        $( '#cb-toolbar-text' ).hide();
        break;
        
      case 'tx': //TEXT
        console.log( 'text' );
        $( '#cb-current' ).val( `${cur}` );

        $( `${cur}` ).remove();
        $( '#cb-current' ).val('');
        c = Session.get('contentTracker');
        c.texts--;
        Session.set('contentTracker', c);
        $( '#cb-toolbar-text' ).hide();
        break;
        
      case 'ig': //IMAGE
        $( '#cb-current' ).val( `${cur}` );
        c = Session.get( 'contentTracker' );
        c.images--;
        Session.set('contentTracker', c)
        $( `${cur}` ).remove();
        $( '#cb-current' ).val('');        
        
        $( '#cb-toolbar-media' ).hide();
        break;
        
      case 'vi': //VIDEO
        $( '#cb-current' ).val('vid');
        
        $( '#fb-template iframe' ).remove();
        c = Session.get('contentTracker');
        c.videos--;
        Session.set('contentTracker', c);
        $( '#cb-toolbar-video' ).hide();
        break;
        
      case 'pd': //PDF
        $( '#cb-current' ).val('pdf');
        
        $( '#fb-template' ).empty();
        c = Session.get('contentTracker');
        c.pdfs--;
        Session.set('contentTracker', c);
        $( '#cb-toolbar-video' ).hide();
        break;
        
      case 'pp': //POWERPOINT
        c = Session.get('contentTracker');
        c.ppts--;
        Session.set('contentTracker', c);
        $( '#cb-current' ).val('ppt');
        break;
        
      case 'sc': //SCORM
        c = Session.get('contentTracker');
        c.scorms--;
        Session.set('contentTracker', c);
        $( '#cb-current' ).val('scorm');
        break;
    }//switch
//---------------------------------------------------------
  },
  
  
/**********************************************************
 * .JS-EDIT-BUTTON
 *********************************************************/
 'click .js-edit-button'( e, t ) {
  e.preventDefault();
  
  let type = ($( '#cb-current' ).val()).slice(1,4);
  
  switch ( type ) {
    case 'txt':
      currentItem = $( '#cb-current' ).val();
      
      text = $( `${currentItem}` ).text();
      
      $( `${currentItem}` ).hide();
      
      //CREATE A NEW ELEMENT, ATTACH IT TO THE CANVAS, INJECT IT WITH THE TEXT
      $( '#fb-template' ).append( `<textarea  id="toolb-added-text" 
                                              rows="3" 
                                              style="font-size:18px;font-weight:bold;z-index:2;border-radius:5px;background-color:white;cursor:move;border:1px dashed !important;">${text}</textarea>` ).css({ 'color': 'grey', 'position': `element(${currentItem})`, 'right': 0, 'bottom': 0 });  
                                              
      $( '#toolb-added-text' ).effect( "highlight", {}, 2000 ).focus();
      
      $( '#toolb-added-text' ).blur(function(){
        let txt = $( '#toolb-added-text' ).val()
        
        $( '#toolb-added-text' ).remove();
        
        $( `${currentItem}` ).text( txt );
        $( `${currentItem}` ).show();
      });
      break;
      
    case 'tit':
      //GET THE CURRENTLY SELECTED ELEMENT
      currentItem = $( '#cb-current' ).val();
      
      //PULL OUT IT'S ACTUAL TEXT
      text = $( `${currentItem}` ).text();
        
      //HIDE THE CURRENT ELEMENT
      $( `${currentItem}` ).hide();
      
      //let pos = $( `${currentItem}` ).position();
      
      //CREATE A NEW ELEMENT, ATTACH IT TO THE CANVAS, INJECT IT WITH THE TEXT
      $( '#fb-template' ).append( `<textarea  id="toolb-added-title" 
                                              rows="3" 
                                              style="font-size:18px;font-weight:bold;z-index:2;border-radius:5px;background-color:white;cursor:move;border:1px dashed !important;">${text}</textarea>` ).css({ 'color': 'grey', 'position': `element(${currentItem})`, 'right': 0, 'bottom': 0 });
      
      
      //$( '#toolb-added-title' )
      $( '#toolb-added-title' ).effect( "highlight", {}, 2000 ).focus();
      
      $( '#toolb-added-title' ).blur(function(){
        let txt = $( '#toolb-added-title' ).val();

        $( '#toolb-added-title' ).remove();
    
        $( `${currentItem}` ).text( txt );
        $( `${currentItem}` ).show();        
      });
      
      break;
  }
//---------------------------------------------------------   
 },
  
 
  
/**********************************************************
 * .JS-FONT-SIZE  ::(INPUT)::
 *********************************************************/
  'input .js-font-size'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    
    let fsz = $(e.currentTarget).val();
    
    $( `${cur}` ).css( 'font-size',`${fsz}px` );
    
    $( '#fnt' ).val( fsz );
//---------------------------------------------------------
  },
  
  
/**********************************************************
 * .JS-OPACITY  ::(INPUT)::
 *********************************************************/
  'input .js-opacity'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    
    let fsz = $(e.currentTarget).val();
    
    $( `${cur}` ).css( 'opacity', fsz );
    
    $( '#op' ).val( fsz );
//---------------------------------------------------------
  },
  
});