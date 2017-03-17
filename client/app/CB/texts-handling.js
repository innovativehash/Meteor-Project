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
console.log('entering text handling');
    let pos   = {left:'200px', top:'200px'} //= t.$( `#added-text` ).offset()
      , my_id = Session.get('my_id');

    let ct = Session.get('contentTracker');
    ct.page_no[page_no].texts++;
    Session.set( 'contentTracker', ct );
  

    t.$( '#fb-template' ).append( `<span  style="font-size:18px;cursor:move;
                                                 z-index:1;border-radius:5px;
                                                 background-color:white;
                                                 position:absolute;
                                                 border:none !important;"
                                          id="txt-${master_num}"
                                          data-pid="0"
                                          data-page="${page_no}">
                                      ${txt}
                                  </span>`);

    t.$( `#txt-${master_num}` ).offset({ left: pos.left, top: pos.top });
    t.$( `#txt-${master_num}` ).draggable();

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
                        
    Meteor.setTimeout(function(){
      //console.log( my_id );
      $( `#txt-${master_num}` ).attr( 'data-pid', `${my_id}` );
      //console.log( $( `#txt-${txt_id}` ).data('pid'));
    }, 500);
  //--------------------------
  // TEXT OBJECT CLICK EVENT
  //--------------------------
  (function( master_num, my_id ) {
console.log( 'in text click' );
    //document.getElementById( `span_text-${txt_id}` ).onmouseup =  (e) => {
    
    $( `#txt-${master_num}` ).on("mouseup", function(){
      e.preventDefault();
      
      //SHOW RELATED EDITING TOOLBAR
      $('#cb-text-toolbar').show();
      
      //INSERT CURRENT ELEMENT IN HIDDEN INPUT
      t.$( '#cb-current' ).val( `txt-${master_num}` );

      let pos = $( `#txt-${master_num}` ).offset()
        , id  = `txt-${master_num}`;
      
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
    });//mouseup
  })( master_num, my_id );//anon func
//---------------------------------------------------------
};
