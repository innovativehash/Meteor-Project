/*
 * @module imageHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */



  let img_id    = -1
    , a_img_id  = ''
    , ig        = ''
    , ext       = '';


  /**
   * RESET
   */
  export function cbImageReset() {
    img_id    = -1;
    a_img_id  = ''
    ig        = '';
    ext       = '';
  }



  /**
   *
   * #COURSE-BUILDER-IMAGE ::(CHANGE)::
   *
   */
  export function cbImageChange( e, t, tbo /*,Images*/ ) {
    
    e.preventDefault();
    e.stopImmediatePropagation();
    
    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let mark = ( e.currentTarget.files[0].name ).lastIndexOf('.') + 1;
    console.log( e.currentTarget.files[0].name );
    ext   = ( e.currentTarget.files[0].name ).slice( mark );
    if ( ext == ( 'jpg' || 'jpeg' ) ) {
      ext = 'jpeg';
    }
    
    if ( ext !== 'jpeg' && ext !== 'png' ) {
      Bert.alert( 'Incompatible Image Format: must be either a jpg or png file', 'danger' );
      //console.log( 'post ' + ext )
      //console.log( e.currentTarget.files );
      //console.log( e.currentTarget.files[0] );
      e.currentTarget.files = undefined;
      e.currentTarget.files[0] = undefined;
      e.currentTarget.files[0].name = undefined;
      ext = '';
      t.$( '#course-builder-image' ).val('');
      return;
    }
    
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
      myimage = null;
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
    
    e.currentTarget.files = undefined;
    e.currentTarget.files[0] = undefined;
    e.currentTarget.files[0].name = undefined;
    
    ext = '';
//
  		//let files = t.$( "input.file_bag" )[0].files
  		//let fil = t.$( '#course-builder-image' ).get(0).files[0]
/*  		
  		let fil = t.$( '#course-builder-image' )[0].files
		  , sf    = t.$( '#course-builder-image' ).data('subfolder');
 
		S3.upload(
		          {
        				files:  fil, //files,
        				path:   sf //"subfolder"
			        },
			        
			        function( error, result ){
				        ig = result.secure_url;
				        
				        let img = $( '#preview-image' );

                img.attr( "src", ig ); // ig
                img.appendTo( '.image-preview' );
                
				        a_img_id = Images.insert({
                        				          loaded:           result.loaded,
                        				          percent_uploaded: result.percent_uploaded,
                        				          relative_url:     result.relative_url,
                        				          secure_url:       result.secure_url,
                        				          status:           result.status,
                        				          total:            result.total,
                        				          uploader:         result.uploader,
                        				          url:              result.url,
                        				          file:             result.file,
                        				          created_at:       moment().format()
				                                });
		         }
		);
*/
    
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

    t.$( '#course-builder-image' ).val('');
    
    contentTracker.images++;
    ++img_id;

    t.$( '#fb-template' ).append( `<div id="ig-${img_id}" style="top:100px;left:200px;display:inline-block;position:absolute;cursor:move;"><img id="im-${img_id}" src="${ig}"></div>` );

    tbo.images[img_id] = `#ig-${img_id}`;
    
    $( `#ig-${img_id}` ).draggable();
    $( `#im-${img_id}` ).resizable();
/*
  Don't need to sort image, as is captured as part of page with title, text, img
  
    tbo.images[img_id] = {  page: Template.instance().page.get(),
                            id: img_id,
                            image: ig,
                            a_img_id: a_img_id
                         };
*/
    (function(img_id){

      //document.getElementById( `ig-${img_id}` ).onmouseup =  (e) => {
      $( `#ig-${img_id}` ).on("mouseup", function(){
        e.preventDefault();
        e.stopImmediatePropagation();

      $( '#cb-toolbar-media' ).show();
      
      t.$( '#cb-current' ).val( `#ig-${img_id}` );
      
/*
      imagesTracker.push( img_id );

        let p = $( `#ig-${img_id}` ).position();

        tbo.images[img_id].top  = p && p.top;
        tbo.images[img_id].left = p && p.left;
*/
// };

/*
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
*/
    }); //onmouseup

  })(img_id);

    ig  = null;
    ext = null;
    $( '#preview-image' ).attr( 'src', null );
    t.$( '#add-image' ).modal( 'hide' );

//-----------------------------------------------------------------------------
  };