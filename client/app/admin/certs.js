
import { Template }       from 'meteor/templating';
import { ReactiveVar }    from 'meteor/reactive-var';

import { Courses }        from '../../../both/collections/api/courses.js';
import { Certifications } from '../../../both/collections/api/certifications.js';

import '../../templates/admin/certs.html';

let certificate     = {};
certificate.courses = [];

/*
 * CREATED
 */
Template.certs.onCreated(function(){
  
  $("#certificate-cover").show();
  
  /*
   * JQUERY-UI
   */
  $.getScript('/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {
    //console.log('certificate:: jquery-ui.min.js loaded...');
    $( ".draggable" ).draggable({
      cursor: "move",
      helper: "clone"
    });
    
    $('#drop1,#drop2, #drop3, #drop4, #drop5, #drop6, #drop7').droppable({
      drop: function( evt, ui ) {
        $(this).html( ui.draggable.data('dt') );
        $(this).css('border', '1px dashed blue').css('color', 'blue');
      }
    });
  
    $( "#cert-find-course" ).autocomplete({
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
                    $( '#cert-find-course' ).val( ui.item.name ); //id
                    return false;
                  },
                  
      select:     function( event, ui ){
                    $( '#cert-find-course' ).val( ui.item.name ); //id
                    return false;
                  }
    })
    .autocomplete( "instance" )._renderItem =
          function( ul, item ) {
            return $( "<li>" )
            /*
              .append(  "<a><strong id = 'name'>"       +
                        item.name                       +
                        "</strong><br /><em id = 'id'>" +
                        item.id                         +
                        "</em></a>" )
            */
              .append(  "<a><strong id = 'name'>"       +
                        item.name                       +
                        "</strong><br />"               +
                        "</a>" )
              .appendTo( ul );
      };
    
        
      function searchTerms() {
      let arr     = [], 
          result  = [],
          str = eval(Session.get('searchTerm' )); //harden this!!!
      arr = Courses.find( { name: {$regex: str  }}, { limit:50 } ).fetch();
      for ( var i = 0; i < arr.length; i++ ) { 
        result.push({ name: arr[i].name }); //, id: arr[i]._id });
      }
      //console.log('searchTerms result ' + result );
      return result; 
    }
  //console.log('certificate:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'degree:: load jquery-ui.min.js fail' );
  });
//-------------------------------------------------------------------
});


/*
 * RENDERED
 */
Template.certs.onRendered(function(){

  $( '#certificate-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#certificate-cover").hide();
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
 * EVENTS
 */
Template.certs.events({
  
  /*
   * BLUR #ENTER-CERTIFICATE-NAME
   */
  'blur #enter-certificate-name'( e, t ) {
    e.preventDefault()
    e.stopImmediatePropagation();
    
    $('#cName').text( $('#enter-certificate-name').val() );
//-------------------------------------------------------------------
  },
  
  
  /*
   * CLICK .JS-CERTIFICATE-SAVE
   */
  'click .js-certificate-save'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let credits_total = 0,
        ids           = [],
        c_id          = 1,
        course_name   = $('#enter-certificate-name').val()
        exp_date      = $('#enter-expiration-date').val();
        
    if ( certificate.courses.length <= 0) {
      console.log( 'No courses selected' );
      return;
    }
    
    if ( course_name == "" ) {
      console.log( 'Must give certificate a name' );
      return;
    }
    
    for ( let i = 0; i<certificate.courses.length; i++ ){
      credits_total += Number(certificate.courses[i].credits);
      ids[i] = certificate.courses[i]._id;
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
    FlowRouter.go( 'admin-degrees-and-certifications', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },
  
  
  /*
   * KEYPRESS #FIND-COURSE
   */
  'keypress #cert-find-course': function( e, t ){
   
    if ( event.which === 13){
      event.preventDefault();
      //event.stopImmediatePropagation();
      
      let idx = t.$("#cert-find-course").val();
      
      //let item = Courses.find({ _id: currIdx  }, { limit:1 }).fetch()[0];
      let item = Courses.find({ name: {$regex: idx  }}).fetch()[0];
      
      t.$('#cert-find-course').val('');
      
      if ( t.$('#firDrag').text().indexOf(' ') == 0 ) {
        certificate.courses[0] = item;
        t.$('#firDrag span img').data('dt', item.name);
        replaceTextNode( t.$('#firDrag'), item );
        t.$('#firDrag').css('color', 'green');
        t.$('#firDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      } 
      else if ( t.$('#secDrag').text().indexOf(' ') == 0 ) {
        certificate.courses[1] = item;
        t.$('#secDrag span img').data('dt', item.name);
        replaceTextNode( t.$('#secDrag'), item );
        t.$('#secDrag').css('color', 'green');
        t.$('#secDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( t.$('#thrDrag').text().indexOf(' ') == 0 ) {
        certificate.courses[2] = item;
        t.$('#thrDrag span img').data('dt', item.name);
        replaceTextNode( t.$('#thrDrag'), item );
        t.$('#thrDrag').css('color', 'green');
        t.$('#thrDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( t.$('#fouDrag').text().indexOf(' ') == 0 ) {
        certificate.courses[3] = item;
        t.$('#fouDrag span img').data('dt', item.name);
        replaceTextNode( t.$('#fouDrag'), item );
        t.$('#fouDrag').css('color', 'green');
        t.$('#fouDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( t.$('#fivDrag').text().indexOf(' ') == 0 ) {
        certificate.courses[4] = item;
        t.$('#fivDrag span img').data('dt', item.name);
        replaceTextNode( t.$('#fivDrag'), item );
        t.$('#fivDrag').css('color', 'green');
        t.$('#fivDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( t.$('#sixDrag').text().indexOf(' ') == 0 ) {
        certificate.courses[5] = item;
        t.$('#sixDrag span img').data('dt', item.name);
        replaceTextNode( t.$('#sixDrag'), item );
        t.$('#sixDrag').css('color', 'green');
        t.$('#sixDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
      else if ( t.$('#sevDrag').text().indexOf(' ') == 0 ) {
        certificate.courses[6] = item;
        t.$('#sevDrag span img').data('dt', item.name);
        replaceTextNode( t.$('#sevDrag'), item );
        t.$('#sevDrag').css('color', 'green');
        t.$('#sevDrag span img').css('cursor', 'move').effect("highlight", {}, 3000);
      }
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
  
  let textNode    = t.contents().first(); //$("#firDrag").contents().first();
  let replaceWith = `${item.name}`;
  textNode.replaceWith(replaceWith);

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