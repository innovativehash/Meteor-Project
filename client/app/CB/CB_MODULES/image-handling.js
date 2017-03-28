/*
 * @module imageHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */



  let a_img_id  = ''
    , ig        = ''
    , itype     = '';


  /**
   * RESET
   */
  export function cbImageReset() {

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
        				files:  fil,      //files,
        				path:   'images'  //"subfolder"
			        },
			        
			        function( error, result ){
				        let img_id = result.secure_url;
				        

				        //let img = $( '#preview-image' );

                //img.attr( "src", img_id );
                //img.appendTo( '.image-preview' );
                console.log(img_id);
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
				      console.log( a_img_id);
		         }
		);

    
//---------------------------------------------------------
  }



  /********************************************************
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *******************************************************/
  export function cbImageSave( e, t, page_no, master_num, P ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    t.$( '#course-builder-image' ).val('');
    
    if ( ig == '' || ig == undefined || ig == null ) {
      Bert.alert('You must upload an image before you can save', 'danger' );
      return;
    }
    
    t.$( '#fb-template' ).append( `<div id="ig-${master_num}" data-img_lnk="${a_img_id}" class="ui-widget-content" data-pid="0" style="top:'100px';left:'200px';text-align: center; width: auto;height:autborder: 4px solid #eee;
        padding: 10px; float: left; margin: 0 auto;box-shadow:5px 5px 5px #888;position:relative;overflow:hidden;cursor:move;"><img id="im-${master_num}" src="${ig}" class="ui-widget-content" style="position:relative; display: block; margin:auto"></div>` );
    
    $( `#ig-${master_num}` ).draggable({ containment: "#fb-template", scroll: false });
    $( `#ig-${master_num}` ).resizable({ 
      handles: "all", 
      autoHide: true,
      aspectRatio: true,
      alsoResize: `#im-${master_num}`,
      containment: "#fb-template"
    });
    $( `#im-${master_num}` ).resizable();
    
    let pos   = {top:'100px', left:'200px'};
      
    P.append({
              page_no:          page_no,
              type:             'image',
              id:               `ig-${master_num}`,
              iid:              `im-${master_num}`,
              img_lnk:          a_img_id,
              offset:           $(`#ig-${master_num}`).offset(),
              iwidth:           $(`#im-${master_num}`).width(),
              iheight:          $(`#im-${master_num}`).height(),
              opacity:          $(`#ig-${master_num}`).css('opacity'),
              dwidth:           $(`#ig-${master_num}`).width(),
              dheight:          $(`#ig-${master_num}`).height(),
              src:              $(`#im-${master_num}`).attr('src')           
    });
/*
    P.update( { _id: my_id },
              { $push: 
                {
                  objects: {
                    page_no:          page_no,
                    type:             'image',
                    id:               `ig-${master_num}`,
                    iid:              `im-${master_num}`,
                    img_lnk:          a_img_id,
                    offset:           $(`#ig-${master_num}`).offset(),
                    iwidth:           $(`#im-${master_num}`).width(),
                    iheight:          $(`#im-${master_num}`).height(),
                    opacity:          $(`#ig-${master_num}`).css('opacity'),
                    dwidth:           $(`#ig-${master_num}`).width(),
                    dheight:          $(`#ig-${master_num}`).height(),
                    src:             `${ig}` 
                  }
                }
              });
*/
    Meteor.setTimeout(function(){

      $( `#ig-${master_num}` ).attr( 'data-pid', `${Session.get('my_id')}` );
      //console.log( $( `#ig-${master_num}` ).data('pid'));
    }, 500);
    
    (function( master_num, my_id ){

      //document.getElementById( `ig-${master_num}` ).onmouseup =  (e) => {
      $( `#ig-${master_num}` ).on("mouseup", function(){
        
        e.preventDefault();
      
      //SHOW MEDIA TOOLBAR
      $( '#cb-title-toolbar' ).hide();
      $( '#cb-text-toolbar' ).hide();
      $( '#cb-media-toolbar' ).show();
      
      t.$( '#cb-current' ).val( `ig-${master_num}` );
      
      let pos = $( `#ig-${master_num}` ).offset()
        , src = $( `#im-${master_num}` ).attr('src')
        , id  = `ig-${master_num}`
        , idx = P.indexOf( `ig-${master_num}` );
        
      P.remove( `ig-${master_num}` );
      
      P.insert( idx, {
                    page_no:          page_no,
                    type:             'image',
                    id:               `ig-${master_num}`,
                    iid:              `im-${master_num}`,
                    img_lnk:          a_img_id,
                    offset:           $(`#ig-${master_num}`).offset(),
                    iwidth:           $(`#im-${master_num}`).width(),
                    iheight:          $(`#im-${master_num}`).height(),
                    opacity:          $(`#ig-${master_num}`).css('opacity'),
                    dwidth:           $(`#ig-${master_num}`).width(),
                    dheight:          $(`#ig-${master_num}`).height(),
                    src:              $(`#im-${master_num}`).attr('src') 
      });
/*
      P.update({ _id: my_id, "objects.id": id },
               { $set:
                  {
                    "objects.$.page_no":      page_no,
                    "objects.$.id":           `ig-${master_num}`, 
                    "objects.$.type":         'image',
                    "objects.$.iid":          `im-${master_num}`,
                    "objects.$.img_lnk":      a_img_id,
                    "objects.$.offset":       $(`#im-${master_num}`).offset(),
                    "objects.$.zIndex":       $(`#im-${master_num}`).css('z-index'),
                    "objects.$.iwidth":       $(`#im-${master_num}`).width(),
                    "objects.$.iheight":      $(`#im-${master_num}`).height(),
                    "objects.$.opacity":      $(`#ig-${master_num}`).css('opacity'),
                    "objects.$.offset":       pos,
                    "objects.$.dwidth":       $(`#ig-${master_num}`).width(),
                    "objects.$.dheight":      $(`#ig-${master_num}`).height(),
                    "objects.$.src":          src                  
                  }
              });
*/

P.print();
    }); //onmouseup

  })( master_num );

    ig  = null;
    ext = null;
    $( '#preview-image' ).attr( 'src', null );
    t.$( '#add-image' ).modal( 'hide' );

//---------------------------------------------------------
  };