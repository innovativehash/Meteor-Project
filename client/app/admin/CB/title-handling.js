/*
 * @module titleHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

  let tit_id = -1;



  /**
   * RESET
   */
  export function cbTitleReset() {
    tit_id = -1;
  }




/**********************************************************
 * #ADDED-TITLE  ::(BLUR)::
 *********************************************************/
  export function cbAddedTitleBlur( e, 
                                    t, 
                                    page_no,
                                    P
                                  ) {
    e.preventDefault();

    if ( t.$( '#added-title' ).val() == undefined || t.$( '#added-title' ).val() == '' ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
      return;
    }


    let tit   = t.$( '#added-title' ).val().trim()
      , pos   = t.$( '#added-title' ).offset()
      , my_id = Session.get('my_id');

    if ( t.$( '#added-title' ).length ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
    }

    // CONTENT FLAG
    let ct = Session.get('contentTracker');
    ct.titles++;
    Session.set('contentTracker', ct);
    
    //UNIQUE ID 
    ++tit_id;

    
    t.$( '#fb-template' ).append( `<span id="tit-${tit_id}" data-pid="0" data-page="${page_no}" style="font-size:18px;font-weight:bold;z-index:2;border-radius:5px;background-color:white;position:absolute;cursor:move;border:none !important;">${tit}</span>`);

    t.$( `#tit-${tit_id}` ).offset({ left: pos.left, top: pos.top });
    t.$( `#tit-${tit_id}` ).draggable();
      
    P.update(
              { _id: my_id },
              { $push:
                { objects:
                  {
                    page_no:  page_no, /* t.page.get(),*/
                    type:     'title',
                    id:       `tit-${tit_id}`,
                    text:     tit,
                    offset:   pos,
                    zIndex:           $( `#tit-${tit_id}` ).css('z-index'),
                    fontSize:         $( `#tit-${tit_id}` ).css('font-size'),
                    border:           $( `#tit-${tit_id}` ).css('border'),
                    fontWeight:       $( `#tit-${tit_id}` ).css('font-weight'),
                    fontStyle:        $( `#tit-${tit_id}` ).css('font-style'),
                    textDecoration:   $( `#tit-${tit_id}` ).css('text-decoration'),
                    opacity:          $( `#tit-${tit_id}` ).css('opacity')
                  }
                }
              });
              
    Meteor.setTimeout(function(){
      
      $( `#tit-${tit_id}` ).attr( 'data-pid', `${my_id}` );

    }, 500);
    
    //-------------------------------
    // TITLE OBJECT CLICK EVENT
    //-------------------------------
    (function( tit_id, my_id ){

      $( `#tit-${tit_id}` ).on( "mouseup", function(){
        e.preventDefault();
        
        //let tb = Session.get( 'tbo' );
        
        //SHOW RELATED EDITING TOOLBAR
        $( '.js-edit-button'  ).show();
        $( '#cb-toolbar-text' ).show();
        
        // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR R/O HIDDEN FIELD
        t.$( '#cb-current' ).val( `#tit-${tit_id}` );
        
        //tb.titles[tit_id] = `#tit-${tit_id}`;
        
        let pos = $( `#tit-${tit_id}` ).offset();
        
        //Session.set( 'tbo', tb );

        P.update( { _id: my_id, "objects.page_no": page_no },
                  {$set:
                    { 
                      "objects.$.text":     tit,
                      "objects.$.offset":   pos,
                      "objects.$.zIndex":           $( `#tit-${tit_id}` ).css('z-index'),
                      "objects.$.fontSize":         $( `#tit-${tit_id}` ).css('font-size'),
                      "objects.$.border":           $( `#tit-${tit_id}` ).css('border'),
                      "objects.$.fontWeight":       $( `#tit-${tit_id}` ).css('font-weight'),
                      "objects.$.fontStyle":        $( `#tit-${tit_id}` ).css('font-style'),
                      "objects.$.textDecoration":   $( `#tit-${tit_id}` ).css('text-decoration'),
                      "objects.$.opacity":          $( `#tit-${tit_id}` ).css('opacity')
                    }    
                });

      });//onmouseup

    })( tit_id, my_id );//anon function
  //---------------------------------------------------------------------------
  };

