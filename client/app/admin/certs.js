
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { Courses }      from '../../../both/collections/api/courses.js';
import { Certifications } from '../../../both/collections/api/certifications.js';

import '../../templates/admin/certs.html';


let certificate      = {}
  , count       = 0;

certificate.courses  = [];


function mapCount( s ) {
  switch( s ) {
    case 1:
      return 'certFirDrag';
    case 2:
      return 'certSecDrag';
    case 3:
      return 'certThrDrag';
    case 4:
      return 'certForDrag';
    case 5:
      return 'certFivDrag';
    case 6:
      return 'certSixDrag';
    case 7:
      return 'certSevDrag'
    default:
      return -1;
  }
}


/*
 * CREATED
 */
Template.certs.onCreated(function(){

  $( "#certificate-cover" ).show();

  /*
   * MULTI-SELECT AUTOCOMPLETE COMBOBOX
   */
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){

      $('#cert-find-course').select2({
        allowClear: true
      });

      $('#cert-find-course').on('select2:select', function (evt) {


         $('div.certificate-course ul').append(
            `
            <li id="${mapCount(++count)}" tabindex="-1">
              <span>
                <img id="deg-img-${count}" src="/img/icon-7.png" alt="" data-dt="" class="draggable">
              </span>
            </li>
            `
          );

          $( `#deg-img-${count}` ).draggable({  //count already incremented
            cursor: "move",
            helper: "clone"
          });

          let idx = $( "#cert-find-course" ).val();
          //let item = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];
          let item = Courses.find({ name: {$regex: idx  }}).fetch()[0];

          //need idx returned from search!!!
          //$('#cert-find-course').val('');
          //console.log( $('#certFirDrag').contents().eq(0).text().indexOf('Sample'));
          //console.log( $('#certFirDrag').text().indexOf('Sample'));

      if( count == 1 ) {
        if ( $( 'li#certFirDrag span' ).children().is( 'img' ) ) {
          if ( certificate && certificate.courses ) certificate.courses[0] = item;

          $( '#certFirDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#certFirDrag' ), item );
          $( '#certFirDrag' ).css( 'color', 'green' );
          $( '#certFirDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else if ( count == 2 ) {
        if ( $( 'li#certSecDrag span' ).children().is( 'img' ) ) {

          if( certificate && certificate.courses ) certificate.courses[1] = item;

          $( '#certSecDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#certSecDrag' ), item );
          $( '#certSecDrag' ).css( 'color', 'green' );
          $( '#certSecDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else  if ( count == 3 ) {
        if ( $( 'li#certThrDrag span' ).children().is( 'img' ) ) {
          if ( certificate && certificate.courses ) certificate.courses[2] = item;

          $( '#certThrDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#certThrDrag' ), item );
          $( '#certThrDrag' ).css( 'color', 'green' );
          $( '#certThrDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else if ( count == 4 ) {
        if ( $( 'li#certForDrag span' ).children().is( 'img' ) ) {
          if ( certificate && certificate.courses ) certificate.courses[3] = item;
          $( '#certForDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#certForDrag' ), item );
          $( '#certForDrag' ).css( 'color', 'green' );
          $( '#certForDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else  if ( count == 5 ) {
        if ( $( 'li#certFivDrag span' ).children().is( 'img' ) ) {
          if ( certificate && certificate.courses ) certificate.courses[4] = item;
          $( '#certFivDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#certFivDrag' ), item );
          $( '#certFivDrag' ).css( 'color', 'green' );
          $( '#certFivDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else if ( count == 6 ) {
        if ( $( 'li#certSixDrag span' ).children().is( 'img' ) ) {
          if ( certificate && certificate.courses ) certificate.courses[5] = item;
          $( '#certSixDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#certSixDrag' ), item );
          $( '#certSixDrag' ).css( 'color', 'green' );
          $( '#certSixDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else if ( count == 7 ) {
        if ( $('li#certSevDrag span').children().is('img') ) {
          if ( certificate && certificate.courses ) certificate.courses[6] = item;
          $( '#certSevDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#certSevDrag' ), item );
          $( '#certSevDrag' ).css( 'color', 'green' );
          $( '#certSevDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      }
          //unnecessary, but just because
          idx  = null;
          item = null;
      });

      Meteor.setTimeout(() => {
        $( '#cert-find-course' ).select2( "open" ); //.val(null).trigger('change.select2');
      }, 1000);
    });
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'CERTS:: load select2.js fail' );
  });



  /*
   * JQUERY-UI DRAG & DROP
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function(){
    /*
        $( ".draggable" ).draggable({
          cursor: "move",
          helper: "clone"
        });
    */
    $( '#drop1,#drop2, #drop3, #drop4, #drop5, #drop6, #drop7' ).droppable({
      drop: function( evt, ui ) {
        $(this).html( ui.draggable.data('dt'));
        $(this).css( 'border', '1px dashed blue' ).css( 'color', 'blue' );

        let text = $( ui.draggable[0].parentNode.parentNode );
        text.css( 'text-decoration', 'line-through' );
        $( text[0] ).find( 'span' ).remove()

        $( '#cert-find-course' ).select2( "val", "" );
        $( '#select2-cert-find-course-container' ).text('');
        $( '#cert-find-course' ).select2( "open" );
      }
    });

  //console.log('certificate:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'certificate:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------


});


/*
 * RENDERED
 */
Template.certs.onRendered(function(){

  $( '#certificate-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#certificate-cover" ).hide();
    $( ".certificate-area" ).fadeIn( 'slow' );
  });

});


/*
 * DESTROYED
 */
Template.certs.onDestroyed(function(){
  certificate = null;
});


/*
 * HELPERS
 */
Template.certs.helpers({

  courses: () =>
    Courses.find({ company_id: Meteor.user().profile.company_id}).fetch(),

});

/*
 * EVENTS
 */
Template.certs.events({

  /*
   * #ENTER-CERTIFICATE-NAME  ::(BLUR)::
   */
  'blur #enter-certificate-name'( e, t ) {
    e.preventDefault()
    e.stopImmediatePropagation();

    $( '#cName' ).text( $( '#enter-certificate-name' ).val() );
//-------------------------------------------------------------------
  },


  /*
   * .JS-CERTIFICATE-SAVE  ::(CLICK)::
   */
  'click .js-certificate-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    console.log( 'in save' );

    let credits_total = 0,
        ids           = [],
        c_id          = 1,
        course_name   = $( '#enter-certificate-name' ).val()
        exp_date      = $( '#enter-expiration-date' ).val();

    if ( certificate.courses.length <= 0) {
      Bert.alert( 'No Courses Selected!', 'danger');
      return;
    }

    if ( course_name == "" ) {
      Bert.alert( 'You Must Give the Certificate a Name!', 'danger' );
      return;
    }

    for ( let i = 0; i<certificate.courses.length; i++ ){
      credits_total += Number(certificate.courses[i].credits);
      ids[i]        = certificate.courses[i]._id;
    }

    Certifications.insert({
      name: course_name,
      courses: ids,
      credits: credits_total,
      icon: "/img/icon-6.png",
      company_id: c_id,
      type: "certificate",
      times_completed: 0,
      expiry_date: exp_date || ""
    });
    //console.log( UI._parentData() );
    //console.log( Blaze.currentView );
    //console.log( Template.degreesAndCerts.__helpers );//&& Template.degreesAndCerts.__helpers.HelperMap.setCS );
    Bert.alert( 'Certificate Created!', 'success', 'growl-top-right' );

    Meteor.setTimeout(function(){
      FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() });
    }, 1500);
//-------------------------------------------------------------------
  },



  /*
   * #DEGREE-CERTIFICATE-PAGE ::(CLICK)::
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE ::(CLICK)::
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },

});


/*
 * REPLACE TEXT NODE()
 */
function replaceTextNode( t, item ) {

  let textNode    = t.contents().first(); //$("#certFirDrag").contents().first();
  let replaceWith = `${item.name}`;
  textNode.replaceWith( replaceWith );

  // Text node to process
  //let textNode = t.contents().first(); //$("#certFirDrag").contents().first();
  // break into parts
  //var parts = textNode.text().split(/\s/);
  // add new text to front
  //let replaceWith = `${item.name}`;
  // start after 3rd element since replaced text is: Sales Strategy xxx
  //for (var i =4; i < parts.length;i++) {
    //replaceWith += "  + parts[i]";
  //}
  // Replace the text node with the HTML we created
  //textNode.replaceWith(replaceWith);

}
