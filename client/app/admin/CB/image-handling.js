


  let img_id  = -1
    , ig      = ''
    , ext     = '';


  /**
   * RESET
   */
  export function cbImageReset() {
    img_id  = -1;
    ig      = '';
    ext     = '';
  }



  /**
   *
   * #COURSE-BUILDER-IMAGE ::(CHANGE)::
   *
   */
  export function cbImageChange( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let mark = ( e.currentTarget.files[0].name ).lastIndexOf('.') + 1;

    ext   = ( e.currentTarget.files[0].name ).slice( mark );
    ext   = ( ext == ( 'jpg' || 'jpeg' ) ) ? 'image/jpeg' : 'image/png';

    let fil = t.$( '#course-builder-image' ).get(0).files[0];
    let fr  = new FileReader();

    let myimage = new Image();

    fr.onload   = function() {

      ig        = this.result;

      //orig
      myimage.src = ig;

      //DEBUG INFO:
      console.log( 'img.width   = ' + myimage.width );
      console.log( 'img.height  = ' + myimage.height );
      let b                     = new Buffer( ig, 'base64' ).length
      console.log( 'img.size ' + b );
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL( fil );

    Meteor.setTimeout( function() {
      if ( ig ) {
        let img = $( '#preview-image' );

        img.attr( "src", ig ); // ig
        img.appendTo( '.image-preview' );
      } else {
          img = null;
      }
    }, 200);

    t.$( '#course-builder-image' ).val('');
//-----------------------------------------------------------------------------
  }



  /**
   *
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *
   */
  export function cbImageSave( e, t, tbo, contentTracker, imagesTracker ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    contentTracker.images++;
    ++img_id;

    t.$( '#fb-template' ).append( `<span id="ig-${img_id}" style="top:100px;left:200px;display:inline-block;position:absolute;"><img id="img-preview-${img_id}" src="${ig}" style="cursor:move;"></span>` );

    $( `#ig-${img_id}` ).draggable();
    $( `#img-preview-${img_id}` ).resizable();
/*
    tbo.images[img_id] = {  page: Template.instance().page.get(),
                            id: img_id,
                            image: $( `#img-preview-${img_id}` ).attr( 'src' ) };
*/
    (function(img_id){

      //document.getElementById( `ig-${img_id}` ).onmouseup =  (e) => {
      $( `#ig-${img_id}` ).on("mouseup", function(){
        e.preventDefault();
        e.stopImmediatePropagation();

      imagesTracker.push( img_id );

/*
        let p = $( `#ig-${img_id}` ).position();

        tbo.images[img_id].top  = p && p.top;
        tbo.images[img_id].left = p && p.left;
*/
// };

      if ( ! t.$( `#close-img-${img_id}` ).length ) {
          $( `#ig-${img_id}` ).append( `<button type="button"
                                                id="close-img-${img_id}"
                                                class="btn btn-danger btn-xs">
                                          <span class="glyphicon glyphicon-trash"></span>
                                        </button>` );
        //CLOSE BUTTON EVENT
        t.$( `#close-img-${img_id}` ).on( "click", (e) => {
          e.preventDefault();

          //delete tbo.images[img_id];
          contentTracker.images--;
          $( `#${e.currentTarget.parentNode.id}` ).remove();
        });
      }// if

      // BUTTON TIMER
      Meteor.setTimeout(function(){
        t.$( `#close-img-${img_id}` ).off( "click" );
        t.$( `#close-img-${img_id}` ).remove();
      }, 2000);

    }); //onmouseup

  })(img_id);

    ig  = null;
    ext = null;
    $( '#preview-image' ).attr( 'src', null );
    t.$( '#add-image' ).modal( 'hide' );

//-----------------------------------------------------------------------------
  }