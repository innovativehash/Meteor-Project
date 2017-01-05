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
      
      //$( '[name="type"]').prop( 'disabled', true );
/*      
      $( '#t-courses' ).select2({
        allowClear:               true,
        tags:                     true,
        placeholder:              'choose...',
        minimumResultsForSearch:  Infinity
      });
*/
    });
    //console.log('addEditEventModal:: select2.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'addEditEventModal:: load select2.js fail' );
  });
  
  
});


Template.addEditEventModal.onRendered(function(){
  
});



Template.addEditEventModal.helpers({
  
  timezones() {
    try {
      let tz = TimeZones.find().fetch()[0].timezones
        , dt;

      dt = _(tz).chain()
        .sortBy('group')
        .reverse()
        .sortBy('value')
        .reverse()
        .value();

      return dt;
    } catch (e) {
      //console.log( e );
    } 
  },
  
  cntx() {
    try {
      //if ( Session.get( 'dc' ) == 'students' ) {
        
        return Students.find({ company_id: Meteor.user().profile.company_id }).fetch();
        
      //} else if ( Session.get( 'dc' ) == 'departments' ) {
        
        //return Departments.find({ company_id: Meteor.user().profile.company_id }).fetch();
        
      //}
    } catch (e) {
      //console.log( e );
      return;
    }
  },
/*  
  courses() {
    try {
      return Courses.find({ 
                            company_id: Meteor.user().profile.company_id, 
                            approved:true, creator_id: Meteor.userId() 
                         }).fetch();
    } catch (e) {
      //console.log( e );
      return;
    }
  },
*/
  
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
  
  /*
   * SET UP SEARCH DIALOG, IF NEEDED
   */
/*
  'click input[name="s_type_radio"]'( event, template ) {
    //$( 'input[name="s_type_radio"]:checked').val();
    
    let radio = $(event.currentTarget).val();
    
    if ( radio == 'all_students' ) {
      
      $( '[name="type"]' ).prop( 'disabled', true );
      
    } else if ( radio == 'stu_names' ) {
      
      $( '[name="type"]' ).prop( 'disabled', false );
      
      Session.set( 'dc', 'students');
      
    } else if ( radio == 'departments' ) {
      
      $( '[name="type"]' ).prop( 'disabled', false );
      
      Session.set( 'dc', 'departments' );
    }
  },
*/ 
  
  'submit form' ( event, template ) {
    event.preventDefault();

    let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'editEvent' : 'addEvent';
        //radio      = $( 'input[name="s_type_radio"]:checked' ).val();

      /*event record moved from here*/

    /*
     * ADD TO STUDENT'S ASSIGNED COURSES
     */
     
    /*
    switch ( radio ) {
      
      case 'all_students':
        let c = [],
            s = [],
            slen,
            courses = template.$( '#t-courses' ).val(),
            clen    = courses.length,
            stu_arr = [];
            
        
        // GET ALL STUDENTS IN THIS COMPANY
        s     = Students.find({ company_id: Meteor.user().profile.company_id }).fetch();
        slen  = s.length;
        
        // GET ALL ASSIGNED COURSES
        for( let i = 0; i < clen; i++ ) {
          c[i] = Courses.find({ _id: courses[i] }).fetch()[0];  
        }
        
        // FOR EACH STUDENT
        for( let i = 0; i < slen; i++ ) { //STUDENT
          //ADD ALL ASSIGNED COURSES
          for( let j = 0; j < clen; j++ ) { //COURSE
            if ( s[i].role == 'admin' ) continue;  //EXCEPT admin!
            if ( s[i]._id == Meteor.userId() ) continue; //And EXCEPT SELF!
            let o = { id: c[j]._id, name: c[j].name, num:1, credits: c[j].credits, started_date: moment().format() };
            Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });
            stu_arr.push( s[i]._id );
          }
        }

        eventItem  = {
          title:    template.find( '[name="title"]' ).value,
          start:    template.find( '[name="start"]' ).value,
          end:      template.find( '[name="end"]'   ).value,
          students: stu_arr,
          //courses:  template.$(    '#t-courses'     ).val()
          location:  template.find( '[name="location"]' ).value,
          description: template.find( '[name="description"]' ).value
        };

        break;
        
      case 'stu_names':
 */       
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
        
        
        //c     = [];
        //courses = template.$( '#t-courses' ).val();
        //clen    = courses.length;
      
        
        eventItem  = {
          title:        template.find( '[name="title"]' ).value,
          start:        template.find( '[name="start"]' ).value,
          end:          template.find( '[name="end"]'   ).value,
          students:     template.$(    '[name="type"]'  ).val(),
          location:     template.find( '[name="location"]' ).value,
          description:  template.find( '[name="description"]' ).value,
          startTime:    template.find( '[name="start-time"]' ).value,
          endTime:      template.find( '[name="end-time"]' ).value,
          timezone:     template.find( '[name="timezone"]' ).value
          //courses:    template.$(    '#t-courses'     ).val()
        };
        
/*        
        // GET THE COURSES ASSIGNED:
        for( let i = 0; i < clen; i++ ) {
          c[i] = Courses.find({ _id: courses[i] }).fetch()[0];
        }

        for ( let i = 0; i < nlen; i++ ) { //number of students
          for ( let j = 0; j < clen; j++) {
            let o = { id: c[j]._id, name: c[j].name, num:1, credits: c[j].credits, started_date: moment().format() };
            Students.update({ _id: s[i]._id },{ $push:{ current_courses: o } });
          }
        }
*/
 /*       
        break;
        
      case 'departments':
        let dept    = template.$( '[name="type"]' ).val(),
            dlen    = dept.length;
        s       = [];
        c       = [];
        o       = {};
        stu_arr = [];
        
        courses = template.$( '#t-courses' ).val();
        clen    = courses.length;

        // GET ALL COURSES ASSIGNED
        for( let i = 0; i < clen; i++ ) {
          c[i] = Courses.find({ _id: courses[i] }).fetch()[0];  
        }
        
        // GET ALL STUDENTS IN EACH ASSIGNED DEPT
        for( let i = 0; i < dlen; i++ ) {
          
          // ALL STUDENTS ASSIGNED IN THIS DEPT
          s = Students.find({ department: dept[i] }).fetch();

          // HOW MANY?
          let len = s.length;
          
          // ADD ASSIGNED COURSES TO EACH STUDENT
          for( let i = 0; i < len; i++ ) { //STUDENTS
            for( let j = 0; j < clen; j++ ) { //COURSES
              let o = { id: c[j]._id, name: c[j].name, num:1, credits: c[j].credits, started_date: moment().format() };
              stu_arr.push( s[i]._id );
              Students.update( { _id: s[i]._id },{ $push:{ current_courses: o } });
            }
          }
        }

        eventItem  = {
          title:    template.find( '[name="title"]' ).value,
          start:    template.find( '[name="start"]' ).value,
          end:      template.find( '[name="end"]'   ).value,
          students: stu_arr,
          //courses:  template.$(    '#t-courses'     ).val()
          location:  template.find( '[name="location"]' ).value,
          description: template.find( '[name="description"]' ).value
        };    
        break;
    }
 */   
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

    let o = { 
              name:         eventItem.title, 
              start_date:   eventItem.start, 
              start_time:   eventItem.startTime, 
              end_date:     eventItem.end, 
              end_time:     eventItem.endTime, 
              timezone:     eventItem.timezone,
              location:     eventItem.location,
              description:  eventItem.description,
              posted_date:  moment().format() 
            };
            
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
      
          Students.update({ _id: s[i]._id },{ $push:{ current_trainings:{ link_id: iid } } });
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