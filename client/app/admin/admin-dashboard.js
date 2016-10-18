

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Students }     from '../../../both/collections/api/students.js';

import '../../templates/admin/admin-dashboard.html';


Template.registerHelper('not', function(obj){
  return !obj;
});


Template.adminDashboard.onCreated( function() {
  $('#cover').show();
});


Template.adminDashboard.onRendered( function() {
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
});


Template.adminDashboard.helpers({
 showAdminCreditRequests() {
   if ( Newsfeeds.find({ type: "CR" }).count() > 0 ) {
    return true;
   } else {
     return false;
   }
  },
});


Template.adminDashboard.events({

  'click #view-request-doc'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = t.$(e.currentTarget).data('id');
    let imgsrc = Newsfeeds.findOne({ _id: id}).file;
    let largeImage = document.createElement('img');
    largeImage.style.display = 'block';
    largeImage.style.width=200+"px";
    largeImage.style.height=200+"px";
    largeImage.src = imgsrc;
    //let url= imgsrc;
    window.open(imgsrc,'Image','width=500,height=500,resizable=0, location=0');
  }
/*
    'keypress #js-student-search': function(event){

    if ( event.which == 13){

      event.preventDefault();

      let idx = $("#js-student-search").val(),
          item = Students.find({ _id: idx  }, { limit:1 }).fetch()[0];
      return item;
    }
  },
*/
});


