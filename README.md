# collective-university

Unzip the project cd into it:

$ npm install 

$ meteor

After it is running, before doing anything else, you need to seed the DB. Note the Dump folder in the project tree. You'll need an instance of mongoDB installed on your system, besides the version that meteor ships with.

Look in the .meteor/local/db directory. There’s a file called, METEOR-PORT. That is the PORT you will substitute in the command line below. If you are not using locahost, you will need to replace localhost in the command below with either the IP or domain name.

At the command line:

$ mongorestore -h localhost:PORT --db meteor dump/meteor/

<hr>
*Current Package Versions (Meteor)*:
accounts-base               1.2.15  A user account system
accounts-password           1.3.4  Password support for accounts
aldeed:collection2          2.10.0  Automatic validation of insert and update operations on the client and server.
autopublish                 1.0.7  (For prototyping only) Publish the entire database to all clients
blaze-html-templates        1.1.2  Compile HTML templates into reactive UI with Meteor Blaze
check                       1.2.5  Check whether a value matches a pattern
deanius:promise             3.1.3  Utilities for Promise-based wrappers, method calls, helpers and HTTP in Meteor
ecmascript                  0.6.3  Compiler plugin that supports ES2015+ in all .js files
email                       1.1.18  Send email messages
es5-shim                    4.6.15  Shims and polyfills to improve ECMAScript 5 support
fortawesome:fontawesome     4.7.0  Font Awesome (official): 500+ scalable vector icons, customizable via CSS, Retina friendly
fullcalendar:fullcalendar   2.9.0  Full-sized drag & drop event calendar
http                        1.2.12  Make HTTP calls to remote servers
insecure                    1.0.7  (For prototyping only) Allow all database writes from the client
jquery                      1.11.10  Manipulate the DOM using CSS selectors
kadira:blaze-layout         2.3.0  Layout Manager for Blaze (works well with FlowRouter)
kadira:flow-router          2.12.1  Carefully Designed Client Side Router for Meteor
lepozepo:s3                 5.2.5  Upload files to S3. Allows use of Knox Server-Side.
lookback:body-class         0.4.1  Automatically add classes for router templates and layouts for scoping with CSS.
manuel:reactivearray        1.0.5  Reactive Array for Meteor
meteor-base                 1.0.4  Packages that every Meteor app needs
mobile-experience           1.0.4  Packages for a great mobile user experience
momentjs:moment             2.18.1  Moment.js (official): parse, validate, manipulate, and display dates - official Meteor packaging
mongo                       1.1.16  Adaptor for using MongoDB and Minimongo over DDP
msavin:mongol               2.0.1  In-App MongoDB Editor.. now works better than ever!
reactive-dict               1.1.8  Reactive dictionary
reactive-var                1.0.11  Reactive variable
session                     1.1.7  Session variable
shell-server                0.2.3  Server-side component of the `meteor shell` command.
standard-minifier-css       1.3.4  Standard css minifier used with Meteor apps by default.
standard-minifier-js        1.2.3  Standard javascript minifiers used with Meteor apps by default.
themeteorchef:bert          2.1.2  A client side, multi-style alerts system for Meteor.
tmeasday:html5-history-api  4.1.2  HTML5 History API expansion for browsers not supporting pushState, replaceState
tracker                     1.1.2  Dependency tracker to allow reactive callbacks
twbs:bootstrap              3.3.6  The most popular front-end framework for developing responsive, mobile first projects on the web.