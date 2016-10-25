

import { Courses }    from '../../../both/collections/api/courses.js';

import '../../templates/admin/library.html';

//import '../../../public/bower_components/bootstrap3-dialog/dist/css/bootstrap-dialog.min.css';


/*
 * CREATED
 */
Template.library.onCreated(function() {
  
  $("#library-cover").show();
  
  /*
   * BOOTSTRAP3-DIALOG
   */
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('Library:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Library:: load bootstrap-dialog.min.js fail' );
//-------------------------------------------------------------------
  }); 
  
  
/*
 * SELECT2
 * multi-select combo box
 */
  $.getScript('/js/select2.min.js', function() {
    $(document).ready(function(){
      $('#search-courses').select2({
        allowClear: true
      });
    });
    //console.log('library:: chosen,jquery.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'library:: load select2.js fail' );
//-------------------------------------------------------------------
  });

});


/*
 * RENDERED
 */
Template.library.onRendered(function(){

  $( '#library-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#library-cover").hide();
    $( ".filter-buttons" ).fadeIn( 'slow' );
  });  
});


/*
 * DESTROYED
 */
Template.library.onDestroyed(function(){
  Session.set( 'searchTerm', null );    
});


/*
 * HELPERS
 */
Template.library.helpers({
   courses: () => {
      let discard = []
        , c = []
        , cids = [];
        
      let own = Courses.find({ company_id: Meteor.user().profile.company_id }).fetch();
      own.forEach(function(el){
        cids.push( el.cid );
      });

      let pub = Courses.find( {$and: [ {public:true},{company_id:{$ne: Meteor.user().profile.company_id}}]}, { _id:1, name:1, credits:1, icon:1, cid:1 }).fetch();

      /* Cycle through pub, and cherry pick out where pub[i].cid == own.cid */
      for( let ii = 0, ilen = pub.length; ii < ilen; ii++ ) {
        for( let i = 0, len = cids.length; i < len; i++ ) {
          if( pub[ii].cid == cids[i] ) discard.push( ii ); //place matches in discard pile
        }
      }    

    let ought = 0; // need ought to keep delivery array 0 indexed
    for( let i = 0, len = pub.length; i < len; i++ ) {
      if ( discard.includes(i)) continue; //if in discard pile, move on to next
      c[ought++] = pub[i];  //not in discard pile, add it to delivery array
    }

    //c = pub.slice(2);
    return c;
   }
});


/*
 * EVENTS
 */
Template.library.events({
  
  /*
   * CLICK #COURSES-PAGE
   */
  'click #courses-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'admin-courses', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK #DASHBOARD-PAGE
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
  
  
  /*
   * CHANGE #SEARCH-COURSES
   */
  'change #search-courses'( e, t ) {
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
    * CLICK #ADD
    */
   'click #add'( e, t ) {
     e.preventDefault();
     e.stopImmediatePropagation();
     
     let idx = $(e.currentTarget).data('id');
     let nm  = $(e.currentTarget).data('name');
     
     idx = String(idx);
     let c = Courses.findOne({ _id: idx });

      BootstrapDialog.show({
        title: "Add Course",
        message:  '<div class="pop-up-area students">' +
                    '<div class="popup-body">' + 
                      '<div class="row">' +
                        '<div class="col-sm-6">' +
                            '<p>Add the following course?<br /><span style="color:white;">"' + nm + '"</span></p>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                  '</div>',
        buttons: [
          {
            label: 'Commit Edit',
            cssClass: 'btn-success',
            action: function( dialog ) {
              /* ASSIGN PUBLIC COURSE TO THIS CUSTOMER'S LIBRARY */
                            Courses.insert({company_id:Meteor.user().profile.company_id, 
                              cid: c.cid, name: c.name, "icon": "/img/icon-4.png",
                              credits: c.credits, public: false, times_completed:0});
              Bert.alert('Class added to your courses', 'success', 'growl-top-right');
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

});