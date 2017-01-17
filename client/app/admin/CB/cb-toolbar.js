/*
 * @module cbToolbar
 *
 * @programmer <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import './cb-toolbar.html';




Template.cbToolbar.onCreated(function(){
  
});

Template.cbToolbar.onRendered(function(){
  
  $( '#cb-toolbar-text' ).hide();
  $( '#cb-toolbar-media' ).hide();
  $( '#cb-toolbar-video' ).hide();
  
});



Template.cbToolbar.events({
  
  'click .js-bold-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    
    if ( $( `${cur}` ).css('fontWeight') != 'bold' ) {
      $( `${cur}` ).css('fontWeight', 'bold');
    } else {
      $( `${cur}` ).css('fontWeight', 'normal' );
    }

  },
  
  'click .js-italic-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    
    if ( $( `${cur}` ).css('fontStyle') != 'italic' ) {
      $( `${cur}` ).css('fontStyle', 'italic');
    } else {
      $( `${cur}` ).css('fontStyle', 'normal');
    }
  },
  
  'click .js-underline-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    console.log( 'cur = ' + cur );
    
    if ( $( `${cur}` ).css( 'textDecoration' ) != 'underline' ) {
      $( `${cur}` ).css( 'textDecoration', 'underline' );
    } else {
      $( `${cur}` ).css('textDecoration', '');
    }

  },
  
  'click .js-delete-button'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val()
      , l;
    
    switch ( cur.slice(1,3) ) {
      case 'ti':
        console.log( 'title' );
        $( '#cb-current' ).val( `${cur}` );
        
        $( `${cur}` ).remove();
        $( '#cb-current' ).val('');
    
        $( '#cb-toolbar-text' ).hide();
  
        break;
      case 'tx':
        console.log( 'text' );
                $( '#cb-current' ).val( `${cur}` );

        $( `${cur}` ).remove();
        $( '#cb-current' ).val('');
    
        $( '#cb-toolbar-text' ).hide();
        break;
      case 'ig':
        console.log( 'image' );
        $( '#cb-current' ).val( `${cur}` );

        $( `${cur}` ).remove();
        $( '#cb-current' ).val('');        
        
        $( '#cb-toolbar-media' ).hide();
        break;
      case 'vi':
        $( '#cb-current' ).val('vid');
        
        $( '#fb-template iframe' ).remove();
        $( '#cb-toolbar-video' ).hide();
        break;
      case 'pd':
        $( '#cb-current' ).val('pdf');
        
        $( '#fb-template' ).empty();
        $( '#cb-toolbar-video' ).hide();
        break;
      case 'pp':
        console.log( 'ppt' );
        $( '#cb-current' ).val('ppt');
        break;
      case 'sc':
        console.log( scorm );
        $( '#cb-current' ).val('scorm');
        break;
    }

  },
  
  'input .js-font-size'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    
    let fsz = $(e.currentTarget).val();
    
    $( `${cur}` ).css( 'font-size',`${fsz}px` );
    
    $( '#fnt' ).val( fsz );
  },
  
  'input .js-opacity'( e, t ) {
    e.preventDefault();
    let cur = $( '#cb-current' ).val();
    
    let fsz = $(e.currentTarget).val();
    
    $( `${cur}` ).css( 'opacity', fsz );
    
    $( '#op' ).val( fsz );
  }
});