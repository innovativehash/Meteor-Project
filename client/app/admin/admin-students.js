import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students }     from '../../../both/collections/api/students.js';
import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Comments }     from '../../../both/collections/api/comments.js';

import '../../templates/admin/admin-students.html';


/**
 * ON CREATED
 */
Template.adminStudents.onCreated( function() {

  $("#students-cover").show();

  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('student:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'student:: load bootstrap-dialog.min.js fail' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });

  /**
   * MULTI-SELECT AUTOCOMPLETE COMBOBOX
  */
  $.getScript('/js/select2.min.js', function() {
    $(document).ready(function(){
      $('#search-students').select2({
        allowClear: true
      });
    });
    //console.log('students:: chosen,jquery.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'students:: load select2.js fail' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
});



/**
 * ON RENDERED
 */
Template.adminStudents.onRendered( function() {
  $( '#students-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#students-cover").hide();
    $( ".filter-buttons" ).fadeIn( 'slow' );
  });
});


/**
 * HELPERS
 */
Template.adminStudents.helpers({
  students() {
    let s = Students.find().fetch();
    let len = s.length;
    for( let i=0; i<len; i++) {
      s[i].created_at = moment(s[i].created_at).format('M-D-Y') //modify array in place
    }
    return s;
  }
});


/**
 * EVENTS
 */
Template.adminStudents.events({

  'change #search-students'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    $('tr').css('border', '');
    $('tr#' + idx ).css('border', '1px solid');
    $('html, body').animate({
      scrollTop: $('tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast');
  },

  'click #close-search'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $('#search-students').val('');
  },

  'click .js-student'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( Meteor.userId() == $(e.currentTarget).data('id') ) return;

    FlowRouter.go( 'student-record', { _id: $(e.currentTarget).data('id') });

    //Session.set('id', $(e.currentTarget).data('id'));
    //Session.set('doc', 'studentRecord');
    //console.log( Template.instance().view.parentView );
    //console.log( Template.adminStudentsBase );
  },

  'click .js-import-students-csv'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-import-csv', { _id: Meteor.userId() });
  },

  'click .js-add-student'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    BootstrapDialog.show({
      title: "Add Student",
      message:  $('<div class="pop-up-area students">'                                  +
                    '<div class="popup-body">'                                          +
                      '<div class="row">'                                               +
                        '<div class="col-sm-6">'                                        +
                          '<input class="js-fn" type="text" placeholder="First Name"/>' +
                        '</div>'                                                        +
                        '<div class="col-sm-6">'                                        +
                          '<input class="js-ln" type="text" placeholder="Last Name"/>'  +
                        '</div>'                                                        +
                      '</div>'                                                          +
                      '<div class="row">'                                               +
                        '<div class="col-sm-6">'                                        +
                          '<input class="js-email" type="text" placeholder="Email"/>'   +
                        '</div>'                                                        +
                        '<div class="col-sm-6">'                                        +
                          '<input class="js-dept" type="text" placeholder="Department"/>' +
                        '</div>'                                                        +
                      '</div>'                                                          +
                      '<div class="row">'                                               +
                        '<div class="col-sm-6">'                                        +
                          '<input class="js-password" type="text" placeholder="initial password...">' +
                        '</div>'                                                        +
                        '<div class="col-sm-6">'                                        +
                          '<select class="form-control" id="sel1">'                     +
                            '<option value="student">Student</option>'                  +
                            '<option value="teacher">Teacher</option>'                  +
                            '<option value="admin" >Admin</option>'                     +
                          '</select>'                                                   +
                        '</div>'                                                        +
                      '</div>'                                                          +
                    '</div>'                                                            +
                  '</div>'),
      buttons: [{
              label: 'Add Student',
              cssClass: 'btn-success',
              action: function( dialog ) {

                  let fname = $('.js-fn').val().trim();
                  let lname = $('.js-ln').val().trim();
                  let email = $('.js-email').val().trim();
                  let dept  = $('.js-dept').val().trim();
                  let opt   = $('#sel1').val();
                  let password = $('.js-password').val().trim();
                  let text = "You have a new account with password: " + password;


                  Meteor.call('addUser', email, password, fname, lname, opt, dept);

                  Meteor.call('sendEmail', email, 'admin@collectiveuniversity.com', 'New Account', text);
                  /*
                  Students.update({ _id: student},
                                  {
                                    $set: {current_credits: tot_credits},
                                    $inc: {compl_courses_cnt: 1},
                                    $push:{approved_courses: {course:option, credits:credits, date: new Date()}}
                                  });
                  Newsfeeds.remove({_id: recordId});
                  
                
                  Meteor.call('sendEmail',
                              'nsardo@msn.com',
                              'bob@example.com',
                              'Hello from Meteor!',
                              'This is a test of Email.send.');
                  */
                  
                  dialog.close();
                  /*
                  Session.set( 'message', 'Request Approval Recorded...' );
                  Meteor.setTimeout(function() {
                    console.log('in timer');
                    Session.set('message', '');
                    Session.set('showPostBox', true );
                    Session.set('showNewsfeed', true );
                }, 1500);
                */
              } //action
          },
          {
          label: 'Cancel Add',
          cssClass: 'btn-danger',
          action: function( dialog ) {
            dialog.close();
          }
      }]
    });
  },

  /**
   * EDIT STUDENT
   */
  'click .js-edit-student'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = $( e.currentTarget ).data('id');
    let s  = Students.findOne({_id: id});
    BootstrapDialog.show({
      title: "Edit Student",
      message:  '<div class="pop-up-area students">'  +
                  '<div class="popup-body">'          +
                    '<div class="row">'               +
                      '<div class="col-sm-6">'        +
                        '<input class="js-fn" type="text" placeholder="' + s.fname + '"' + '/>' +
                      '</div>'                  +
                      '<div class="col-sm-6">'  +
                        '<input class="js-ln" type="text" placeholder="' + s.lname + '"' + '/>' +
                      '</div>'  +
                    '</div>'    +
                    '<div class="row">'         +
                      '<div class="col-sm-6">'  +
                        '<input class="js-email" type="text" placeholder="' + s.email + '"' + '/>' +
                      '</div>'  +
                    '<div class="col-sm-6">' +
                      '<input class="js-dept" type="text" placeholder="' + s.department + '"' + '/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">'         +
                      '<div class="col-sm-6">'  +
                        '<select class="form-control" name="sel1" id="sel1">' +
                          '<option ' + eval(s.role == "student" ? 'selected="selected"' : "" ) + ' value="student">Student</option>'  +
                          '<option ' + eval(s.role == "teacher" ? 'selected="selected"' : "" ) + ' value="teacher">Teacher</option>'  +
                          '<option ' + eval(s.role == "admin"   ? 'selected="selected"' : "" ) + ' value="admin">Admin</option>'      +
                        '</select>' +
                      '</div>'  +
                    '</div>'    +
                  '</div></div>',
      buttons: [
        {
          label: 'Commit Edit',
          cssClass: 'btn-success',
          action: function( dialog ) {
            let r   = $('#sel1').val()      || s.role,
                fn  = $('.js-fn').val()     || s.fname,
                ln  = $('.js-ln').val()     || s.lname,
                e   = $('.js-email').val()  || s.email,
                d   = $('.js-dept').val()   || s.department,
                f   = fn + ' ' + ln,
                n   = Newsfeeds.find({ owner_id: id}).fetch(),
                c   = Comments.find({ poster_id: id}).fetch();

            Students.update({ _id: id },
                            {$set:{ role:r,
                                    fname:fn,
                                    lname:ln,
                                    email:e,
                                    department:d,
                                    fullName:f,
                                    updated_at: new Date() } });

            Meteor.users.update({ _id: id }, {$set:{ username: f } });

            let nlim = n.length;
            for ( let i = 0; i < nlim; i++ ) {
              console.log( 'newsfeeds ' + n[i]._id );
              Meteor.call('changeNewsfeedAuthorName', n[i]._id, f );
            }
            let clim = c.length;
            for ( let i = 0; i < clim; i++ ) {
              console.log( 'comments ' + c[i]._id)
              Meteor.call('changeCommentsAuthorName', c[i]._id, f );
            }
            dialog.close();
          }
        },
        {
          label: 'Cancel Edit',
          cssClass: 'btn-danger',
          action: function( dialog ) {
          dialog.close();
            dialog.close();
          }
        }]
    });
  },

  'click .js-delete-student'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    /* ARE YOU SURE YOU WANT TO DELETE... */
    let id = $( e.currentTarget ).data('id');
    let s  = Students.findOne({_id: id});
    BootstrapDialog.show({
      title: "Delete Student",
      message:  '<div class="pop-up-area students">' +
                  '<div class="popup-body">' +
                    '<div class="row">' +
                      '<div class="col-sm-12">' +
                        '<strong>Are you sure you want to delete this student?</strong>' +
                        '<div class="name">' +
                          '<span>' +
                            '<img src="' + s.avatar + '"' + '>' +
                          '</span>' +
                        '</div>' +
                        '<span style="color:white;">' + s.fname + ' &nbsp; ' + s.lname + ' </span>' +
                  '</div></div></div></div>',
      buttons: [{
              label: 'Delete Student',
              cssClass: 'btn-danger',
              action: function( dialog ) {
                Students.remove(id);
                Meteor.users.remove(id);
                dialog.close();
              }
        },
        {
            label: 'Cancel Delete',
            cssClass: 'btn-primary',
            action: function( dialog ) {
              dialog.close();
            }
        }]
    });
  },

  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
  }
});