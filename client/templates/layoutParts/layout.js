

  import '../../../public/css/normalize.css';
  import '../../../public/css/common.css';
  import '../../../public/css/style.css';
  import '../../../public/css/select2.min.css';
  import '../../../public/css/bootstrap-select.min.css';
  import '../../../public/css/responsive.css';
  import '../../../public/bower_components/ekko-lightbox/dist/ekko-lightbox.min.css';
  import '../../../public/css/owl.carousel.css';
  
  import './layout.html';
Template.layout.onCreated( function() {

    /*
     * SCRIPTS
     */
    $.getScript( '/bower_components/ekko-lightbox/dist/ekko-lightbox.min.js', function() {
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
});
    }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: load ekko-lightbox.min.js failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });

//-------------------------------------------------------------------  
  
});