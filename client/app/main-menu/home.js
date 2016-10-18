import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

//import { Blaze } from 'meteor/blaze'
import { Students }     from '../../../both/collections/api/students.js';

import '../../templates/home/home.html';


Template.home.onCreated(function homeOnCreated() {
  
  $("#cover").show();
/*
    $.getScript('/js/vendor/jq/jquery-1.11.3.min.js', function(){
      //console.log('home:: jQuery-1.11.3 loaded...');
    }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: load jquery-1.11.13 failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
*/
    $.getScript('/js/jquery.prettyPhoto.js', function() {
      //console.log( 'home:: jquery.prettyPhoto.js loaded...' );
      //Video
      $("a[rel^='prettyPhoto']").prettyPhoto({
          deeplinking: false,
          social_tools: false,
          allow_resize: true,
          default_width: 700,
          default_height: 444,
          horizontal_padding: 20
      }); 
    }).fail( function( jqxhr, settings, exception ) {
      console.log( 'home:: load jquery.prettyPhoto.js failed' );
      //console.log( 'jqxhr ' + jqxhr );
      //console.log( 'settings ' + settings );
      //console.log( 'exception: ' + exception );
  });


    $.getScript('/js/owl.carousel.min.js', function(){
      //console.log( 'home:: owl.carousel.min.js loaded' );
      // Slider
      $(".slider-area").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        dots: false,
        nav: true,
        navText: ['<img src="img/slider-arrow-1.png" alt="" />','<img src="img/slider-arrow-2.png" alt="" />'],
        navSpeed: 500,
        autoplaySpeed: 500,
        autoplayTimeout: 7000
      });

      //Sponsor 
      $(".sponsor-list ul").owlCarousel({
        responsive: {
          0: {
            items: 2
          },
          480: {
            items: 3
          },
          768: {
            items: 4
          },
          991: {
            items: 6
          }
        },
        dots: false,
        nav: true,
        navText: ['<img src="img/arrow-left.png" alt="" />','<img src="img/arrow-right.png" alt="" />'],
        loop: true,
        autoplay: true
      });
    }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: owl.carousel.min.js failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });

/*
  $.getScript('/js/vendor/bootstrap-select.min.js', function(){
      console.log( 'home:: bootstrap-select.min.js loaded...' );
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: bootstrap-select.min.js failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
*/

    $.getScript('/js/select2.min.js', function(){
      //console.log( 'home:: select2.min.js loaded' );
    }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: select2.min.js failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });

    $.getScript('/js/scripts.js', function() {
      //Session.set('connectReady', true);
      //console.log('home:: scripts.js loaded');
    }).fail( function(jqxhr, settings, exception ) {
    console.log( 'home:: load scripts.js failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  }); 


});


/**
 * RENDERED
 */
Template.home.onRendered(function() {
      $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
        $("#cover").hide();
        $( ".slider-area" ).fadeIn( 'slow' );
      });
   //$("#cover").hide();
});


/**
 * HELPERS
 */
Template.home.helpers({
  ready() {
  },
});

