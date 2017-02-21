/*
 * @module videoHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

  let vid_id = -1;


  /**
   * RESET
   */
  export function cbVideoReset() {
    vid_id = -1;
  }



 /**
   *
   * #ADDED-VIDEO  ::(CHANGE)::
   *
   */
  export function addedVideoURL( e, t, contentTracker ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.id == 'intro-modal' ) return;
////////////////////////////
//    VIDEO MUST BE ON IT'S OWN page
////////////////////////////

    let vid   = t.$( '#added-video' ).val()
      , m     = /(v=)(.*)(#)?/g
      , match = m.exec(vid)
      , url
      , patt
      , conv
      tb = Session.get( 'tbo' );

    conv = match[2];
    
    //is there an &list in the video id?
    patt = new RegExp("[?&]list");
    
    //if so, change it to ?list
    if( patt.test( conv ) ) conv = conv.replace("&list", "?list");
    
    url = `<iframe width="854" height="480" src="https://www.youtube.com/embed/${conv}" frameborder="0" allowfullscreen></iframe>`;

    t.$( '#added-video' ).remove();

    contentTracker.videos++;
    Session.set('contentTracker', contentTracker);
    
    ++vid_id;

    //tbo.videos.push( {page: Template.instance().page.get(), id: ++vid_id, url: vid} );
    tb.videos[vid_id] = url;
    Session.set( 'tbo', tb );
    
    Bert.alert('Loading video...', 'success' );
    
    //add to the canvas
    t.$( '#fb-template' ).html( url );
    
/*    
    t.$( '#fb-template iframe' ).on( "click", (e) => {
        $( '#cb-toolbar-video' ).show();
        $( '#cb-current' ).val( '#vid' );
    });
*/

    $( '#cb-toolbar-video' ).show();
    t.$( '#cb-current' ).val( `#vid` );
    
/*
    if ( ! t.$( `#close-vid-${vid_id}` ).length ) {
        $( '#fb-template' ).append( `<button  type="button"
                                              id="close-vid-${vid_id}"
                                              class="btn btn-danger btn-xs">
                                        <span class="glyphicon glyphicon-trash"></span>
                                      </button>` );

        //CLOSE BUTTON EVENT
        t.$( `#close-vid-${vid_id}` ).on( "click", (e) => {
          e.preventDefault();

          tbo.videos.splice( vid_id, 1 );
          //console.log( tbo.videos );
          //tbo.videos[vid_id] = null;

          contentTracker.videos--;
          $( '#fb-template iframe' ).remove();
          $( `#close-vid-${vid_id}` ).remove();
        });
    }
*/

//    BuiltCourses.update({ _id: built_id },
//                        { $addToSet:
//                          { pages:
//                            {
//                              page: Template.instance().page.get(),
//                              video: vid
//                            }
//                          }
//                        });
//-----------------------------------------------------------------------------
}
