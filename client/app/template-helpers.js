

Template.registerHelper( 'and', ( a, b ) => {
  return a && b;
});


Template.registerHelper( 'or', ( a, b  ) => {
  return a || b;
});

Template.registerHelper('eq', function (a, b) {
  return a === b;
});

Template.registerHelper( 'isStudent', () => {
  try {
    return Meteor.user().roles.student;
  } catch(e) {
    return;
  }
});

Template.registerHelper( 'isTeacher', () => {
  try {
    return Meteor.user().roles.teacher;
  } catch(e) {
    return;
  }
});

Template.registerHelper( 'isAdmin', () => {
  try {
    return Meteor.user().roles.admin;
  } catch(e) {
    return;
  }
});

/*
  isTeacher: () => {
    try{
      return Meteor.user().roles.teacher;
    } catch(e) {
      return;
    }
  },

  isStudent: () => {
    try {
      return Meteor.user().roles.student;
    } catch(e) {
      return;
    }
  },
*/