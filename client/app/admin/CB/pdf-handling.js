/*
 * @module pdfHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */


let pdf     = ''
  , pdf_id  = '';

/**
 *
 * #COURSE-BUILDER-PDF  ::(CHANGE)::
 *
 * PDF input element
 * type = files
 */
export function cbPDFChange( e, t ) {
  
  if ( e.currentTarget.files === 'undefined' ) {
    console.log( 'aborted' );
    return;
  }
  
  /* in #add-pdf modal */
  if ( t.$( '#course-builder-pdf' )[0].files[0].type != 'application/pdf' ) {
    Bert.alert( 'Only PDF files please', 'danger' );
    $( '#course-builder-pdf' )[0].files  = undefined;
    $( '#course-builder-pdf' ).val('');
    return;
  }

}



/**
 *
 * #CB-PDF-SAVE  ::(CLICK)::
 *
 * id = add-pdf
 * pdf dialog
 */
export function cbPDFSave(  e, 
                            t, 
                            page_no,
                            Pdfs,
                            P
                          ) 
{
  e.preventDefault();
  
  Bert.alert( 'Please standby...', 'success' );
  
  let fil   = t.$( '#course-builder-pdf' )[0].files
	  , sf    = t.$( '#course-builder-pdf' ).data('subfolder')
	  , my_id = Session.get('my_id');
    
	S3.upload(
	          {
      				files:  fil, //files,
      				path:   sf //"subfolder"
		        },
		        
		        function( error, result ){
		          
		          if ( error ) throw error;
		          
			        //delete result._id;
			        pdf   = result.secure_url;
                
            	pdf_id =	Pdfs.insert({
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
            
            P.update({ _id: my_id },
                     { $push: 
                        {
                          objects: {
                                type:     'pdf',
                                page_no:  page_no,
                                url:      pdf
                          }
                        }
                      });
            
            
            $( '#cb-toolbar-video' ).show();
            t.$( '#cb-current' ).val( '#pdd' );
            
            let obj =
            `<embed width="100%" height="600" src="${pdf}" type="application/pdf"></embed>`;
            t.$( '#fb-template' ).empty();
            t.$( '#fb-template' ).append( obj );
        
            contentTracker.pdfs++;
            
            Session.set( 'contentTracker', contentTracker );
            
            pdf = null;
            
            //let tb = Session.get( 'tbo' );
            /*
            tb.pdfs[0] = { 
                      url:    `${obj}`,
                      pdf_id: pdf_id
                      };
            */        
            //Session.set( 'tbo', tb );
                     			       
  	       }//callback
	);//S3.upload()
	
  
    t.$( '#add-pdf' ).modal( 'hide' );
//-----------------------------------------------------------------------------
};

function activate_buttons() {
  $( '.js-delete-button' ).prop('disabled', false); 
}