/*
 * @module Render
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import * as CBCreateDOM from './createDOM.js';



export function render( e, t, arr, P ) {
    for( let z = 0, zlen = arr.length; z < zlen; z++ ) {
      if ( arr[z].type == 'test') {
        $('#fb-template').hide();
        $('#test_v').show();
        Session.set('Scratch', arr[z].id );
      }  else {
        $('#test_v').hide();
        $('#fb-template').show();
      }
    }

    let rtn_arr = handlePrevious(arr);
    let funcs   = rtn_arr[1];

    //ATTACH ELEMENTS RETURNED FROM CLASS TO DOM
    $('#fb-template').append( rtn_arr[0] );

    //ACTIVATE POSITIONING JQUERY FUNCTIONS RETURNED FROM CLASS
    for ( let i = 0, ilen = funcs.length; i < ilen; i++ ) {
      eval( funcs[i] );
    }

      /***********************************************************
       * ATTACH MOUSE EVENTS TO NEWLY PLACED TITLE & TEXT ELEMENTS
       **********************************************************/
      for( let i = 0, ilen = arr.length; i < ilen; i++ ) {
  //TITLES
        if (  arr[i].type == 'title' ) {

            eval(
                  $( `#${arr[i].id}` ).on( "mouseup", function(){
                    e.preventDefault();

                    //SHOW RELATED EDITING TOOLBAR
                    $( '.js-title-edit-button' ).show();
                    $( '#cb-title-toolbar' ).show();
                    $( '#cb-text-toolbar' ).hide();
                    $( '#cb-media-toolbar' ).hide();
                    $( '#cb-video-toolbar' ).hide()

                    // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR
                    //R/O HIDDEN FIELD
                    t.$( '#cb-current' ).val( `${arr[i].id}` );

                  })
              );
            eval(
                  $( `#${arr[i].id}` ).on( "dragstop", function( event, ui ) {
                    let idx = P.indexOf( `${arr[i].id}` );
                    P.removeAt( idx );

                    P.insert( idx, {
                                  page_no:  t.page.get(),
                                  id:       `${arr[i].id}`,
                                  type:     'title',
                                  text:     $( `#${arr[i].id}` ).text().trim(),
                                  offset:   $( `#${arr[i].id}` ).offset(),
                                  zIndex:           $( `#${arr[i].id}` ).css('z-index'),
                                  fontSize:         $( `#${arr[i].id}` ).css('font-size'),
                                  border:           $( `#${arr[i].id}` ).css('border'),
                                  fontWeight:       $( `#${arr[i].id}` ).css('font-weight'),
                                  fontStyle:        $( `#${arr[i].id}` ).css('font-style'),
                                  textDecoration:   $( `#${arr[i].id}` ).css('text-decoration'),
                                  opacity:          $( `#${arr[i].id}` ).css('opacity')
                              });
                  })
              );
        } else
  //TEXT
            if ( arr[i].type == 'text' ) {
             //for ( let j = 0, jlen = o.length; j < jlen; j++ ) {

                eval(
                      $( `#${arr[i].id}` ).on( "mouseup", function(){
                        e.preventDefault();

                        //SHOW RELATED EDITING TOOLBAR
                        $( '.js-cb-text-edit' ).show();
                        $( '.js-cb-text-delete' ).show();
                        $( '#cb-text-toolbar' ).show();
                        $( '#cb-editor-save-text' ).hide();
                        $( '#cb-title-toolbar' ).hide();
                        $( '#cb-media-toolbar' ).hide();
                        
                        // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR
                        //R/O HIDDEN FIELD
                        t.$( '#cb-current' ).val( `${arr[i].id}` );

                      })
                  );
                eval(
                      $( `#${arr[i].id}` ).on( "dragstop", function( event, ui ) {
                        let idx = P.indexOf( `${arr[i].id}` );

                        P.removeAt( idx );
                        P.insert( idx, {
                                      page_no:  t.page.get(),
                                      id:       `${arr[i].id}`,
                                      type:     'text',
                                      text:     $( `#${arr[i].id}` ).text().trim(),
                                      offset:   $( `#${arr[i].id}` ).offset(),
                                      zIndex:           $( `#${arr[i].id}` ).css('z-index'),
                                      fontSize:         $( `#${arr[i].id}` ).css('font-size'),
                                      border:           $( `#${arr[i].id}` ).css('border'),
                                      fontWeight:       $( `#${arr[i].id}` ).css('font-weight'),
                                      fontStyle:        $( `#${arr[i].id}` ).css('font-style'),
                                      textDecoration:   $( `#${arr[i].id}` ).css('text-decoration'),
                                      opacity:          $( `#${arr[i].id}` ).css('opacity')
                                  });
                      })
                  );
        } else
  //IMAGES
            if ( arr[i].type == 'image' ) {

                  if ( arr[i].dwidth == null ) {
                    continue;
                  }
                  eval(
                        $( `#${arr[i].id}` ).on( "mouseup", function(){
                          e.preventDefault();

                          //SHOW RELATED EDITING TOOLBAR
                          $( '#cb-text-toolbar'  ).hide();
                          $( '#cb-title-toolbar' ).hide();
                          $( '#cb-video-toolbar' ).hide();
                          $( '#cb-media-toolbar' ).show();

                          // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR
                          //R/O HIDDEN FIELD
                          t.$( '#cb-current' ).val( `${arr[i].id}` );

                        })
                    );
                  eval(
                        $( `#${arr[i].id}` ).on( "dragstop", function( event, ui ) {
                          let idx = P.indexOf( `${arr[i].id}` );
                          P.removeAt( idx );
                          P.insert( idx, {
                                        page_no:  t.page.get(),
                                        id:       `${arr[i].id}`,
                                        type:     'image',
                                        iid:      `${arr[i].iid}`,
                                        offset:   $( `#${arr[i].id}` ).offset(),
                                        zIndex:   $( `#${arr[i].id}` ).css('z-index'),
                                        iwidth:   $( `#${arr[i].iid}` ).width(),
                                        iheight:  $( `#${arr[i].iid}` ).height(),
                                        dwidth:   $( `#${arr[i].id}` ).width(),
                                        dheight:  $( `#${arr[i].id}` ).height(),
                                        src:      `${arr[i].src}`,
                                        opacity:  $( `#${arr[i].id}` ).css('opacity')
                                    });
                        })
                    );
        }//else if
      }//outer for
}

/**********************************************************
 * HANDLE PREVIOUS
 *********************************************************/
 function handlePrevious( o ) {


    let funcs   = ''                  //FUNCS FROM CLASS TO POSITION ELEMENTS
      , content = ''                  //RENDERED MARKUP (AND FUNCS) RETURNED
      , cd                            //RENDERING CLASS INSTANCE
      , mark_up = '';                 //RENDERED MARKUP RETURN VARIABLE


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
