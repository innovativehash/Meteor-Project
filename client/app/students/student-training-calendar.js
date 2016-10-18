import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import '../../../public/bower_components/bootstrap3-dialog/dist/css/bootstrap-dialog.min.css';
import '../../../public/bower_components/fullcalendar/dist/fullcalendar.min.css';
import '../../templates/student/student-training-calendar.html';



/**
 * CREATED
 */
Template.studentTrainingCalendar.onCreated( function() {  
  $('#cover').show();
  
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('studentDashboard:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'load bootstrap-dialog.min.js fail' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  }); 


   $.getScript( '/bower_components/fullcalendar/dist/fullcalendar.min.js', function() {
    //console.log('studentDashboard:: fullcalendar.js loaded...' );
    $('#calendar').fullCalendar({
   
      // put your options and callbacks here
      events: [
                {
                    title  : 'Training Event',
                    start  : '2016-09-16',
                    description: 'In house, meeting room A.  Corporate Kum-bay-yah'
                },
                {
                    title  : 'Training Event',
                    start  : '2016-09-19',
                    end    : '2016-09-20',
                    description: 'In house, concourse.  "I\'m Special, you\'re Special!"'
                },
                {
                    title  : 'Training Event',
                    start  : '2016-09-21T12:30:00',
                    description: 'Team Spirit Fire Walk, Mosconi Center',
                    allDay : false // will make the time show
                }
              ],
      eventClick: function( calEvent, jsEvent, view ) {
                      BootstrapDialog.show({
                        title: calEvent.title,
                        message:  'On ' 
                                  + moment(calEvent.start).format( 'ddd, hA' ) 
                                  + '\n\n' 
                                  + calEvent.description,
                        buttons: [{
                          label: 'Ok',
                          cssClass: 'btn-success',
                          action: function(dialog) {
                            dialog.close();
                          }
                        }]
                      });
                      /*
                        alert('Event: ' + );
                        alert('Day/Time: ' + moment(calEvent.start).format('ddd, hA') );
                        alert('Description: ' + calEvent.description );
                      */
                        //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                        //alert('View: ' + view.name);

                        // change the border color just for fun
                        $(this).css('border-color', 'red');
      }
    })
    //Session.set('calendarConnectReady', true);
      //console.log( 'calendarConnectReady: ' + Session.get('calendarConnectReady'));
  }).fail( function( jqxhr, settings, exception ) {
    //console.log( 'load calendar failed' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  }); 

});



/**
 * RENDERED
 */
Template.studentTrainingCalendar.onRendered(function(){
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });  
});