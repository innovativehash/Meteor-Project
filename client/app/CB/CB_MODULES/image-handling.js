/*
 * @module imageHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */
 
   /********************************************************
   * #CB-IMAGE-SAVE  ::(CLICK)::
   *******************************************************/
  export function cbImageSave( e, t, page_no, master_num, P, Images ) {
    e.preventDefault();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let ext   = t.$( '#course-builder-image' )[0].files[0].name
      , itype = t.$( '#course-builder-image' )[0].files[0].type;
      
    ext = String(ext);
    
    try {
      ext = ext.slice(ext.lastIndexOf('.'));
    } catch (e) {
      ;
    }
    
    if  (  
          itype != 'image/png'  && 
          itype != 'image/jpeg' && 
          itype != 'image/gif'  &&
          ext   != '.gif'       &&
          ext   != '.jpg'       &&
          ext   != '.jpeg'      &&
          ext   != '.png'
        ) 
    {
      Bert.alert( 'Incompatible Image Format: must be either a jpg, png, or gif file', 'danger' );

      e.currentTarget.files         = undefined;
      e.currentTarget.files[0]      = undefined;
      e.currentTarget.files[0].name = undefined;
      itype = '';
      t.$( '#course-builder-image' ).val('');
      return;
    }

    let fil   = t.$( '#course-builder-image' )[0].files
	    , sf    = t.$( '#course-builder-image' ).data('subfolder')
	    , obj;

console.log(sf);

  	if ( fil.length == 0 ) {
  	  Bert.alert('You must upload an image before you can save', 'danger');
  	  return;
  	}

	  Bert.alert( 'Please standby...', 'success' );	  

	  
		S3.upload(
		          {
        				files:  fil,      //files,
        				path:   sf  //"subfolder"
			        },
			        
			        function( error, result ){
console.log('enter callback');

				        let img_id = result.secure_url;
				        
                if ( error ) throw error;

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
console.log( result.file );

                obj = `<div id="ig-${master_num}" 
                            style="cursor:move;max-width:40%;max-height:40%">
                        <img  id="im-${master_num}" 
                              src="${img_id}"
                              style="margin:0 auto;
                              z-index:10;
                              width:200px;
                              height:200px; 
                              max-width:100%;
                              max-height:100%;
                              position:relative; 
                              display:block;">
                      </div>`;
                     
                  t.$( '#fb-template' ).append( obj );

                  $( `#ig-${master_num}` ).draggable({ containment: "#fb-template", scroll: false });
                  
                  $( `#ig-${master_num}` ).resizable({ 
                    handles: "all", 
                    autoHide: false,
                    aspectRatio: true,
                    alsoResize: `#im-${master_num}`,
                    containment: "#fb-template"
                  });
                  
                  $( `#im-${master_num}` ).resizable();
                  
              
                  //$( `#ig-${master_num}` ).attr( 'data-pid', `${Session.get('my_id')}` );
                    //console.log( $( `#ig-${master_num}` ).data('pid'));

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
                            src:              img_id         
                  });
                  

                  
                  (function( master_num ){
              
                    //document.getElementById( `ig-${master_num}` ).onmouseup =  (e) => {
                    $( `#ig-${master_num}` ).on("mouseup", function(){
                      
                      e.preventDefault();
                    
                    //SHOW MEDIA TOOLBAR
                    $( '#cb-video-toolbar').hide();
                    $( '#cb-title-toolbar' ).hide();
                    $( '#cb-text-toolbar' ).hide();
                    $( '#cb-media-toolbar' ).show();
                    
                    t.$( '#cb-current' ).val( `ig-${master_num}` );
                    
                    let pos = $( `#ig-${master_num}` ).offset()
                      , src = $( `#im-${master_num}` ).attr('src')
                      , id  = `ig-${master_num}`
                      , idx = P.indexOf( `ig-${master_num}` );
                      
                    //P.remove( `ig-${master_num}` );
                    P.removeAt( idx );
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
              
                  }); //onmouseup
            
                })( master_num );
            
                  ig  = null;
                  ext = null;
                  $( '#preview-image' ).attr( 'src', null );
                  t.$( '#add-image' ).modal( 'hide' );
P.print();
                  t.$( '#course-builder-image' ).val('');
		         }
		);
		
    //$(`#im-${master_num}`).attr('src') 

//---------------------------------------------------------
	}
  
 