/*
 * @module videoHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */



  /**
   * RESET
   */
  export function cbVideoReset() {

  }



 /**
   *
   * #ADDED-VIDEO  ::(CHANGE)::
   *
   */
  export function addedVideoURL( e, t, page_no, P, master_num ) {
    e.preventDefault();

    if ( e.currentTarget.id == 'intro-modal' ) return;
////////////////////////////
//    VIDEO MUST BE ON IT'S OWN page FOR NOW
////////////////////////////
// ([a-z][A-Z])\w+ ["oTugjssqOtO", "oT"] 'https://www.youtube.com/embed/oTugjssqOT0'
    let vid   = t.$( '#added-video' ).val()
      , m     = /(v=)(.*)(#)?/g
      , match = m.exec(vid)
      , url
      , patt
      , conv
      //, tb    = Session.get( 'tbo' )
      , my_id = Session.get('my_id');
    
    if ( match == null ) {
      m = /([a-z][A-Z])\w+/;
      match = m.exec(vid);
      conv = match[0];
    } else {
      conv = match[2];
    }
    
    //IS THERE AN &LIST IN THE VIDEO ID?
    patt = new RegExp("[?&]list");
    
    //IF SO, CHANGE IT TO ?LIST
    if( patt.test( conv ) ) conv = conv.replace("&list", "?list");
    
    
    url = `<iframe  id="vid-${master_num}"
                    width="854" 
                    height="480" 
                    src="https://www.youtube.com/embed/${conv}" 
                    frameborder="0" 
                    allowfullscreen>
          </iframe>`;
          

    t.$( '#added-video' ).remove();

    let ct = Session.get( 'contentTracker' );
    ct.page_no[page_no].videos++;
    Session.set( 'contentTracker', ct );
    
    Bert.alert('Loading video...', 'success' );
    
    //add to the canvas
    t.$( '#fb-template' ).html( url );
    
    P.update( { _id: my_id },
              { $push: 
                {
                  objects: 
                    {
                      page_no:  page_no,
                      id:       `vid-${master_num}`,
                      type:     'video',
                      url:      url
                    }
                }
              });

    $( '#cb-video-toolbar' ).show();
    t.$( '#cb-current' ).val( `vid-${master_num}` );
    


//-----------------------------------------------------------------------------
}
