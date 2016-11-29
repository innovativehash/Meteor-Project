

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
  export function addedVideoURL( e, t, tbo, contentTracker ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.id == 'intro-modal' ) return;
////////////////////////////
//    VIDEO MUST BE ON IT'S OWN page
////////////////////////////

    let vid = t.$( '#added-video' ).val()
      , m   = vid.slice( vid.indexOf('=') +1)
      , url;

    url = `<iframe  width="640"
                    height="360"
                    src="https://www.youtube.com/embed/${m}"
                    frameborder="0"
                    allowfullscreen>
            </iframe>`

    t.$( '#added-video' ).remove();

    contentTracker.videos++;
    ++vid_id;

    //tbo.videos.push( {page: Template.instance().page.get(), id: ++vid_id, url: vid} );
    tbo.videos[vid_id] = { no: Template.instance().page.get(), page: url };

    //add to the canvas
    t.$( '#fb-template' ).html( url );

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
