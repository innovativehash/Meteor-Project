/*
 * @module powerPointHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */


let ig = '';

  /**
   * 
   * #COURSE-BUILDER-POWERPOINT  ::(CHANGE)::
   * 
   */
   export function cbPowerPointChange( e, t, tbo, PowerPoints ) {
  if ( e.currentTarget.files === 'undefined' ) {
    console.log( 'aborted' );
    return;
  }
  
  let fil = t.$( '#course-builder-powerpoint' )[0].files
	  , sf  = t.$( '#course-builder-powerpoint' ).data('subfolder');
  
		S3.upload(
		          {
        				files:  fil, //files,
        				path:   sf //"subfolder"
			        },
			        
			        function( e, r ){
				        //console.log( r );
				        //delete r._id;
				        ig = r.secure_url;
				        //let img = $( '#preview-image' );

                //img.attr( "src", ig ); // ig
                //img.appendTo( '.image-preview' );
                
				        PowerPoints.insert({
				          loaded:           r.loaded,
				          percent_uploaded: r.percent_uploaded,
				          relative_url:     r.relative_url,
				          secure_url:       r.secure_url,
				          status:           r.status,
				          total:            r.total,
				          uploader:         r.uploader,
				          url:              r.url,
				          file:             r.file,
				          created_at:       moment().format()
				        });
		          }
		); 
   };
   
   
   
  /**
   *
   * #CB-POWERPOINT-SAVE  ::(CLICK)::
   *
   * id = add-powerpoint
   * powerpoint dialog
   */
  export function cbPowerPointSave( e, t, cbo, contentTracker, PowerPoints ) {
    e.preventDefault();
    e.stopImmediatePropagation();

  console.log( tbo );
    /*
    Meteor.call( 'saveBuiltCoursePdf',
                  built_id,
                  ig,
                  Template.instance().page.get() );


    Template.instance().page.set( Template.instance().page.get()    + 1 );
    Template.instance().total.set( Template.instance().total.get()  + 1 );
*/
//-----------------------------------------------------------------------------
  }