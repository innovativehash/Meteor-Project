# collective-university

Unip the project
cd into it

$ npm init

$ meteor

After it is running, before doing anything else, you need to seed the DB. Note the Dump folder in the project tree.
You'll need an instance of mongoDB installed on your system, besides the version that meteor ships with.

Look in the .meteor/local/db directory. There’s a file called, METEOR-PORT. That is the PORT you will substitute in the command line below. If you are not using locahost, you will need to replace localhost in the command below with either the IP or domain name.

At the command line:

$ mongorestore -h localhost:PORT --db meteor dump/meteor/
