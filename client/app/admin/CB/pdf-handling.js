


/**
 *
 * #COURSE-BUILDER-PDF  ::(CHANGE)::
 *
 * PDF input element
 * type = files
 */
export function cbPDFChange( e, t, cbo ) {
  if ( e.currentTarget.files === 'undefined' ) {
    console.log( 'aborted' );
    return;
  }

  let fil   = t.$( '#course-builder-pdf' ).get(0).files[0]
    , fr    = new FileReader();

  fr.onload = function() {
    ig      = this.result;
  };

  // reads in image, calls back fr.onload
  fr.readAsDataURL( fil );
}



/**
 *
 * #CB-PDF-SAVE  ::(CLICK)::
 *
 * id = add-pdf
 * pdf dialog
 */
export function cbPDFSave( e, t, cbo, contentTracker ) {
    /*
    Meteor.call( 'saveBuiltCoursePdf',
                  built_id,
                  ig,
                  Template.instance().page.get() );

    Template.instance().page.set( Template.instance().page.get() + 1 );
    Template.instance().total.set( Template.instance().total.get() + 1 );
*/


    let obj =
    '<object data="' + ig + '" type="application/pdf" width="100%" height="100%">' +
    '<iframe src="' + ig + '" width="100%" height="100%" style="border: none;">' +
    'This browser does not support PDFs. Please download the PDF to view it: <a href="' + ig + '">Download PDF</a>' +
    '</iframe>' +
    '</object>';
   $( '#fb-template' ).html( obj );
/*
    //492px x 285px
    t.$( '#fb-template' ).html( '<embed src="'  +
                                ig              +
                                '"'             +
                                ' width="100%" height="100%" style="margin:auto;padding:0;" />'
                              );
*/

    ig = null;
    t.$( '#add-pdf' ).modal( 'hide' );
//-----------------------------------------------------------------------------
}