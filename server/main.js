import { Meteor     }   from 'meteor/meteor';
import { Mongo      }   from 'meteor/mongo';
import { Email } from 'meteor/email'
import { Webapp     }   from 'meteor/webapp';


Meteor.startup(() => {
  smtp = {
    username: 'mac.rubyist@gmail.com',
    password: 'K81sgr82me!',
    server:   'smtp.gmail.com',
    port: 587 //465
  };

  process.env.MAIL_URL = 'smtp://' +
    encodeURIComponent(smtp.username) + ':' +
    encodeURIComponent(smtp.password) + '@' +
    encodeURIComponent(smtp.server) + ':' + smtp.port;

  process.env.ROOT_URL = 'https://collective-university-nsardo.c9users.io:8080';
  /*
  WebApp.addHtmlAttributeHook(function() {
    return { 'class': "no-js" }
  });
  */

});