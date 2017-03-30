/*
 * @module textsHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */



  /********************************************************
   * RESET
   *******************************************************/
  export function cbTextReset() {

  }



  /********************************************************
   * #ADDED-TEXT  ::(BLUR)::
   *******************************************************/
  export function cbAddedTextBlur(  e,
                                    t,
                                    txt,
                                    page_no,
                                    master_num,
                                    P
                                  )
  {
    e.preventDefault();

    let pos   = {left:'600px', top:'400px'}; //= t.$( `#added-text` ).offset()

    t.$( '#fb-template' ).append( `<span  style="font-size:18px;cursor:move;
                                                 z-index:1;border-radius:5px;
                                                 background-color:white;
                                                 position:absolute;
                                                 border:none !important;"
                                          id="txt-${master_num}"
                                          data-pid="0"
                                          data-page="${page_no}"
                                          data-editing="false">
                                      ${escapeHtml(txt)}
                                  </span>`);

    t.$( `#txt-${master_num}` ).offset({ left: pos.left, top: pos.top });
    t.$( `#txt-${master_num}` ).draggable({ containment: "#fb-template", scroll: false });

    P.append({
      page_no:        page_no,
      type:           'text',
      id:             `txt-${master_num}`,
      text:           escapeHtml(txt),
      offset:         pos,
      zIndex:         $( `#txt-${master_num}` ).css('z-index'),
      fontSize:       $( `#txt-${master_num}` ).css('font-size'),
      border:         $( `#txt-${master_num}` ).css('border'),
      fontWeidht:     $( `#txt-${master_num}` ).css('font-weight'),
      fontStyle:      $( `#txt-${master_num}` ).css('font-style'),
      textDecoration: $( `#txt-${master_num}` ).css('text-decoration'),
      opacity:        $( `#txt-${master_num}` ).css('opacity')
    });
P.print();
/*
    P.update( { _id: my_id },
              {$push:
                { objects: {
            page_no:  page_no,
            type:     'text',
            id:       `txt-${master_num}`,
            text:     txt,
            offset:   pos,
            zIndex:           $( `#txt-${master_num}` ).css('z-index'),
            fontSize:         $( `#txt-${master_num}` ).css('font-size'),
            border:           $( `#txt-${master_num}` ).css('border'),
            fontWeight:       $( `#txt-${master_num}` ).css('font-weight'),
            fontStyle:        $( `#txt-${master_num}` ).css('font-style'),
            textDecoration:   $( `#txt-${master_num}` ).css('text-decoration'),
            opacity:          $( `#txt-${master_num}` ).css('opacity')
                }
              }
            });
*/
    Meteor.setTimeout(function(){
      //console.log( my_id );
      $( `#txt-${master_num}` ).attr( 'data-pid', `${Session.get('my_id')}` );
      //console.log( $( `#txt-${txt_id}` ).data('pid'));
    }, 500);

  //--------------------------
  // TEXT OBJECT CLICK EVENT
  //--------------------------
  (function( master_num, txt ) {

    //document.getElementById( `span_text-${txt_id}` ).onmouseup =  (e) => {

    $( `#txt-${master_num}` ).on("mouseup", function(){
      e.preventDefault();
      //INSERT CURRENT ELEMENT IN HIDDEN INPUT
      t.$( '#cb-current' ).val( `txt-${master_num}` );

      let pos = $( `#txt-${master_num}` ).offset()
        , id  = `txt-${master_num}`
        , str = $( `#txt-${master_num}` ).text().trim()
        , idx = P.indexOf( `txt-${master_num}` );

      //SHOW RELATED EDITING TOOLBAR
      $( '.js-cb-text-edit' ).show();
      $( '.js-cb-text-delete' ).show();
      $( '#cb-editor-save-text' ).hide();
      $( '#cb-text-toolbar' ).show();
      $( '#cb-title-toolbar' ).hide();
      $( '#cb-media-toolbar' ).hide();

      P.removeAt( idx );
      P.insert( idx, {
      page_no:        page_no,
      type:           'text',
      id:             id,
      text:           escapeHtml(str),
      offset:         pos,
      zIndex:         $( `#txt-${master_num}` ).css('z-index'),
      fontSize:       $( `#txt-${master_num}` ).css('font-size'),
      border:         $( `#txt-${master_num}` ).css('border'),
      fontWeidht:     $( `#txt-${master_num}` ).css('font-weight'),
      fontStyle:      $( `#txt-${master_num}` ).css('font-style'),
      textDecoration: $( `#txt-${master_num}` ).css('text-decoration'),
      opacity:        $( `#txt-${master_num}` ).css('opacity')
    });
P.print();
/*
      P.update( { _id: my_id, "objects.id": id },
                { $set: {
"objects.$.page_no":  page_no,
"objects.$.id":       id,
"objects.$.type":     'text',
"objects.$.text":     txt,
"objects.$.offset":   pos,
"objects.$.zIndex":           $( `#txt-${master_num}` ).css('z-index'),
"objects.$.fontSize":         $( `#txt-${master_num}` ).css('font-size'),
"objects.$.border":           $( `#txt-${master_num}` ).css('border'),
"objects.$.fontWeight":       $( `#txt-${master_num}` ).css('font-weight'),
"objects.$.fontStyle":        $( `#txt-${master_num}` ).css('font-style'),
"objects.$.textDecoration":   $( `#txt-${master_num}` ).css('text-decoration'),
"objects.$.opacity":          $( `#txt-${master_num}` ).css('opacity')
                        }
              });
*/
    });//mouseup
  })( master_num, txt );//anon func
//---------------------------------------------------------
};


function escapeHtml(str) {
    return str
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
