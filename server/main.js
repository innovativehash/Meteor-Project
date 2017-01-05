/*
 * @module main
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */
import { Meteor     }   from 'meteor/meteor';
import { Mongo      }   from 'meteor/mongo';
import { Email }        from 'meteor/email'
import { Webapp     }   from 'meteor/webapp';


Meteor.startup(() => {
  smtp = {
    username: 'mac.rubyist@gmail.com',
    password: 'K81sgr82me!',
    server:   'smtp.gmail.com',
    port: 587 //465
  };

  process.env.MAIL_URL = 'smtp://' +
    encodeURIComponent( smtp.username ) + ':' +
    encodeURIComponent( smtp.password ) + '@' +
    encodeURIComponent( smtp.server )   + ':' + smtp.port;

  process.env.ROOT_URL = 'https://collective-university-nsardo.c9users.io:8080';
  
  
  /*
  WebApp.addHtmlAttributeHook(function() {
    return { 'class': "no-js" }
  });
  */
});

/*
// Listen to incoming HTTP requests, can only be used on the server
WebApp.rawConnectHandlers.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});
*/