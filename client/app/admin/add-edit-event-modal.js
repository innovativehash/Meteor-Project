/*
 * @module addEditEventModel
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Events }      from '../../../both/collections/api/events.js';
import { Students }    from '../../../both/collections/api/students.js';
import { TimeZones }   from '../../../both/collections/api/timezones.js';

import '../../templates/admin/add-edit-event-modal.html';



let closeModal = () => {
  $( '#add-edit-event-modal' ).modal( 'hide' );
  $( '[name="timezone"]' ).trigger("change");
  $( '.modal-backdrop' ).fadeOut();
};


Template.addEditEventModal.onCreated( () => {

  //let template = Template.instance();
  //template.subscribe( 'students' );
  //---------------------------------------------------------------------------
  /*
   * SELECT2 INSTANTIATE
   */
  $.getScript( '/js/select2.min.js', function() {
    $(document).ready(function(){
      $( '[name="type"]' ).select2({
        allowClear:               true,
        tags:                     true,
        placeholder:              'Add Attendees...',
        minimumResultsForSearch:  Infinity
      });
      
      $( '[name="timezone"]' ).select2({
        allowClear:             true,
        tags:                   false,
        placeholder:            'TimeZone',
        minimumResultsForSearch: Infinity
      });
      
    });
    //console.log('addEditEventModal:: select2.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'addEditEventModal:: load select2.js fail' );
  });
  $( '[name="timezone"]' ).trigger("change");
  
});


Template.addEditEventModal.onRendered(function(){
  
});


Template.addEditEventModal.helpers({
  
  start() {
    try {
      let e = Events.findOne( Session.get('eventModal').event ).start;
      return moment(e).format('Y-MM-DD');
    } catch(e) {
      return;
    }
  },
  
  
  end() {
    try {
      let e = Events.findOne( Session.get('eventModal').event ).end;
      return moment(e).format('Y-MM-DD');
    } catch(e) {
      return;
    } 
  },
  
  
  timezones() {
    try {
      let tz    = TimeZones.find().fetch()[0].timezones
        , e     = Events.findOne( Session.get('eventModal').event ) && Events.findOne( Session.get('eventModal').event ).timezone
        , match = false;

      tz = _.chain(tz)
        .sortBy('group')
        .reverse()
        .sortBy('zone')
        .reverse()
        .value();
    
      //dt[0].zones[1].name

      for( let i = 0, len = tz.length; i < len; i++ ) { //number of objects
        for ( let j = 0, jlen = tz[i].zones.length; j < jlen; j++ ) { //number of zones
          //console.log( dt[i].zones[j].name );
          if ( tz[i].zones[j].name == e ) {
            match = true;
          }
        }
      }
      
      if (match ) $( '[name="timezone"]' ).val(`${e}`).trigger("change");
      return tz;
    } catch (e) {
      //console.log( e );
    } 
  },
  
  cntx() {
    try {
      let s   = Students.find({ company_id: Meteor.user().profile.company_id }).fetch()
        , evt = Events.findOne( Session.get( 'eventModal' ).event ) && Events.findOne( Session.get('eventModal').event ).students;
        
        if ( Session.get('eventModal').type !== 'edit' ) {
          return s;
        } else {
          for( let i = 0, len = s.length; i < len; i++ ) {
            if ( _.contains( evt, s[i]._id ) ) {
              s[i].match = true;
            }
          }

        return s;
      } 
    } catch (e) {
      //console.log( e );
      return;
    }
  },
  
  modalType( type ) {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === type;
    }
  },
  
  
  modalLabel() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return {
        button: eventModal.type  === 'edit' ? 'Edit' : 'Add',
        label:  eventModal.type  === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  
  
  /*
   * to help set the currently selected event type in the 
   * “Event Type” select box when editing an existing event 
   * (this will ensure that the selected option is the current value in the database).
   */
  selected( v1, v2 ) {
    return v1 === v2;
  },
  
  
  /* 
   * Once it has our Session variable, it decides what data to return the modal
   * via the {{event}} helper.
   *
   * (1) If we’re EDITING, we want to return the actual 
   *     event item in the database that’s being edited (remember, for the edit 
   *     event we pass the event’s _id value). 
   * (2) If we’re ADDING a new event, we want to take the clicked date and set
   *     it in both the “Event Starts” and “Event Ends” fields 
   *     (these are disabled, but confirm the date that was clicked). 
   *     We set the same date for both as we’re only supporting single-date 
   *     items in this snippet.
   */
  event() {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === 'edit'       ? 
          Events.findOne( eventModal.event )  : 
          {
            start:  eventModal.date,
            end:    eventModal.date
          };
    }//if
  }// event
  
});


/*
 * EVENT HANDLERS
 */
Template.addEditEventModal.events({
  'click .close'( e, t ) {
  
  },
  
  
  'submit form' ( event, template ) {
    event.preventDefault();

    let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'editEvent' : 'addEvent';
      
        let names   = template.$( '[name="type"]'   ).val()
          , nlen    = 0
          , s       = []
          , iid;

        if ( (names && names.length) && names != null ) {
          nlen = names.length;
        } else {
          Bert.alert( 'You must select a Student!', 'danger' );
          return;
        }
        
        /* 
         *    -------------------------------
         *    ADD OTHER SANITY CHECKS HERE 
         *    -------------------------------
         */
        
      let start_string  = template.find( '[name="start"]' ).value
        , end_string    = template.find( '[name="end"]'   ).value
        , start_time_string   = template.find( '[name="start-time"]' ).value
        , end_time_string = template.find( '[name="end-time"]' ).value
        
        , start_time_hours
        , end_time_hours
        , start_time_minutes
        , end_time_minutes
        
        , start_month
        , start_day
        , start_year
        , end_month
        , end_day
        , end_year
        
        , start_time_array
        , end_time_array
        , start_array
        , end_array;
      
      start_array = start_string.split('-');
      end_array   = end_string.split('-');
      start_time_array  = start_time_string.split(':');
      end_time_array = end_time_string.split(':');
      
      start_month = Number( start_array[1] ) - 1;
      start_day   = Number( start_array[2] );
      start_year  = Number( start_array[0] );
      
      end_month = Number ( end_array[1] ) - 1;
      end_day   = Number ( end_array[2] );
      end_year  = Number ( end_array[0] );
      
      start_time_hours    = Number( start_time_array[0] );
      start_time_minutes  = Number( start_time_array[1] );
      
      end_time_hours = Number( end_time_array[0] );
      end_time_minutes = Number( end_time_array[1] );

      start_array = end_array = start_time_array = end_time_array = null;
    
      //time_hours = time_hours > 12 ? time_hours - 12 : time_hours;
      
      eventItem  = {
        title:        template.find( '[name="title"]' ).value,
        start:        moment(new Date(start_year, start_month, start_day, start_time_hours, start_time_minutes))._d,
        end:          moment(new Date(end_year, end_month, end_day, end_time_hours, end_time_minutes))._d,
        students:     template.$(    '[name="type"]'  ).val(),
        location:     template.find( '[name="location"]' ).value,
        description:  template.find( '[name="description"]' ).value,
        startTime:    template.find( '[name="start-time"]' ).value,
        endTime:      template.find( '[name="end-time"]' ).value,
        timezone:     template.find( '[name="timezone"]' ).value
        //courses:    template.$(    '#t-courses'     ).val()
      };
        
      start_time_hours = start_time_minutes = end_time_hours = end_time_minutes = null;
      start_day = start_month = start_year = null;
      end_day = end_month = end_year = null;
        
      // CLEAR OUT THE FIELDS
      template.$( '[name="type"]' ).val(null).trigger("change");
      template.$( '[name="title"]').val('');
      template.$( '[name="timezone"]' ).val( null ).trigger( 'change' );
      template.$( '[name="startTime"]' ).val('');
      template.$( '[name="endTime"]' ).val('');
      template.$( '[name="location"]' ).val('');
      template.$( '[name="description"]' ).val('');
      template.$( '[name="start"]' ).val('');
      template.$( '[name="end"]' ).val('');
      template.$( '[name="start-time"]' ).val('');
      template.$( '[name="end-time"]' ).val('');
      //template.$( '#t-courses' ).val(null).trigger("change");
      
      /* ADD DATE/EVENT TO STUDENT CALENDAR */
      if ( submitType === 'editEvent' ) {
        eventItem._id   = eventModal.event;
      }
          
      Meteor.call( submitType, eventItem, ( error, rslt ) => {
        
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
          
        } else {
          
          iid = rslt;
          Bert.alert( `Event ${ eventModal.type }ed!`, 'success' );
          
          // GET THE STUDENTS ASSIGNED
          //o.record_id = iid;
          for( let i = 0; i < nlen; i++ ) {
            
            s[i] = Students.find({ _id: names[i] }).fetch()[0];
        
            Students.update({ _id: s[i]._id },{ $push:{ current_trainings: {link_id: iid}  } });
          } 
          closeModal();
        }
      });
   
  },
  
  
  'click .delete-event' ( event, template ) {
    let eventModal = Session.get( 'eventModal' );
    
    if ( confirm( 'Are you sure? This is permanent.' ) ) {
      
      Meteor.call( 'removeEvent', eventModal.event, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          Bert.alert( 'Event deleted!', 'success' );
          closeModal();
        }
      });
    }
  }
});