
import { Template }     from 'meteor/templating';


import '../../templates/admin/admin-advanced.html';


Template.adminAdvanced.onCreated(function(){
  $("#cover").show();
});


Template.adminAdvanced.onRendered(function(){

  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  }); 
  
});


Template.adminAdvanced.onDestroyed(function(){
  
});


Template.adminAdvanced.helpers({
  
});



Template.adminAdvanced.events({
  'click #credit-off'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
		$("#credit-on").removeClass('active');
		$(e.currentTarget).addClass('active');
  },
  
  'click #credit-on'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();
    
		$("#credit-off").removeClass('active');
		$(e.currentTarget).addClass('active');    
  },
  
  'click .advance-time-button button'( e, t ){
    e.preventDefault();
    e.stopImmediatePropagation();
    
		$(".advance-time-button button:first-child").removeClass('active');
		$(".advance-time-button button:last-child").removeClass('active');
		$(e.currentTarget).toggleClass('active');    
  },
  
  'click #reset-image'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
	   $('#logo-preview').attr('src', '/img/demo-logo.png');    
  }
  
});