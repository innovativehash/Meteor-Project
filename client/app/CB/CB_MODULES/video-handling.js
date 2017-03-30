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

// ([a-z][A-Z])\w+ ["oTugjssqOtO", "oT"] 'https://www.youtube.com/embed/oTugjssqOT0'
//vimeo: /https:\/\/vimeo\.com\/(\d+)/
    let vid   = t.$( '#added-video' ).val()
      , m_youtube     = /(v=)(.*)(#)?/g
      , m_vimeo       = /https:\/\/vimeo\.com\/(\d+)/g
      , match_youtube = m_youtube.exec(vid)
      , match_vimeo   = m_vimeo.exec(vid)
      , url
      , patt
      , conv
      , isYoutube;
    
    if ( vid.indexOf('vimeo') != -1 ) {
      if (  match_vimeo[0] != '' && 
            match_vimeo[0] != undefined && 
            match_vimeo[0] != null &&
            match_vimeo[1] != '' &&
            match_vimeo[1] != undefined &&
            match_vimeo[1] != null ) 
      {
        conv = match_vimeo[1];
        isYoutube = false;
      }
    } else
        if ( match_youtube == null ) {
          let m     = /([a-z][A-Z])\w+/
            , match = m.exec(vid);
          conv  = match[0];
          isYoutube = true;
    } else {
      conv = match[2];
      isYoutube = true;
    }
    
    //IS THERE AN &LIST IN THE VIDEO ID?
    patt = new RegExp("[?&]list");
    
    //IF SO, CHANGE IT TO ?LIST
    if( patt.test( conv ) ) conv = conv.replace("&list", "?list");
    
    if ( isYoutube ) {
      url = `<iframe  id="vid-${master_num}"
                      width="854" 
                      height="480" 
                      src="https://www.youtube.com/embed/${conv}" 
                      frameborder="0" 
                      allowfullscreen>
            </iframe>`;
    } else {
      url = `<div style="margin:auto;width:50%;display:block;">
                <iframe  id="vid-${master_num}"
                      src="https://player.vimeo.com/video/${conv}?title=0&byline=0&portrait=0&badge=0" 
                      width="854"
                      height="363"
                      frameborder="0" 
                      webkitallowfullscreen 
                      mozallowfullscreen 
                      allowfullscreen>
                </iframe>
              </div>`
    }
          

    t.$( '#added-video' ).remove();

    Bert.alert('Loading video...', 'success' );
    
    //add to the canvas
    t.$( '#fb-template' ).html( url );
    
    P.append({
              page_no:  page_no,
              type:     'video',
              id:       `vid-${master_num}`,
              url:      url.trim()
    });
    
P.print();
/*   
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
*/
    $( '#cb-title-toolbar' ).hide();
    $( '#cb-text-toolbar'  ).hide();
    $( '#cb-media-toolbar' ).hide();
    
    $( '#cb-video-toolbar' ).show();
    t.$( '#cb-current' ).val( `vid-${master_num}` );
    


//-----------------------------------------------------------------------------
}
