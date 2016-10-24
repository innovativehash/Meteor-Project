import '../../../public/bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css';

import { Template }     from 'meteor/templating';


import '../../templates/admin/admin-advanced.html';


Template.adminAdvanced.onCreated(function(){
  //$("#cover").show();
  
  /*
   * BOOTSTRAP TOGGLE
   */
  $.getScript( '/bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js', function() {
    $('#abd').bootstrapToggle();
    $('#abn').bootstrapToggle();
    $('#all-students').bootstrapToggle();
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'Assign Courses:: bootstrap-toggle.min.js fail' );
  });
});


Template.adminAdvanced.onRendered(function(){
/*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  }); 
*/  
});


/*
 * EVENTS
 */
Template.adminAdvanced.events({
  
  /*
   * CLICK #CREDIT-OFF
   */
  'click #credit-off'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
		t.$("#credit-on").removeClass('active');
		t.$(e.currentTarget).addClass('active');
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK #CREDIT-ON
   */
  'click #credit-on'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();
    
		t.$("#credit-off").removeClass('active');
		t.$(e.currentTarget).addClass('active');  
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK .ADVANCE-TIME-BUTTON BUTTON
   */
  'click .advance-time-button button'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();
    
		t.$(".advance-time-button button:first-child").removeClass('active');
		t.$(".advance-time-button button:last-child").removeClass('active');
		t.$(e.currentTarget).toggleClass('active');  
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK #RESET-IMAGE
   */
  'click #reset-image'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
	   t.$('#logo-preview').attr('src', '/img/demo-logo.png');  
//-------------------------------------------------------------------
  },
  
});