import { Meteor     }   from 'meteor/meteor';
import { Mongo      }   from 'meteor/mongo';
import { Email } from 'meteor/email'
import { Webapp     }   from 'meteor/webapp';


Meteor.startup(() => {
  smtp = {
    username: 'gcc.programmer@gmail.com',
    password: 'fdmeioyxxkxcjvrr',
    server:   'smtp.gmail.com',
    port: 465
  };

  process.env.MAIL_URL = 'smtp://' +
    encodeURIComponent(smtp.username) + ':' +
    encodeURIComponent(smtp.password) + '@' +
    encodeURIComponent(smtp.server) + ':' + smtp.port;

Accounts.emailTemplates.siteName = "CollectiveUniversity";
Accounts.emailTemplates.from     = "CollectiveUniversity <admin@CollectiveUniversity.com>";
/*
Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[CollectiveUniversity] Verify Your Email Address";
  },
  text( user, url ) {
    let emailAddress   = user.emails[0].address,
        urlWithoutHash = url.replace( '#/', '' ),
        supportEmail   = "support@collectiveUniversity.com",
        emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};
*/
  process.env.ROOT_URL = 'http://collective-university-220447.nitrousapp.com/';
  /*
  WebApp.addHtmlAttributeHook(function() {
    return { 'class': "no-js" }
  });
  */

});