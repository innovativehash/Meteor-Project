/*
 * @module titleHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */


/**********************************************************
 * #ADDED-TITLE  ::(BLUR)::
 *********************************************************/
  export function cbAddedTitleBlur( e, 
                                    t, 
                                    page_no,
                                    master_num,
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


    let str   = t.$( '#added-title' ).val().trim()
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
    ct.page_no[page_no].titles++;
    Session.set('contentTracker', ct);

    
    t.$( '#fb-template' ).append( `<span id="tit-${master_num}" data-pid="0" data-page="${page_no}" style="font-size:18px;font-weight:bold;z-index:2;border-radius:5px;background-color:white;position:absolute;cursor:move;border:none !important;">${str}</span>`);

    t.$( `#tit-${master_num}` ).offset({ left: pos.left, top: pos.top });
    t.$( `#tit-${master_num}` ).draggable();

    P.update(
              { _id: my_id },
              { $push:
                { objects:
                  {
                    page_no:  page_no,
                    type:     'title',
                    id:       `tit-${master_num}`,
                    text:     str,
                    offset:   pos,
                    zIndex:           $( `#tit-${master_num}` ).css('z-index'),
                    fontSize:         $( `#tit-${master_num}` ).css('font-size'),
                    border:           $( `#tit-${master_num}` ).css('border'),
                    fontWeight:       $( `#tit-${master_num}` ).css('font-weight'),
                    fontStyle:        $( `#tit-${master_num}` ).css('font-style'),
                    textDecoration:   $( `#tit-${master_num}` ).css('text-decoration'),
                    opacity:          $( `#tit-${master_num}` ).css('opacity')
                  }
                }
              });
              
    Meteor.setTimeout(function(){
      
      $( `#tit-${master_num}` ).attr( 'data-pid', `${my_id}` );

    }, 500);
    
    //-------------------------------
    // TITLE OBJECT CLICK EVENT
    //-------------------------------
    (function( master_num, my_id ){

      $( `#tit-${master_num}` ).on( "mouseup", function(){
        e.preventDefault();
        
        //SHOW RELATED EDITING TOOLBAR
        //$( '.js-edit-button'  ).show();
        $( '#cb-title-toolbar' ).show();
        
        // MAKE THIS THE CURRENTLY SELECTED ITEM FOR TOOLBAR R/O HIDDEN FIELD
        t.$( '#cb-current' ).val( `tit-${master_num}` );
        
        let pos = $( `#tit-${master_num}` ).offset()
          , str = $( `#tit-${master_num}` ).val().trim()
          , id  = `tit-${master_num}`;

        P.update( { _id: my_id, "objects.id": id },
                  {$set:
                    { 
                      "objects.$.page_no":  page_no,
                      "objects.$.id":       id,
                      "objects.$.type":     'title',
                      "objects.$.text":     str,
                      "objects.$.offset":   pos,
                      "objects.$.zIndex":           $( `#tit-${master_num}` ).css('z-index'),
                      "objects.$.fontSize":         $( `#tit-${master_num}` ).css('font-size'),
                      "objects.$.border":           $( `#tit-${master_num}` ).css('border'),
                      "objects.$.fontWeight":       $( `#tit-${master_num}` ).css('font-weight'),
                      "objects.$.fontStyle":        $( `#tit-${master_num}` ).css('font-style'),
                      "objects.$.textDecoration":   $( `#tit-${master_num}` ).css('text-decoration'),
                      "objects.$.opacity":          $( `#tit-${master_num}` ).css('opacity')
                    }    
                });

      });//onmouseup

    })( master_num, my_id );//anon function
  //---------------------------------------------------------------------------
  };

