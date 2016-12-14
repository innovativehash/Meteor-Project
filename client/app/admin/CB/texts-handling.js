/*
 * @module testsHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

  let txt_id = -1;


  /**
   * RESET
   */
  export function cbTextReset() {
    txt_id = -1;
  }



  /*
   *
   * #ADDED-TEXT  ::(BLUR)::
   *
   */
  export function cbAddedTextBlur( e, t, tbo, contentTracker, textsTracker ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //if ( $(e.currentTarget)[0].id != 'added-text') return;

     if ( t.$( '#added-text' ).val() == undefined || t.$( '#added-text' ).val() == '' ) {
      t.$( '#added-text' ).remove();
      return;
    }

    let txt = t.$( 'textarea#added-text' ).val().trim();

    t.$( '#added-text' ).remove();

    contentTracker.texts++;
    ++txt_id;

    t.$( '#fb-template' ).append( `<span id="span_text-${txt_id}"
                                         style = "z-index:1;border-radius:5px;background-color:white;position:absolute;border:none !important;cursor:move;"
                                         class = "draggable ui-widget-content">
                                     <span style="font-size:16px;"
                                                  id="txt-${txt_id}">&nbsp;&nbsp;&nbsp;&nbsp;${txt}&nbsp;&nbsp;&nbsp;&nbsp;
                                     </span>
                                     <sup id="tmp-txt-${txt_id}"></sup>
                                  </span>`);

    t.$( `#tmp-txt-${txt_id}` ).hide();

    t.$( `#span-text-${txt_id}` ).offset({ left: pos.left, top: pos.top });
    
    t.$( `#span_text-${txt_id}` ).draggable();

    t.$( `#txt-${txt_id}` ).resizable();

    //--------------------------
    // TEXT OBJECT CLICK EVENT
    //--------------------------
  (function(txt_id) { // txt-${txt_id}
    e.preventDefault();

    //document.getElementById( `span_text-${txt_id}` ).onmouseup =  (e) => {
    $( `#span_text-${txt_id}` ).on("mouseup", function(){

    textsTracker.push( txt_id );
    console.log( textsTracker );
/*
        let p = $( `#txt-${txt_id}` ).position()

        tbo.texts[txt_id] = { page: t.page.get(),
                          id: txt_id,
                          text: txt,
                          position: $( `#txt-${txt_id}` ).css('position'),
                          zIndex: $( `#txt-${txt_id}` ).css('z-index'),
                          backgroundColor: $( `#txt-${txt_id}` ).css('background-color'),
                          fontSize: $( `#txt-${txt_id}` ).css('font-size'),
                          top: p.top,
                          left: p.left,
                          border: $( `#txt-${txt_id}` ).css('border'),
                          fontWeight: $( `#txt-${txt_id}` ).css('font-weight'),
                          fontStyle: $( `#txt-${txt_id}` ).css('font-style'),
                          textDecoration: $( `#txt-${txt_id}` ).css('text-decoration'),
                          opacity: $( `#txt-${txt_id}` ).css('opacity')
                        };
*/
      //---------------------------
      // TEXT OBJECT WIDGET BUTTONS
      //---------------------------
      if ( ! t.$( `#close-ta-${txt_id}` ).length ) {
        $( `#span_text-${txt_id}`).append( `<button type="button"
                                                    id="close-ta-${txt_id}"
                                                    class="btn btn-danger btn-xs">
                                              <span class="glyphicon glyphicon-trash"></span>
                                            </button>` );

        //CLOSE BUTTON EVENT
        t.$( `#close-ta-${txt_id}` ).on( "click", (e) => {
          e.preventDefault();

          //delete tbo.texts[txt_id];
          contentTracker.texts--;
          $( `#${e.currentTarget.parentNode.id}` ).remove();
        });
      }
      if ( ! t.$( `#gear-ta-${txt_id}` ).length ) {
        $( `#span_text-${txt_id}`).prepend( `<button type="button"
                                                     id="gear-ta-${txt_id}"
                                                     class="btn btn-primary btn-xs">
                                              <span class="glyphicon glyphicon-cog"></span>
                                            </button>` );

        //GEAR BUTTON EVENT
        t.$( `#gear-ta-${txt_id}` ).on( "click", (e) => {
          e.preventDefault();

          $( '#js-cb-text-dialog' ).val( `#txt-${txt_id}` );
          $( '#dialog' ).dialog( "open" );
        });
      }

      //BUTTONS TIMER
      Meteor.setTimeout(function(){
        if ( t.$( `#tmp-txt-${txt_id}` ).css( 'display' ) == 'inline' ) {
          t.$( `#tmp-txt-${txt_id}` ).hide();
        }
        t.$( `#close-ta-${txt_id}` ).off( "click" );
        t.$( `#close-ta-${txt_id}` ).remove();

        t.$( `#gear-ta-${txt_id}` ).off( "click" );
        t.$( `#gear-ta-${txt_id}` ).remove();
      }, 2000);

      //TEXT OBJECT RESIZE EVENT
      t.$( `#txt-${txt_id}` ).on( "resize", function( event, ui ) {
        let factor = 2 +  Math.round( ui.size.height / 2 ) * 2;
        t.$( `#tmp-txt-${txt_id}` ).show();

        t.$( `#tmp-txt-${txt_id}` ).text( " " + factor + "px" )
                                   .css( 'background-color', 'red' )
                                   .css( 'color', 'white' )
                                   .css( 'border-radius', '10px' );
        t.$( this ).css( 'font-size', factor );
      });

    });//mouseup
  })( txt_id );//anon func
//-----------------------------------------------------------------------------
}