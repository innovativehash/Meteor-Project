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




 /**
   *
   * #ADDED-TITLE  ::(BLUR)::
   *
   */
  export function cbAddedTitleBlur( e, t, tbo, contentTracker, titlesTracker ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( t.$( '#added-title' ).val() == undefined || t.$( '#added-title' ).val() == '' ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
      return;
    }


    let tit = t.$( '#added-title' ).val();
    let pos = t.$( '#added-title' ).offset();

    if ( t.$( '#added-title' ).length ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
    }

    // CONTENT FLAG
    contentTracker.titles++;
    
    //UNIQUE ID 
    ++tit_id;

    
    t.$( '#fb-template' ).append( `<span id="tit-${tit_id}" style="font-size:18px;font-weight:bold;z-index:2;border-radius:5px;background-color:white;position:absolute;cursor:move;border:none !important;">${tit}</span>`);

      t.$( `#tit-${tit_id}` ).offset({ left: pos.left, top: pos.top });
      t.$( `#tit-${tit_id}` ).draggable();
      
      //t.$( `#tit-${tit_id}` ).resizable();


    //-------------------------------
    // TITLE OBJECT CLICK EVENT
    //-------------------------------
    (function(tit_id){

      $( `#tit-${tit_id}` ).on( "mouseup", function(){
        e.preventDefault();
        
        $( '#cb-toolbar-text' ).show();
        
        // MAKE THIS THE CURRENTLY SELECTED ITEM
        t.$( '#cb-current' ).val( `#tit-${tit_id}` );
        
        //titlesTracker.push( tit_id );
/*
        let p = $( `#tit-${tit_id}` ).position();

        tbo.titles[tit_id] = { page: t.page.get(),
                          id: tit_id,
                          text: tit,
                          position: $( `#tit-${tit_id}` ).css('position'),
                          zIndex: $(`#tit-${tit_id}`).css('z-index'),
                          backgroundColor: $(`#tit-${tit_id}`).css('background-color'),
                          fontSize: $( `#tit-${tit_id}` ).css('font-size'),
                          top: p.top,
                          left: p.left,
                          border: $(`#tit-${tit_id}`).css('border'),
                          fontWeight: $( `#tit-${tit_id}` ).css('font-weight'),
                          fontStyle: $( `#tit-${tit_id}` ).css('font-style'),
                          textDecoration: $( `#tit-${tit_id}` ).css('text-decoration'),
                          opacity: $( `#tit-${tit_id}` ).css('opacity')
                        };
*/


      });//onmouseup

    })( tit_id );//anon function
  //---------------------------------------------------------------------------
  };

