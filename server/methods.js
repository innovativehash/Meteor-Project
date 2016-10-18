import { Students }     from '../both/collections/api/students.js';
import { Newsfeeds }    from '../both/collections/api/newsfeeds.js';
import { Comments }     from '../both/collections/api/comments.js';
import { Companies }    from '../both/collections/api/companies.js';
import { BuiltCourses } from '../both/collections/api/built-courses.js';


Meteor.methods({

  'saveBuiltCoursePdf': function( id, data, page ) {
    BuiltCourses.update({ _id: id}, {$addToSet:{pages:{ page:page, pdf: data }}});
  },

  'saveBuiltCourseImage': function( id, data, page ) {
    BuiltCourses.update({ _id: id }, {$addToSet:{pages:{ page: page, image: data } }});
  },

  'saveCompanyLogo': function( id, data ) {
    Companies.update({ _id: id }, {$set:{logo: data} });
  },

  'saveCompanyColor'( id, data ) {
    Companies.update({ _id: id }, {$set:{backgroundColor: data} });
  },

  'updateProfilePic': function( data ) {
    Newsfeeds.update({ owner_id: Meteor.userId()},
                     {$set:{poster_avatar: data} }, { multi: true });
    Comments.update({ poster_id: Meteor.userId()},
                    {$set:{poster_avatar: data} }, { multi: true });
    Meteor.users.update({ _id: Meteor.userId()},
                        {$set:{'profile.avatar': data} });
    Students.update({ _id: Meteor.userId() },
                    {$set:{avatar: data}});
  },

  'changeNewsfeedAuthorName': function( id, p ) {
    Newsfeeds.update({ _id: id }, {$set:{ poster: p } });
  },

  'changeCommentsAuthorName': function( id, p ) {
    Comments.update({ _id: id },{$set:{ poster_name: p } });
  },

  'sendEmail': function (to, from, subject, text) {
    check([to, from, subject, text], [String]);
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },

  'addUser': function( email, password, fname, lname, opt, dept ) {

    let uid = Accounts.createUser({
      email: email,
      password: password,
      username: fname + ' ' + lname,
      profile:{
        avatar:"data:image/png;base64,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"
      },
      roles: [opt]
    });

    Students.insert({
      _id: uid,
      avatar:"data:image/png;base64,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",
      fname: fname,
      lname: lname,
      email: email,
      department:dept,
      role: opt,
      created_at: new Date()
    });
  }
});