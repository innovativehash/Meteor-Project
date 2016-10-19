
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Courses }      from '../../../both/collections/api/courses.js';
import { Diplomas }      from '../../../both/collections/api/diplomas.js';

import '../../templates/admin/degrees.html';


let degree      = {};
degree.courses  = [];

/*
 * CREATED
 */
Template.degrees.onCreated(function() {
  
  $("#degree-cover").show();
  
  /*
   * JQUERY-UI
   */
  $.getScript('/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {
    
    $( ".draggable" ).draggable({
      cursor: "move",
      helper: "clone"
    });
  
    $('#drop1,#drop2, #drop3, #drop4, #drop5, #drop6, #drop7').droppable({
      drop: function( evt, ui ) {
        $(this).html( ui.draggable.data('dt'));
        $(this).css('border', '1px dashed blue').css('color', 'blue');
      }
    });
  
    $( "#find-course" ).autocomplete({
    minLength:3,
    delay:100,
  
    source: function( request, response ){
      let rslt  = [],
          arr   = [],
          re    = '/^' + request.term + '/i';
          Session.set( 'searchTerm', re );
          rslt  = searchTerms();
      
      response( $.map( rslt, function( value, key ){
          return value;//{
          //   label: value,
          //   value: key
          //};
      }));
    },
    focus:      function( event, ui ) {
                    $( '#find-course' ).val( ui.item.id );
                    return false;
                  },
                  
      select:     function( event, ui ){
                    $( '#find-course' ).val( ui.item.id );
                    return false;
                  }
    })
    .autocomplete( "instance" )._renderItem =
          function( ul, item ) {
            return $( "<li>" )
              .append(  "<a><strong id = 'name'>"       +
                        item.name                       +
                        "</strong><br /><em id = 'id'>" +
                        item.id                         +
                        "</em></a>" )
              .appendTo( ul );
      };
    
        
      function searchTerms() {
      let arr     = [], 
          result  = [],
          str = eval(Session.get('searchTerm' )); //harden this!!!
      arr = Courses.find( { name: {$regex: str  }}, { limit:50 } ).fetch();
      for ( var i = 0; i < arr.length; i++ ) { 
        result.push({ name: arr[i].name, id: arr[i]._id });
      }
      return result; 
    }
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
    $("#degree-cover").hide();
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
 * EVENTS
 */
Template.degrees.events({

  /*
   * BLUR #ENTER-DEGREE-NAME
   */
  'blur #enter-degree-name'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    $('#dName').text( $('#enter-degree-name').val() );
//-------------------------------------------------------------------
  },

  
  /*
   * CLICK .JS-DEGREE-SAVE
   */
  'click .js-degree-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let credits_total = 0,
        ids = [],
        course_name = $('#enter-degree-name').val();
        
    if ( degree.courses.length <= 0) {
      console.log( 'No courses selected' );
      return;
    }
    
    if ( course_name == "" ) {
      console.log( 'Must give degree a name' );
      return;
    }
    
    for ( let i = 0; i<degree.courses.length; i++ ){
      credits_total += Number(degree.courses[i].credits);
      ids[i] = degree.courses[i]._id;
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
    
    Session.set("doc", "degreeCertificate");
//-------------------------------------------------------------------
  },
  

  /*
   * KEYPRESS #FIND-COURSE
   */
  'keypress #find-course': function(event){
    event.preventDefault();
    event.stopImmediatePropagation();
    
    if ( event.which == 13 ) {
      event.preventDefault();
      
      let idx = $("#find-course").val(), 
          item = Courses.find({ _id: idx  }, { limit:1 }).fetch()[0];

      //console.log( $('#firDrag').contents().eq(0).text().indexOf('Sample'));
      //console.log( $('#firDrag').text().indexOf('Sample'));
    
      
      if ( $('#firDrag').text().indexOf('Sample') == 0 ) {
        degree.courses[0] = item;
        $('#firDrag span img').data('dt', item.name);
        replaceTextNode( $('#firDrag'), item );
        $('#firDrag').css('color', 'green');
        $('#firDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      } 
      else if ( $('#secDrag').text().indexOf('Sample') == 0 ) {
        degree.courses[1] = item;
        $('#secDrag span img').data('dt', item.name);
        replaceTextNode( $('#secDrag'), item );
        $('#secDrag').css('color', 'green');
        $('#secDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( $('#thrDrag').text().indexOf('Sample') == 0 ) {
        degree.courses[2] = item;
        $('#thrDrag span img').data('dt', item.name);
        replaceTextNode( $('#thrDrag'), item );
        $('#thrDrag').css('color', 'green');
        $('#thrDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( $('#fouDrag').text().indexOf('Sample') == 0 ) {
        degree.courses[3] = item;
        $('#fouDrag span img').data('dt', item.name);
        replaceTextNode( $('#fouDrag'), item );
        $('#fouDrag').css('color', 'green');
        $('#fouDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( $('#fivDrag').text().indexOf('Sample') == 0 ) {
        degree.courses[4] = item;
        $('#fivDrag span img').data('dt', item.name);
        replaceTextNode( $('#fivDrag'), item );
        $('#fivDrag').css('color', 'green');
        $('#fivDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( $('#sixDrag').text().indexOf('Sample') == 0 ) {
        degree.courses[5] = item;
        $('#sixDrag span img').data('dt', item.name);
        replaceTextNode( $('#sixDrag'), item );
        $('#sixDrag').css('color', 'green');
        $('#sixDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( $('#sevDrag').text().indexOf('Sample') == 0 ) {
        degree.courses[6] = item;
        $('#sevDrag span img').data('dt', item.name);
        replaceTextNode( $('#sevDrag'), item );
        $('#sevDrag').css('color', 'green');
        $('#sevDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      //unnecessary, but just because
      idx  = null;
      item = null;
    }
//-------------------------------------------------------------------
  },
  

  /*
   * CLICK #FC
   */
  'click #fc'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
//-------------------------------------------------------------------
  },
  

  /*
   * CLICK #DEGREE-CERTIFICATE-PAGE
   */
  'click #degree-certificate-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() });
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