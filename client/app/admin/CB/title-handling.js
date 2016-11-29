

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

    if ( t.$( '#added-title' ).length ) {
      try {
        $( '#added-title' ).remove();
      } catch( DOMException ) {
        ;
      }
    }

    //t.$('.draggable').draggable();

    contentTracker.titles++;

    ++tit_id;

    t.$( '#fb-template' ).append( `<div id="div_title-${tit_id}" style = "z-index:2;border-radius:5px;background-color:white;font-size:18px;position:absolute;top:200px;left:300px;cursor:move;border:none !important;">
    <span id="tit-${tit_id}" style="font-size:18px;font-weight:800;">&nbsp;&nbsp;&nbsp;&nbsp;${tit}&nbsp;&nbsp;&nbsp;&nbsp;</span><sup id="tmp-title-${tit_id}"></sup></span></div>`);

      t.$( `#tmp-title-${tit_id}` ).hide();

      t.$( `#div_title-${tit_id}` ).draggable();

      t.$( `#tit-${tit_id}` ).resizable();


      //-------------------------------
      // TITLE OBJECT CLICK EVENT
      //-------------------------------
      //`#tit${titles[tit_id].id}`
    (function(tit_id){

      //document.getElementById( `div_title-${tit_id}` ).onmouseup = (e) => {
      $( `#div_title-${tit_id}` ).on( "mouseup", function(){
        e.preventDefault();

        titlesTracker.push( tit_id );
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
      //------------------------------
      // TITLE  COBJECT WIDGET BUTTONS
      //------------------------------
      if ( ! t.$( `#close-title-${tit_id}` ).length ) {
        $( `#div_title-${tit_id}` ).append( `<button type="button"
                                                     id="close-title-${tit_id}"
                                                     class="btn btn-danger btn-xs">
                                              <span class="glyphicon glyphicon-trash"></span>
                                            </button>` );

        //CLOSE BUTTON EVENT
        t.$( `#close-title-${tit_id}` ).on( "click", (e) => {
          e.preventDefault();

          //delete tbo.titles[tit_id];
          titlesTracker.splice( tit_id, 1 );

          contentTracker.titles--;
          console.log( contentTracker.titles );
          $( `#${ e.currentTarget.parentNode.id}` ).remove();
        });
      }

      if ( ! t.$( `#gear-title-${tit_id}` ).length ) {
        $( `#div_title-${tit_id}` ).prepend( `<button type="button"
                                                      id="gear-title-${tit_id}"
                                                      class="btn btn-danger btn-xs">
                                                <span class="glyphicon glyphicon-cog"></span>
                                              </button>` );

        //GEAR BUTTON EVENT
        t.$( `#gear-title-${tit_id}` ).on( "click", (e) => {
            e.preventDefault();
            $( '#js-cb-text-dialog' ).val( `#tit-${tit_id}` );
            $( '#dialog' ).dialog( "open" );
          });
        }

        // BUTTONS TIMER
        Meteor.setTimeout(function(){
          if ( t.$( `#tmp-title-${tit_id}` ).css( 'display' ) == 'inline' ) {
            t.$( `#tmp-title-${tit_id}` ).hide();
          }
          t.$( `#close-title-${tit_id}` ).off( "click" );
          t.$( `#close-title-${tit_id}` ).remove();

          t.$( `#gear-title-${tit_id}` ).off( "click" );
          t.$( `#gear-title-${tit_id}` ).remove();

        }, 2000);

        // TITLE OBJECT RESIZE EVENT
        t.$( `#tit-${tit_id}` ).on( "resize", function( event, ui ) {
          let factor = 2 +  Math.round( ui.size.height / 2 ) * 2;
          t.$( `#tmp-title-${tit_id}` ).show();

          t.$( `#tmp-title-${tit_id}` ).text( " " + factor + "px" )
                                       .css( 'background-color', 'red' )
                                       .css( 'color', 'white' )
                                       .css('border-radius', '10px');

          $( this ).css( 'font-size', factor );
        });
//console.log( tbo.titles[tit_id] );
      });//onmouseup

    })( tit_id );//anon function
  //---------------------------------------------------------------------------
  }


