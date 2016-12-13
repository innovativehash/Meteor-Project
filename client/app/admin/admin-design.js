/*
 * @module adminDesign
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import '../../../public/css/bootstrap-colorpicker.min.css';


import { Template }     from 'meteor/templating';
import { Students }     from '../../../both/collections/api/students.js';
import { Companies  }   from '../../../both/collections/api/companies.js';

import '../../templates/admin/admin-design.html';

let co_id = '';

/*
 * CREATED
 */
Template.adminDesign.onCreated(function(){

  //$("#cover").show();

  //this.autorun(() => {
  //this.subscribe("company_id", Meteor.userId());
  //});


  /*
   * BOOTSTRAP-COLORPICKER
   */
  $.getScript( '/js/bootstrap-colorpicker.min.js', function() {
    let tmp = Students.findOne({ _id: Meteor.userId() });
    co_id   = tmp && tmp.company_id;

    tmp     = Companies.findOne({ _id: co_id });
    let col = tmp && tmp.backgroundColor;

	  //color picker
	  $( ".color-picker" ).colorpicker({ color: col });
    //console.log('DESIGN:: bootstrap-colorpicker.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'DESIGN:: load bootstrap-colorpicker.min.js fail' );
  });
//-------------------------------------------------------------------
});


/*
 * RENDERED
 */
Template.adminDesign.onRendered(function(){
/*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
*/
});


Template.adminDesign.helpers({
  companies: () => {
    let id = Students.findOne({ _id: Meteor.userId() }).company_id;
    return Companies.findOne({ _id: id });
  }
});



let ig  = ''
  , ext = ''
  , foo = '';

/*
 * EVENTS
 */
Template.adminDesign.events({

  /*
   * #LOGO-UPLOAD  ::(CHANGE)::
   */
  'change #logo-upload'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log( 'aborted' );
      return;
    }

    let mark = ( e.currentTarget.files[0].name ).lastIndexOf( '.' ) + 1;

    ext   = ( e.currentTarget.files[0].name ).slice( mark );
    ext   = ( ext == ( 'jpg' || 'jpeg' ) ) ? 'image/jpeg' : 'image/png';

    let fil = t.$( '#logo-upload' ).get(0).files[0];
    let fr  = new FileReader();

    let myimage = new Image();
    fr.onload   = function() {
      ig        = this.result;

      //orig
      myimage.src = ig;
      console.log( 'img.width   = ' + myimage.width );
      console.log( 'img.height  = ' + myimage.height );
      let b = new Buffer( ig, 'base64' ).length
      console.log( 'img.size ' + b );

      //resized
      foo = resizedataURL( myimage, ext, 150, 150 );
      myimage.src = foo;
      console.log( 'img.width   = ' + myimage.width );
      console.log( 'img.height  = ' + myimage.height );
      b = new Buffer( foo, 'base64' ).length
      console.log( 'img.size ' + b );
    };

    // reads in image, calls back fr.onload
    fr.readAsDataURL( fil );
    Meteor.setTimeout( function() {
      if ( foo ) {
        let co_id = Students.findOne({ _id: Meteor.userId() }).company_id;
        t.$( '#logo-preview' ).attr( "src", foo ); // ig

        Meteor.call( 'saveCompanyLogo', co_id, foo );
      } else {
          img = null;
      }
    }, 200);
    return;
//-------------------------------------------------------------------
  },


  /*
   * #DESIGN-SUBMIT  ::(CLICK)::
   */
  'click #design-submit'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Bert.alert( 'Your information has been saved.', 'success' );
  },


  /*
   * HIDEPICKER .COLOR-PICKER

  'hidePicker .color-picker'( e, t ){
    let colorValue = t.$('.color-picker > input').val();

    Meteor.setTimeout(function(){
      if ( colorValue ) {
        let co_id = Students.findOne({_id: Meteor.userId()}).company_id;
        Meteor.call( 'saveCompanyColor', co_id, colorValue );
      }
    }, 200);
//-------------------------------------------------------------------
  },
  */

});


/*
 * Takes a data URI and returns the Data URI corresponding to
 * the resized image at the wanted size.
 */
function resizedataURL(img, ext, wantedWidth, wantedHeight) {

    let iw        = img.width;
    let ih        = img.height;
    let scale     = Math.min((wantedWidth/iw),(wantedHeight/ih));
    let iwScaled  = iw*scale;
    let ihScaled  = ih*scale;
    let canvas    = document.createElement("canvas");
    let ctx       = canvas.getContext("2d");
    canvas.width  = iwScaled;
    canvas.height = ihScaled;

    ctx.drawImage( img,0,0,iwScaled,ihScaled );
    return canvas.toDataURL( '"' + ext + '"' );
}