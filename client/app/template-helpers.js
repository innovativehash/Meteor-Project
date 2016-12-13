/*
 * Template Registered Helpers
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

Template.registerHelper( 'and', ( a, b ) => {
  return a && b;
});


Template.registerHelper( 'or', ( a, b  ) => {
  return a || b;
});

Template.registerHelper('eq', ( a, b ) => {
  return a === b;
});

Template.registerHelper( 'isStudent', () => {
  try {
    return Meteor.user().roles.student;
  } catch(e) {
    return new Error(e);
  }
});

Template.registerHelper( 'isTeacher', () => {
  try {
    return Meteor.user().roles.teacher;
  } catch(e) {
    return new Error( e );
  }
});

Template.registerHelper( 'isAdmin', () => {
  try {
    return Meteor.user().roles.admin;
  } catch(e) {
    return new Error(e);
  }
});
