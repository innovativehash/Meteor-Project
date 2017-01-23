/*
 * @module degreeCertificate
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Certifications } from '../../../both/collections/api/certifications.js';
import { Diplomas }       from '../../../both/collections/api/diplomas.js';

//import '../../../public/bower_components/bootstrap3-dialog/dist/css/bootstrap-dialog.min.css';
import '../../templates/admin/degree-certificate.html';


/*
 * CREATED
 */
Template.degreeCertificate.onCreated( function() {

  //$("#degree-cert-cover").show();

  Session.setDefault( 'doc', 'degreeCertificate' );

  /*
   * BOOTSTRAP3-DIALOG
   */
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('degreeCertificate:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'degreeCertificate:: load bootstrap-dialog.min.js fail' );
  });
 //-------------------------------------------------------------------

/*
 * SELECT2
 * multi-select auto-complete box
 */
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){
      $( '#search-cert-deg' ).select2({
        allowClear: true
      });
    });
    //console.log('degreeCertificate:: chosen,jquery.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'degreeCertificate:: load select2.js fail' );
  });
//-------------------------------------------------------------------
});


/*
 * RENDERED
 */
Template.degreeCertificate.onRendered( function() {
/*
  $( '#degree-cert-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#degree-cert-cover").hide();
    $( ".dashboard-body-area" ).fadeIn( 'slow' );
  });
*/
});


/*
 * HELPERS
 */
Template.degreeCertificate.helpers({

  list: () => {
    try {
      let c = Certifications.find({ company_id: Meteor.user().profile.company_id }).fetch();
      let d = Diplomas.find({ company_id: Meteor.user().profile.company_id }).fetch();
      c.push.apply( c, d );
      return c;
    } catch(e) {
      return;
    }
  }
//-------------------------------------------------------------------
});


/*
 * EVENTS
 */
Template.degreeCertificate.events({

  /*
   * .JS-DEGREE  ::(CLICK)::
   */
  'click .js-degree'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //console.log( UI._parentData() );
    //t.currentScreen.set("degree");
    FlowRouter.go( 'admin-degrees', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * .JS-CERTIFICATE  ::(CLICK)::
   */
  'click .js-certificate'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-certifications', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * #SEARCH-CERT-DEG  ::(CHANGE)::
   */
  'change #search-cert-deg'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    $( 'tr' ).css( 'border', '' );
    $( 'tr#' + idx ).css('border', '1px solid' );
    $( 'html, body' ).animate({
      scrollTop: $( 'tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast');
//-------------------------------------------------------------------
  },


  /*
   * .JS-EDIT  ::(CLICK)::
   */
  'click .js-edit'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    //$( '#edit-degree-cert' ).modal();
    
     /* OPEN EDIT DIALOG */
      let idx   = $( e.currentTarget ).data( 'id' )
        , type  = $( e.currentTarget ).data( 'type' );
          //db    = undefined;
          
      console.log( idx );
      console.log( type );
/*      
      switch( type ) {
        case "certificate":
          db = Certifications.findOne({ _id:idx },{ "name":1, "credits":1 } );
          break;
        case "degree":
          db = Diplomas.findOne({ _id:idx }, { "name":1, "credits":1 });
          break;
      }
*/
  
  let params = {_id: Meteor.userId() };
  let queryParams = {dorc: type, id: idx};
  FlowRouter.go( 'degree-cert-edit', params,  queryParams );
  //FlowRouter.go( `/dashboard/degree-cert-edit/${Meteor.userId()}?dorc=${type}&id=${idx}` );
//-------------------------------------------------------------------
  },


  /*
   * .JS-DELETE  ::(CLICK)::
   */
  'click .js-delete'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    /* ARE YOU SURE YOU WANT TO DELETE... */
    let idx = $( e.currentTarget ).data( 'id' )
      , nm  = $( e.currentTarget ).data( 'name' )
      , type = this.type;
    
    $( '#delete-dta' ).attr('data-id', idx );
    $( '#delete-dta' ).attr('data-type', type );
    $( '#degree-cert-delete-type' ).text( `${type}` );
    
    $( '#delete-degree-cert' ).modal();
    
    $( '#degree-cert-delete-text' ).text( `${nm}` );
    
    //maybe some logic to remove this course from students currently taking it?

//-------------------------------------------------------------------
  },


  /*
   * #DEGREE-CERT-DELETE-CANCEL
   */
  'click #degree-cert-delete-cancel'( e, t ) {
    e.preventDefault();
    
    $( '#delete-degree-cert' ).modal('hide');
  },
  
  
  /*
   * #DEGREE-CERT-DELETE-SUBMIT
   */
  'click #degree-cert-delete-submit'( e, t ) {
    e.preventDefault();
    
    let type  = $( '#delete-dta' ).data('type')
      , idx   = $( '#delete-dta' ).data('id');

     switch ( type ) {
      case "certificate":
        Certifications.remove({ _id: idx});
        break;
      case "degree":
        Diplomas.remove({ _id: idx});
        break;
    }
    
    $( '#delete-degree-cert' ).modal('hide');
  },
  
  
  
  /*
   * #DASHBOARD-PAGE  ::(CLICK)::
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault()
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
});
