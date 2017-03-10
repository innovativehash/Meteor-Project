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
  export function addedVideoURL( e, t, page_no, P ) {
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
      //, tb    = Session.get( 'tbo' )
      , my_id = Session.get('my_id');

    conv = match[2];
    
    //is there an &list in the video id?
    patt = new RegExp("[?&]list");
    
    //if so, change it to ?list
    if( patt.test( conv ) ) conv = conv.replace("&list", "?list");
    
    url = `<iframe width="854" height="480" src="https://www.youtube.com/embed/${conv}" frameborder="0" allowfullscreen></iframe>`;

    t.$( '#added-video' ).remove();

    contentTracker.videos++;
    Session.set('contentTracker', contentTracker);
    
    //++vid_id;


    //tbo.videos.push( {page: Template.instance().page.get(), id: ++vid_id, url: vid} );
    
    //tb.videos[vid_id] = url;
    //Session.set( 'tbo', tb );
    
    Bert.alert('Loading video...', 'success' );
    
    //add to the canvas
    t.$( '#fb-template' ).html( url );
    
    P.update( { _id: my_id },
              {   
                type:     'video',
                page_no:  page_no,
                url:      url
              });

    $( '#cb-toolbar-video' ).show();
    t.$( '#cb-current' ).val( `#vid` );
    


//-----------------------------------------------------------------------------
}
