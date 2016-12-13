/*
 * @module studentTrainingCalendar
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Events } from '../../../both/collections/api/events.js';

import '../../templates/student/student-training-calendar.html';


let isPast = ( date ) => {
  let today = moment().format();
  return moment( today ).isAfter( date );
};



/*
 * CREATED
 */
Template.studentTrainingCalendar.onCreated( () => {
  //$('#cover').show();
  
  let template = Template.instance();
  template.subscribe( 'events' );
  //---------------------------------------------------------------------------
});



/*
 * RENDERED
 */
Template.studentTrainingCalendar.onRendered(function(){
  /*
  $( '#cover' ).delay( 500 ).fadeOut( 'slow', function() {
    $("#cover").hide();
    $( ".dashboard-header-area" ).fadeIn( 'slow' );
  });
  */
  
 /*
  * FULLCALENDAR
  */
  $( '#calendar' ).fullCalendar({

    // options and callbacks here
    events( start, end, timezone, callback ) {
      let data = Events.find().fetch().map( ( event ) => {
        event.editable = !isPast( event.start );
        return event;
      });

      if ( data ) {
        callback( data );
      }
    },
    
    
    /*
     * each element rendered to the calendar will pass through this method
     * and take on the appropriate formatting
     */
    eventRender(  event   /* actual event item on the calendar, NOT JS Event */, 
                  element /* the element where the item is being rendered as
                             a JQuery elem*/                                ) {
      element.find( '.fc-content' ).html(
        `<h4>${ event.title }</h4>
        `
      );
    },
    
    
    eventDrop( event, delta, revert ) {
      let date = event.start.format();
      if ( !isPast( date ) ) {
        let update = {
          _id:    event._id,
          start:  date,
          end:    date
        };

        Meteor.call( 'editEvent', update, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          }
        });
      } else {
        revert();
        Bert.alert( 'Sorry, you can\'t move items to the past!', 'danger' );
      }
    },
    
    
    /*
     * fired whenever we click on the actual day square in the calendar
     */
    dayClick( date ) {
      Session.set( 'eventModal', { type: 'add', date: date.format() } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    },
    
    
    /*
     * fired whenever we click directly on an event
     */
    eventClick( event /* literally the rendered event’s data,
                         returned from the event()            */ ) {
      Session.set( 'eventModal', { type: 'edit', event: event._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    }

  }); //fullcalendar
  
  Tracker.autorun( () => {
    Events.find().fetch();
    $( '#calendar' ).fullCalendar( 'refetchEvents' );
  });

});