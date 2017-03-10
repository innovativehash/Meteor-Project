/*
 * @module testsHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

  let txt_id = -1;


  /********************************************************
   * RESET
   *******************************************************/
  export function cbTextReset() {
    txt_id = -1;
  }



  /********************************************************
   * #ADDED-TEXT  ::(BLUR)::
   *******************************************************/
  export function cbAddedTextBlur(  e, 
                                    t, 
                                    page_no,
                                    P
                                  ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //if ( $(e.currentTarget)[0].id != 'added-text') return;

     if ( t.$( '#added-text' ).val() == undefined || t.$( '#added-text' ).val() == '' ) {
      t.$( '#added-text' ).remove();
      return;
    }

    let txt   = t.$( 'textarea#added-text' ).val().trim()
      , pos   = t.$( `#added-text` ).offset()
      , my_id = Session.get('my_id');
    
    if ( t.$( '#added-text' ).length ) {
      try {
        t.$( '#added-text' ).remove();
      } catch( DOMException ) {
        ;
      }
    }

    let ct = Session.get('contentTracker');
    ct.texts++;
    Session.set( 'contentTracker', ct );
    ++txt_id;

    t.$( '#fb-template' ).append( `<span  style="font-size:18px;cursor:move;z-index:1;border-radius:5px;background-color:white;position:absolute;border:none !important;"
                                          id="txt-${txt_id}"
                                          data-pid="0"
                                          data-page="${page_no}">${txt}</span>`);

    t.$( `#txt-${txt_id}` ).offset({ left: pos.left, top: pos.top });
    t.$( `#txt-${txt_id}` ).draggable();

    P.update( { _id: my_id },
              {$push:
                { objects: {
                    page_no: page_no,
                    type: 'text',
                    id:   `txt-${txt_id}`,
                    text: txt,
                    position:         $( `#txt-${txt_id}` ).css('position'),
                    zIndex:           $( `#txt-${txt_id}` ).css('z-index'),
                    backgroundColor:  $( `#txt-${txt_id}` ).css('background-color'),
                    fontSize:         $( `#txt-${txt_id}` ).css('font-size'),
                    border:           $( `#txt-${txt_id}` ).css('border'),
                    fontWeight:       $( `#txt-${txt_id}` ).css('font-weight'),
                    fontStyle:        $( `#txt-${txt_id}` ).css('font-style'),
                    textDecoration:   $( `#txt-${txt_id}` ).css('text-decoration'),
                    opacity:          $( `#txt-${txt_id}` ).css('opacity')
                }
              }
            });
                        
    Meteor.setTimeout(function(){
      //console.log( my_id );
      $( `#txt-${txt_id}` ).attr( 'data-pid', `${my_id}` );
      //console.log( $( `#txt-${txt_id}` ).data('pid'));
    }, 500);
  //--------------------------
  // TEXT OBJECT CLICK EVENT
  //--------------------------
  (function( txt_id, my_id ) {
    e.preventDefault();

    //document.getElementById( `span_text-${txt_id}` ).onmouseup =  (e) => {
    
    $( `#txt-${txt_id}` ).on("mouseup", function(){
      e.preventDefault();
      
      //let tb = Session.get( 'tbo' );
      
      //SHOW RELATED EDITING TOOLBAR
      $( '.js-edit-button' ).show();
      $( '#cb-toolbar-text' ).show();
      
      //INSERT CURRENT ELEMENT IN HIDDEN INPUT
      t.$( '#cb-current' ).val( `#txt-${txt_id}` );

      //tb.texts[txt_id] = `#txt-${txt_id}`;

      let pos = $( `#txt-${txt_id}` ).offset();
        
      //Session.set( 'tbo', tb );
      
      P.update( { _id: my_id, "objects.page_no": page_no },
                { $set: {
                          "objects.$.id":       `txt-${txt_id}`,
                          "objects.$.text":     txt,
                          "objects.$.position":         $( `#txt-${txt_id}` ).css('position'),
                          "objects.$.zIndex":           $( `#txt-${txt_id}` ).css('z-index'),
                          "objects.$.backgroundColor":  $( `#txt-${txt_id}` ).css('background-color'),
                          "objects.$.fontSize":         $( `#txt-${txt_id}` ).css('font-size'),
                          "objects.$.border":           $( `#txt-${txt_id}` ).css('border'),
                          "objects.$.fontWeight":       $( `#txt-${txt_id}` ).css('font-weight'),
                          "objects.$.fontStyle":        $( `#txt-${txt_id}` ).css('font-style'),
                          "objects.$.textDecoration":   $( `#txt-${txt_id}` ).css('text-decoration'),
                          "objects.$.opacity":          $( `#txt-${txt_id}` ).css('opacity')
                        }
              });
    });//mouseup
  })( txt_id, my_id );//anon func
//---------------------------------------------------------
};
