import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import { Students }     from '../../../both/collections/api/students.js';
import { Newsfeeds }    from '../../../both/collections/api/newsfeeds.js';
import { Comments }     from '../../../both/collections/api/comments.js';
import { Departments }  from '../../../both/collections/api/departments.js';

import '../../templates/admin/admin-students.html';


/*
 * CREATED
 */
Template.adminStudents.onCreated( function() {

  //$("#students-cover").show();


  /*
   * BOOTSTRAP3-DIALOG
   */
  $.getScript( '/bower_components/bootstrap3-dialog/dist/js/bootstrap-dialog.min.js', function() {
      //console.log('student:: bootstrap-dialog loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'student:: load bootstrap-dialog.min.js fail' );
    //console.log( 'jqxhr ' + jqxhr );
    //console.log( 'settings ' + settings );
    //console.log( 'exception: ' + exception );
  });
//-------------------------------------------------------------------


  /*
   * SELECT2
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



/*
 * RENDERED
 */
Template.adminStudents.onRendered( function() {
/* 
  $( '#students-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $("#students-cover").hide();
    $( ".filter-buttons" ).fadeIn( 'slow' );
  });
*/
});


/*
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
  },
  
});

    
    
/*
 * EVENTS
 */
Template.adminStudents.events({
  
  /*
   * CHANGE #SEARCH-STUDENTS
   */
  'change #search-students'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let idx = $( e.currentTarget ).val();
    $('tr').css('border', '');
    $('tr#' + idx ).css('border', '1px solid');
    $('html, body').animate({
      scrollTop: $('tr#' + $( e.currentTarget ).val() ).offset().top + 'px'
      }, 'fast');
//-------------------------------------------------------------------
  },


  /*
   * CLICK #CLOSE-SEARCH
   */
  'click #close-search'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $('#search-students').val('');
//-------------------------------------------------------------------
  },


  /*
   * CLICK .JS-STUDENT
   */
  'click .js-student'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    if ( Meteor.userId() == $(e.currentTarget).data('id') ) return;

    FlowRouter.go( 'student-record', { _id: $(e.currentTarget).data('id') });

    //$(e.currentTarget).data('id'));
    //console.log( Template.instance().view.parentView );
    //console.log( Template.adminStudentsBase );
//-------------------------------------------------------------------
  },


  /*
   * CLICK .JS-IMPORT-STUDENTS-CSV
   */
  'click .js-import-students-csv'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-import-csv', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * CLICK .JS-ADD-STUDENT
   */
  'click .js-add-student'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let dpt = Departments.find({}).fetch();
  
    Meteor.setTimeout(function(){
      for( let i = 0, l = dpt.length; i < l; i++){
        $('.js-dept').append('<option value="' + dpt[i]._id + '">' +
                                  dpt[i].name + '</option>');
      }
    }, 500);
    
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
                          '<select class="js-dept form-control"/></select>' +
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

                  let co = Students.findOne({_id: Meteor.userId()});

                  let fname     = $('.js-fn').val().trim();
                  let lname     = $('.js-ln').val().trim();
                  let email     = $('.js-email').val().trim();
                  let dept      = $('.js-dept :selected').text();
                  let opt       = $('#sel1').val();
                  let password  = $('.js-password').val().trim();
                  let url       = 'https://collective-university-nsardo.c9users.io';
                  //let text      = `Hello ${fname},\n\nThis organization has set up its own corporate university to help provide training and more sharing of internal knowledge.  Your plan administrator will be providing more details in the coming days.\n\nTo login to your account and enroll in classes, please visit: ${url}.\n\nUsername: ${email}\nPass: ${password}\n\nFrom here you'll be able to enroll in courses, to request credit for off-site training and conferences, and keep track of all internal training meetings.\nIn Student Records, you'll see all the classes and certifications you have completed.  For a more complete overview, please see this video:\n\nIf you have any questions, please contact: `;

                  Meteor.call('addUser', email, password, fname, lname, opt, dept, co.company, co.company_id);

                  //Meteor.call('sendEmail', email, 'admin@collectiveuniversity.com', 'New Account', text);
                  
                  /*
                  Meteor.call('sendEmail',
                              'nsardo@msn.com',
                              'bob@example.com',
                              'Hello from Meteor!',
                              'This is a test of Email.send.');
                  */
                  
                  //Bert.alert('Account Created', 'success', 'growl-top-right');
                  dialog.close();

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
//-------------------------------------------------------------------
  },


  /*
   * CLICK .JS-EDIT-STUDENT
   */
  'click .js-edit-student'( e, t ) {
      e.preventDefault();
      e.stopImmediatePropagation();
  
      let id = t.$( e.currentTarget ).data('id');
      let s  = Students.findOne({_id: id});
      
      let dpt = Departments.find({}).fetch();
      
      Meteor.setTimeout(function(){
        for( let i = 0, l = dpt.length; i < l; i++){
          $('.js-dept').append('<option value="' + dpt[i]._id + '">' +
                                    dpt[i].name + '</option>');
        }

        $('select[name="add-dept-select"]').find('option:contains("' + s.department + '")').attr("selected",true);
      }, 500);
      
      BootstrapDialog.show({
        title: "Edit Student",
        message:  '<div class="pop-up-area students">'  +
                    '<div class="popup-body">'          +
                      '<div class="row">'               +
                        '<div class="col-sm-6">'        +
                          '<input class="js-fn" type="text" placeholder="' + s.fname + '"' + 'readonly/>' +
                        '</div>'                  +
                        '<div class="col-sm-6">'  +
                          '<input class="js-ln" type="text" placeholder="' + s.lname + '"' + 'readonly/>' +
                        '</div>'  +
                      '</div>'    +
                      '<div class="row">'         +
                        '<div class="col-sm-6">'  +
                          '<input class="js-email" type="text" placeholder="' + s.email + '"' + '/>' +
                        '</div>'  +
                      '<div class="col-sm-6">' +
                        '<select name="add-dept-select" class="js-dept form-control"></select>' +
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
              let r   = $('#sel1').val()                || s.role,
                  fn  = $('.js-fn').val()               || s.fname,
                  //ln  = $('.js-ln').val()               || s.lname,
                  e   = $('.js-email').val()            || s.email,
                  d   = $('.js-dept :selected').text()  || s.department;
                  //f   = fn + ' ' + ln;
                  //n   = Newsfeeds.find({ owner_id: id}).fetch(),
                  //c   = Comments.find({ poster_id: id}).fetch();
  
              Students.update({ _id: id },
                              {$set:{ role:r,
                                      //fname:fn,
                                      //lname:ln,
                                      email:e,
                                      department:d,
                                      //fullName:f,
                                      updated_at: new Date() } });
  
              Meteor.users.update({ _id: id }, {$set:{ roles: r } });
              /*
              if ( r == 'teacher' ) {
                let text = `Hello ${fn},\n\nThe administrator of Corporate University has upgraded your account to teacher level so that you may now create courses and schedule training sessions within our Corporate University.  As an expert within the organization, it's important to provide you the opportunity to share your knowledge with others so you will get credit for every class you teach and course you build.\n\nYou can login here:\nUser: ${e}\nYour password remains the same.`;
                Meteor.call('sendEmail', e, 'admin@collectiveuniversity.com', 'Upgraded Account', text);
              }
              */
/*  
              let nlim = n.length;
              for ( let i = 0; i < nlim; i++ ) {
                Meteor.call('changeNewsfeedAuthorName', n[i]._id, f );
              }
              let clim = c.length;
              for ( let i = 0; i < clim; i++ ) {
                Meteor.call('changeCommentsAuthorName', c[i]._id, f );
              }
*/
              //Bert.alert('Edits to student record recorded', 'success', 'growl-top-right');
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
//-------------------------------------------------------------------
  },


  /*
   * CLICK .JS-DELETE-STUDENT
   */
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
               // Bert.alert('Student record deleted','danger');
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


/**
 * Get the parent template instance
 * @param {Number} [levels] How many levels to go up. Default is 1
 * @returns {Blaze.TemplateInstance}
 * 
 * Example usage: someTemplate.parentTemplate() to get the immediate parent
 */
Blaze.TemplateInstance.prototype.parentTemplate = function (levels) {
    var view = this.view;
    if (typeof levels === "undefined") {
        levels = 1;
    }
    while (view) {
        if (view.name.substring(0, 9) === "Template." && !(levels--)) {
            return view.templateInstance();
        }
        view = view.parentView;
    }
};