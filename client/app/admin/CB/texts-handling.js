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

    let txt = t.$( 'textarea#added-text' ).val().trim()
      , pos = t.$( `#added-text` ).offset();
    
    t.$( '#added-text' ).remove();

    contentTracker.texts++;
    ++txt_id;

/*
<span id="span_text-${txt_id}"
                                         style = "z-index:1;border-radius:5px;background-color:white;position:absolute;border:none !important;cursor:move;"
                                         class = "draggable ui-widget-content">
*/
    t.$( '#fb-template' ).append( `<span  style="font-size:18px;cursor:move;z-index:1;border-radius:5px;background-color:white;position:absolute;border:none !important;"
                                          id="txt-${txt_id}">${txt}</span>`);

    t.$( `#txt-${txt_id}` ).offset({ left: pos.left, top: pos.top });
    t.$( `#txt-${txt_id}` ).draggable();
    
    tbo.texts[txt_id] = `#txt-${txt_id}`;
    
    //t.$( `#txt-${txt_id}` ).resizable();

    //--------------------------
    // TEXT OBJECT CLICK EVENT
    //--------------------------
  (function(txt_id) {
    e.preventDefault();

    //document.getElementById( `span_text-${txt_id}` ).onmouseup =  (e) => {
    $( `#txt-${txt_id}` ).on("mouseup", function(){
      e.preventDefault();
      
      textsTracker.push( txt_id );
      
      $( '#cb-toolbar-text' ).show();
      
      t.$( '#cb-current' ).val( `#txt-${txt_id}` );

      
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
    });//mouseup
  })( txt_id );//anon func
//-----------------------------------------------------------------------------
};
