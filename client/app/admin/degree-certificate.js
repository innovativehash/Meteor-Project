import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Certifications } from '../../../both/collections/api/certifications.js';
import { Diplomas }       from '../../../both/collections/api/diplomas.js';

import '../../../public/bower_components/bootstrap3-dialog/dist/css/bootstrap-dialog.min.css';
import '../../templates/admin/degree-certificate.html';


/*
 * CREATED
 */
Template.degreeCertificate.onCreated( function() {
  
  $("#degree-cert-cover").show();
    
  Session.setDefault('doc', 'degreeCertificate');

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
  $.getScript('/js/select2.min.js', function() {
    $(document).ready(function(){
      $('#search-cert-deg').select2({
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

  $( '#degree-cert-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#degree-cert-cover").hide();
    $( ".dashboard-body-area" ).fadeIn( 'slow' );
  }); 
  
});


/*
 * HELPERS
 */
Template.degreeCertificate.helpers({
 
  list: () => {
    let c = Certifications.find({company_id:1}).fetch();
    let d = Diplomas.find({company_id:1}).fetch();
    c.push.apply(c, d);
    return c;
  }
//-------------------------------------------------------------------
});


/*
 * EVENTS
 */
Template.degreeCertificate.events({

  /*
   * CLICK .JS-DEGREE
   */
  'click .js-degree'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    //console.log( UI._parentData() );
    //t.currentScreen.set("degree");
    FlowRouter.go('admin-degrees', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK .JS-CERTIFICATE
   */
  'click .js-certificate'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go('admin-certifications', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
  
  
  /*
   * CHANGE #SEARCH-CERT-DEG
   */
  'change #search-cert-deg'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let idx = $( e.currentTarget ).val();
    $('tr').css('border', '');
    $('tr#' + idx ).css('border', '1px solid');
    $('html, body').animate({
      scrollTop: $('tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast');
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK .JS-EDIT
   */
  'click .js-edit'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
     /* OPEN EDIT DIALOG */
      let idx = $( e.currentTarget ).data('id'),
          type = $( e.currentTarget ).data('type');
          db = undefined;
          
      switch( type ) {
        case "certificate":
          db = Certifications.findOne({ _id:idx },{ "name":1, "credits":1 } );
          break;
        case "degree":
          db = Diplomas.findOne({_id:idx}, {"name":1, "credits":1 });
          break;
      }

      BootstrapDialog.show({
        title: this.type == "degree" ? "Edit Degree" : "Edit Certificate",
        message:  '<div class="pop-up-area students">' +
                      '<div class="popup-body">' + 
                          '<div class="row">' +
                              '<div class="col-sm-6">' +
                                '<label>' + db.type + ' Name:</label>'+
                                  '<input class="js-name" type="text" placeholder="' + db.name + '"' + '/>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div class="col-sm-6">' +
                                      '<label>Credits:</label>' +
                                        '<input class="js-credits" type="text" placeholder="' + db.credits + '"' + '/>' +
                                      '</div>' +
                                  '</div></div>',
        buttons: [
          {
            label: 'Commit Edit',
            cssClass: 'btn-success',
            action: function( dialog ) {
              let nm = $(".js-name").val().trim()    || c.name;
              let cr = $(".js-credits").val().trim() || c.credits;
              switch( type ) {
                case "certificate":
                        Certificates.update(  { _id: c._id  },
                                              { 
                                                $set: { "name": nm, "credits": cr }
                                              }); 
                        break;
              case "degree":
                      Diplomas.update(  { _id: c._id  },
                                        { 
                                          $set: { "name": nm, "credits": cr }
                                        });
                      break;
              }

              dialog.close();
            }
          },
          {
            label: 'Cancel Edit',
            cssClass: 'btn-danger',
            action: function( dialog ) {
              dialog.close();
            }        
          }]
        });
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK .JS-DELETE
   */
  'click .js-delete'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    /* ARE YOU SURE YOU WANT TO DELETE... */
    let idx = $( e.currentTarget ).data('id');
    let nm  = $( e.currentTarget ).data('name');
    let type = this.type;
    
    BootstrapDialog.show({
      title: this.type == "degree" ? "Delete Degree" : "Delete Certificate",
      message:  '<div class="pop-up-area students">' +
                  '<div class="popup-body">' + 
                    '<div class="row">' +
                      '<div class="col-sm-12">' +
                        '<strong>Are you sure you want to delete this ' + type + ' ?</strong>' +
                        '<div class="name">' +
                          '<span style="color:white;">' + nm + '</span>' +
                        '</div></div></div></div></div>',
      buttons: [{
              label: this.type == "degree" ? 'Delete Degree' : "Delete Certificate",
              cssClass: 'btn-danger',
              action: function( dialog ) {
                console.log(type);
                switch ( type ) {
                  case "certificate":
                    console.log(type);
                    Certifications.remove({ _id: idx});
                    break;
                  case "degree":
                    console.log(type);
                    Diplomas.remove({ _id: idx});
                    break;
                }
                dialog.close();
                
                //maybe some logic to remove this course from students currently taking it?
              }
        },
        {
            label: 'Cancel Delete',
            cssClass: 'btn-primary',
            action: function( dialog ) {
              dialog.close();
            }
        }]
    });
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK #DASHBOARD-PAGE
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault()
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
});
