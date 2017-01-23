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
export function cbPDFChange( e, t, tbo, Pdfs ) {
  if ( e.currentTarget.files === 'undefined' ) {
    console.log( 'aborted' );
    return;
  }
  
  if ( t.$( '#course-builder-pdf' )[0].files[0].type != 'application/pdf' ) {
    Bert.alert( 'Only PDF files please', 'danger' );
    $( '#course-builder-pdf' )[0].files          = undefined;
    //$( '#course-builder-pdf' )[0].files[0]       = undefined;
    //$( '#course-builder-pdf' )[0].files[0].name  = undefined;
    $( '#course-builder-pdf' ).val('');
    return;
  }


  let fil   = t.$( '#course-builder-pdf' )[0].files
	  , sf    = t.$( '#course-builder-pdf' ).data('subfolder');
    
	S3.upload(
	          {
      				files:  fil, //files,
      				path:   sf //"subfolder"
		        },
		        
		        function( error, result ){
			        //delete result._id;
			        pdf = result.secure_url;
			        //let img = $( '#preview-image' );

              //img.attr( "src", pdf ); // pdf
              //img.appendTo( '.image-preview' );
                
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
  	       }
	);//S3.upload()
	
/*
  let fil   = t.$( '#course-builder-pdf' ).get(0).files[0]
    , fr    = new FileReader();

  fr.onload = function() {
    pdf     = this.result;
  };

  // reads in image, calls back fr.onload
  fr.readAsDataURL( fil );
*/
}



/**
 *
 * #CB-PDF-SAVE  ::(CLICK)::
 *
 * id = add-pdf
 * pdf dialog
 */
export function cbPDFSave( e, t, tbo, contentTracker, pdfsTracker ) {
  e.preventDefault();
  
  
/*
    Meteor.call( 'saveBuiltCoursePdf',
                  built_id,
                  pdf,
                  Template.instance().page.get() );

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
*/

  if ( pdf ) {

    Bert.alert( 'Loading PDF...', 'success' );
    
    $( '#cb-toolbar-video' ).show();
    t.$( '#cb-current' ).val( '#pdd' );
    
    let obj =
    `<embed width="100%" height="600" src="${pdf}" type="application/pdf"></embed>`;
    t.$( '#fb-template' ).empty();
    t.$( '#fb-template' ).append( obj );

/*
    '<object data="' + pdf + '" type="application/pdf" width="100%" height="auto">' +
    '<iframe src="' + pdf + '" width="100%" height="auto" style="border: none;">' +
    'This browser does not support PDFs. Please download the PDF to view it: <a href="' + pdf + '">Download PDF</a>' +
    '</iframe>' +
    '</object>';
*/
    contentTracker.pdfs++;
    Session.set('contentTracker', contentTracker);
    
    tbo.pdfs[0] = { 
                    url: `${obj}`,
                    pdf_id: pdf_id
                  };

    
    pdf = null;
  }
    t.$( '#add-pdf' ).modal( 'hide' );
//-----------------------------------------------------------------------------
};

function activate_buttons() {
  $( '.js-delete-button' ).prop('disabled', false); 
}