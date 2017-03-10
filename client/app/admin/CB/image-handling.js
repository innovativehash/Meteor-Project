/*
 * @module imageHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */



  let img_id    = -1
    , a_img_id  = ''
    , ig        = ''
    , itype     = '';


  /**
   * RESET
   */
  export function cbImageReset() {
    img_id    = -1;
    a_img_id  = ''
    ig        = '';
    itype     = '';
  }



  /********************************************************
   * #COURSE-BUILDER-IMAGE ::(CHANGE)::
   *******************************************************/
  export function cbImageChange( e, t /*,Images*/ ) {
    
    e.preventDefault();
    e.stopImmediatePropagation();
    
    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    itype = e.currentTarget.files[0].type;
    
    if ( itype != 'image/png' && itype != 'image/jpeg' ) {
      Bert.alert( 'Incompatible Image Format: must be either a jpg or png file', 'danger' );

      e.currentTarget.files         = undefined;
      e.currentTarget.files[0]      = undefined;
      e.currentTarget.files[0].name = undefined;
      itype = '';
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

    // READS AN IMAGE, CALLS BACK fr.ONLOAD
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
    
    e.currentTarget.files         = undefined;
    e.currentTarget.files[0]      = undefined;
    e.currentTarget.files[0].name = undefined;
    
    itype = '';
 
		S3.upload(
		          {
        				files:  fil, //files,
        				path:   sf //"subfolder"
			        },
			        
			        function( error, result ){
				        ig = result.secure_url;
				        
				        let img = $( '#preview-image' );

                img.attr( "src", ig );
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

    
//---------------------------------------------------------
  }



  /********************************************************
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *******************************************************/
  export function cbImageSave( e, t, page_no, P ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    t.$( '#course-builder-image' ).val('');
    
    contentTracker.images++;
    Session.set('contentTracker', contentTracker);
    
    ++img_id;


    t.$( '#fb-template' ).append( `<div id="ig-${img_id}" data-pid="0" style="top:'100px';left:'200px';display:inline-block;position:absolute;cursor:move;"><img id="im-${img_id}" src="${ig}"></div>` );
    
    
    $( `#ig-${img_id}` ).draggable();
    $( `#im-${img_id}` ).resizable();
    
    let pos   = {top:'100px', left:'200px'}
      , my_id = Session.get('my_id');
    
    P.update( { _id: my_id },
              { $push: 
                {
                  objects: {
                    type:     'image',
                    page_no:  page_no,
                    id:       img_id,
                    offset:   pos,
                    img_id:   `im-${img_id}`,
                    src:      `${ig}`
                  }
                }
              });
                        
    Meteor.setTimeout(function(){

      $( `#ig-${img_id}` ).attr( 'data-pid', `${my_id}` );
      //console.log( $( `#ig-${img_id}` ).data('pid'));
    }, 500);
    
    (function( img_id, my_id ){

      //document.getElementById( `ig-${img_id}` ).onmouseup =  (e) => {
      $( `#ig-${img_id}` ).on("mouseup", function(){
        e.preventDefault();

      //let tb = Session.get( 'tbo' );
      
      $( '#cb-toolbar-media' ).show();
      
      t.$( '#cb-current' ).val( `#ig-${img_id}` );
      
      //tb.images[img_id] = `#ig-${img_id}`;
      
      let pos = $( `#tit-${tit_id}` ).offset();
        
      //Session.set( 'tbo', tb );

      P.update({ _id: my_id, "objects.page_no": page_no },
               { $set:
                  {
                    "objects.$.type":     'image',
                    "objects.$.page_no":  page_no,
                    "objects.$.id":       img_id,
                    "objects.$.offset":   pos,
                    "objects.$.img_id":   `im-${img_id}`,
                    "objects.$.src":      `${ig}`                  
                  }
              });
    }); //onmouseup

  })( img_id, my_id );

    ig  = null;
    ext = null;
    $( '#preview-image' ).attr( 'src', null );
    t.$( '#add-image' ).modal( 'hide' );

//---------------------------------------------------------
  };