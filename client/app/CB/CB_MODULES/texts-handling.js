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

let pos = t.$(`#txt-${master_num}`).css({top: `200px`, left: `200px` });

    t.$( '#fb-template' ).append( `<span  style="cursor:move;
                                                 z-index:0;
                                                 top:10
                                                 left:80
                                                 background-color:white;
                                                 position:absolute;"
                                          id="txt-${master_num}"
                                          data-pid="0"
                                          data-page="${page_no}"
                                          data-editing="false">
                                      ${txt}
                                  </span>`);
                                  
//t.$(`#txt-${master_num}`).parent().css({position: 'relative'});
    t.$( `#txt-${master_num}` ).offset({ left: pos.left, top: pos.top });
    t.$( `#txt-${master_num}` ).draggable({ containment: "#fb-template", scroll: false });

    P.append({
      page_no:        page_no,
      type:           'text',
      id:             `txt-${master_num}`,
      text:           txt,
      zIndex:         $( `#txt-${master_num}` ).css('z-index')          || 0,
      offset:         pos,
      fontSize:       $( `#txt-${master_num}` ).css('font-size')        || 16,
      border:         $( `#txt-${master_num}` ).css('border')           || '',
      fontWeight:     $( `#txt-${master_num}` ).css('font-weight')      || '',
      fontStyle:      $( `#txt-${master_num}` ).css('font-style')       || 'normal',
      textDecoration: $( `#txt-${master_num}` ).css('text-decoration')  || 'none',
      opacity:        $( `#txt-${master_num}` ).css('opacity')          || 1
    });
P.print();
    Meteor.setTimeout(function(){
      //console.log( my_id );
      $( `#txt-${master_num}` ).attr( 'data-pid', `${Session.get('my_id')}` );
      //console.log( $( `#txt-${txt_id}` ).data('pid'));
    }, 500);

  //--------------------------
  // TEXT OBJECT CLICK EVENT
  //--------------------------
  (function( master_num ) {

    //document.getElementById( `span_text-${txt_id}` ).onmouseup =  (e) => {

    t.$( `#txt-${master_num}` ).on("mouseup", function(){
      e.preventDefault();

      //SHOW RELATED EDITING TOOLBAR
      $( '.js-cb-text-edit' ).show();
      $( '.js-cb-text-delete' ).show();
      $( '#cb-text-toolbar' ).show();
      $( '#cb-editor-save-text' ).hide();
      $( '#cb-title-toolbar' ).hide();
      $( '#cb-media-toolbar' ).hide();

      //INSERT CURRENT ELEMENT IN HIDDEN INPUT
     t.$( '#cb-current' ).val( `txt-${master_num}` );

      let id  = `txt-${master_num}`
        , str = $( `#txt-${master_num}` ).html()
        , idx = P.indexOf( `txt-${master_num}` )
        , pos = t.$( `#txt-${master_num}` ).offset();

      
      //pos.left = Math.abs(pos.left);
      //pos.top = Math.abs(pos.top);



      P.removeAt( idx );

      P.insert( idx, {
      page_no:        page_no,
      id:             id,
      type:           'text',
      text:           str,
      offset:         pos,
      zIndex:         $( `#txt-${master_num}` ).css('z-index')        || 0,
      fontSize:       $( `#txt-${master_num}` ).css('font-size')      || 16,
      border:         $( `#txt-${master_num}` ).css('border')         || '',
      fontWeight:     $( `#txt-${master_num}` ).css('font-weight')    || '',
      fontStyle:      $( `#txt-${master_num}` ).css('font-style')     || 'normal',
      textDecoration: $( `#txt-${master_num}` ).css('text-decoration') || 'none',
      opacity:        $( `#txt-${master_num}` ).css('opacity')         || 1 
    });
P.print();
    });//mouseup
  })( master_num );//anon func
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