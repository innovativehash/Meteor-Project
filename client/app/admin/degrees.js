
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Courses }      from '../../../both/collections/api/courses.js';
import { Diplomas }     from '../../../both/collections/api/diplomas.js';

import '../../templates/admin/degrees.html';


let degree      = {}
  , count       = 0;

degree.courses  = [];


function mapCount( s ) {
  switch( s ) {
    case 1:
      return 'firDrag';
    case 2:
      return 'secDrag';
    case 3:
      return 'thrDrag';
    case 4:
      return 'fouDrag';
    case 5:
      return 'fivDrag';
    case 6:
      return 'sixDrag';
    case 7:
      return 'sevDrag'
    default:
      return -1;
  }
}


/*
 * CREATED
 */
Template.degrees.onCreated(function() {

  $( "#degree-cover" ).show();

  /*
   * MULTI-SELECT AUTOCOMPLETE COMBOBOX
   */
  $.getScript( '/js/select2.min.js', function() {
    $( document ).ready(function(){

      $( '#deg-find-course' ).select2({
        allowClear: true
      });

      $( '#deg-find-course' ).on( 'select2:select', function (evt){

         $( 'div.certificate-course ul' ).append(
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

          let idx = $( "#deg-find-course" ).val();
          //let item = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];
          let item = Courses.find({ name: {$regex: idx  }}).fetch()[0];

          //need idx returned from search!!!
          //$('#deg-find-course').val('');
          //console.log( $('#firDrag').contents().eq(0).text().indexOf('Sample'));
          //console.log( $('#firDrag').text().indexOf('Sample'));

      if( count == 1 ) {
        if ( $( 'li#firDrag span' ).children().is( 'img' ) ) {

          if ( degree && degree.courses ) degree.courses[0] = item;

          $( '#firDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#firDrag' ), item );
          $( '#firDrag' ).css( 'color', 'green' );
          $( '#firDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else if ( count == 2 ) {
        if ( $( 'li#secDrag span' ).children().is( 'img' ) ) {

          if( degree && degree.courses ) degree.courses[1] = item;

          $( '#secDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#secDrag' ), item );
          $( '#secDrag' ).css( 'color', 'green' );
          $( '#secDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else  if ( count == 3 ) {
        if ( $( 'li#thrDrag span' ).children().is( 'img' ) ) {
          if ( degree && degree.courses ) degree.courses[2] = item;

          $( '#thrDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#thrDrag' ), item );
          $( '#thrDrag' ).css( 'color', 'green' );
          $( '#thrDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else if ( count == 4 ) {
        if ( $( 'li#fouDrag span' ).children().is( 'img' ) ) {
          if ( degree && degree.courses ) degree.courses[3] = item;
          $( '#fouDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#fouDrag' ), item );
          $( '#fouDrag' ).css( 'color', 'green' );
          $( '#fouDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else  if ( count == 5 ) {
        if ( $( 'li#fivDrag span' ).children().is( 'img' ) ) {
          if ( degree && degree.courses ) degree.courses[4] = item;
          $( '#fivDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#fivDrag' ), item );
          $( '#fivDrag' ).css( 'color', 'green' );
          $( '#fivDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else if ( count == 6 ) {
        if ( $( 'li#sixDrag span' ).children().is( 'img' ) ) {
          if ( degree && degree.courses ) degree.courses[5] = item;
          $( '#sixDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#sixDrag' ), item );
          $( '#sixDrag' ).css( 'color', 'green' );
          $( '#sixDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      } else if ( count == 7 ) {
        if ( $( 'li#sevDrag span' ).children().is( 'img' ) ) {
          if ( degree && degree.courses ) degree.courses[6] = item;
          $( '#sevDrag span img' ).data( 'dt', item.name );
          replaceTextNode( $( '#sevDrag' ), item );
          $( '#sevDrag' ).css( 'color', 'green' );
          $( '#sevDrag span img' ).css( 'cursor', 'move' ).effect( "highlight", {}, 3000 );
        }
      }
          //unnecessary, but just because
          idx  = null;
          item = null;
      });

      Meteor.setTimeout(() => {
        $( '#deg-find-course' ).select2( "open" ); //.val(null).trigger('change.select2');
      }, 1000);
    });
    //console.log('Assign Courses:: chosen,jquery.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'DEGREES:: load select2.js fail' );
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

        $( '#deg-find-course' ).select2( "val", "" );
        $( '#select2-deg-find-course-container' ).text('');
        $( '#deg-find-course' ).select2( "open" );
      }
    });

  //console.log('degree:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'degree:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------

});


/*
 * RENDERED
 */
Template.degrees.onRendered(function(){

  $( '#degree-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#degree-cover" ).hide();
    $( ".certificate-area" ).fadeIn( 'slow' );
  });

});



/*
 * DESTROYED
 */
Template.degrees.onDestroyed(function(){
  degree = null;
});


/*
 * HELPERS
 */
Template.degrees.helpers({

  courses: () =>
    Courses.find({ company_id: Meteor.user().profile.company_id }).fetch(),

});



/*
 * EVENTS
 */
Template.degrees.events({

  /*
   * #ENTER-DEGREE-NAME  ::(BLUR)::
   */
  'blur #enter-degree-name'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $( '#dName' ).text( $( '#enter-degree-name' ).val() );
//-------------------------------------------------------------------
  },



  /*
   * .JS-DEGREE-SAVE ::(CLICK)::
   */
  'click .js-degree-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let credits_total = 0,
        ids           = [],
        course_name   = $( '#enter-degree-name' ).val();

    if ( degree && degree.courses && degree.courses.length <= 0) {
      Bert.alert( 'No Courses Selected!', 'danger' );
      return;
    }

    if ( course_name == "" ) {
      Bert.alert( 'You Must Give the Degree a Name!', 'danger' );
      return;
    }

    for ( let i = 0; i<degree.courses.length; i++ ){
      credits_total += Number( degree.courses[i].credits );
      ids[i]        = degree.courses[i]._id;
    }

    Diplomas.insert({
      name: course_name,
      courses: ids,
      credits: credits_total,
      icon: "/img/icon-5.png",
      company_id: 1,
      type: "degree",
      times_completed: 0
    });

    Bert.alert( 'Degree Created!', 'success', 'growl-top-right' );

    Meteor.setTimeout(function(){
      FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() });
    }, 1500);
//-------------------------------------------------------------------
  },



  /*
   * #FC  ::(CLICK)::
   */
  'click #fc'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
//-------------------------------------------------------------------
  },


  /*
   * #DEGREE-CERTIFICATE-PAGE  ::(CLICK)::
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() } );
//-------------------------------------------------------------------
  },


  /*
   * #DASHBOARD-PAGE  ::(CLICK)::
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

  let textNode    = t.contents().first();
  let replaceWith = `${item.name}`;
  textNode.replaceWith( replaceWith );

  // Text node to process
  //let textNode = t.contents().first(); //$("#firDrag").contents().first();
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