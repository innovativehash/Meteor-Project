/*
 * @module methods
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Students }     from '../both/collections/api/students.js';
import { Newsfeeds }    from '../both/collections/api/newsfeeds.js';
import { Comments }     from '../both/collections/api/comments.js';
import { Companies }    from '../both/collections/api/companies.js';
import { BuiltCourses } from '../both/collections/api/built-courses.js';
import { Events }       from '../both/collections/api/events.js';
import { Scorms }       from '../both/collections/api/scorms.js';


Meteor.methods({
  
  
  /*
   * get URL of  course for student (requires username pass  and course_id)
   * http://scorm.academy-smart.org.ua/player/get
   * POST BODY
   * { “user”: "demo_user", “pass”: "1", “course”: "1" } 
   * returns full url to play a course
   * RESPONSE.DATA:
   *                { action: 'success',
   *                  url: 'http://scorm.academy-smart.org.ua/player/play/4f3b1479e562886f2cdc361faeebe399' }
   * RESPONSE.DATA:
   *                { action: 'success',
   *                  url: 'http://scorm.academy-smart.org.ua/player/play/77f5f5f7fa13850ad5bf36aab77a3a83' }
   *                  
   *  USER: *NAME*, PASS: 'unencrypted', COURSE: NUMERIC                  XXX
   */
   'scormGetCoursePlayURL': function( user, pass, course ) {
     try{
      let resp = HTTP.post( 'http://scorm.academy-smart.org.ua/player/get',
                  {
                    data: {
                      "user": `${user}`, "pass": `${pass}`, "course": `${course}`
                    }
                  });
      return resp.data.url;
      
     } catch(e) {
       
       return e.reason;
       
     }
                /* ASYNC
                ,function( error, response ){
                  if( error ){
                    console.log( error );
                  } else {
                   console.log( '------------------------------------------------------------------')
                   console.log( 'RESPONSE.HEADERS');
                   console.log( response.headers );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.CODE:');
                   console.log( response.code );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.CONTENT');
                   console.log( response.content );
                   console.log( '------------------------------------------------------------------')
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA.URL');
                   console.log( response.data.url );
                   console.log( '------------------------------------------------------------------');
                   //return response.data.url;
                  }
                  
    });
    */
   },
   
   
  /*
   * DELETE COURSE
   * DELETE http://scorm.academy-smart.org.ua/player/deleteCourse
   * body
   * {"company_id":"<your_company>"  "course_id":"<existing course>"}
   */
   'scormDeleteCourse': function( company_id, course ) {
     HTTP.delete( 'http://scorm.academy-smart.org.ua/player/deleteCourse',
                  {
                    data: {
                      "company_id": `${company_id}`, "course_id": `${course}k`
                    }
                  },
                  function( error, response ){
                    if( error ){
                      console.log( error );
                    } else {
                     console.log('-------------------------------------------------------------------');
                     console.log( 'RESPONSE:');
                     console.log( response );
                     console.log('-------------------------------------------------------------------');
                     console.log( 'RESPONSE.DATA:');
                     console.log( response.data );
                     console.log('-------------------------------------------------------------------');
                    }
    });
   },
   
   
  /*
   * GET STATUS OF COURSE
   * GET http://scorm.academy-smart.org.ua/player/courseStatus/<company_id>/<user_id>   xxx
   */
   'scormStudentCourseStatus': function( company_id, user_id, course_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/courseStatus/${company_id}/${user_id}/${course_id}`,
                {},
                function( error, response ){
                  if( error ){
                    console.log( error );
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * NO INPUTS OUTPUT - ALL LOADED COURSES
   * GET http://scorm.academy-smart.org.ua/player/listAllCourses          xxx
   */
   'scormListAllCourses': function() {
     HTTP.get( 'http://scorm.academy-smart.org.ua/player/listAllCourses',
                {},
                function( error, response ){
                  if( error ) {
                    console.log(error);
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   

  /*
   * - LIST ALL STARTED COURSES BY USER
   * GET http://scorm.academy-smart.org.ua/player/coursesStarted/<company_id>/<user_id>
   *                                                                              XXX
   */
   'scormListStudentStartedCourses': function( company_id, user_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/coursesStarted/${company_id}/${user_id}`,
                {},
                function( error, response ){
                  if( error ){
                    console.log( error );
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.STATUS CODE');
                   console.log( response.statusCode );
                   console.log( '------------------------------------------------------------------');
                   console.log( 'RESPONSE.CONTENT');
                   console.log( response.content );
                   console.log( '------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * LIST ALL COMPLETED COURSES BY USER
   * GET http://scorm.academy-smart.org.ua/player/coursesCompleted/<company_id>/<user_id>
   *                                                                              XXX
   */
   'scormListStudentCompletedCourses': function( company_id, user_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/coursesCompleted/${company_id}/${user_id}`,
                {},
                function( error, response ){
                  if( error ) {
                    console.log( error );
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * LIST ALL COURSES BY COMPANY
   * GET http://scorm.academy-smart.org.ua/player/listCompanyCourses/<company_id>
   *                                                                        XXX
   */
   'scormListCompanyCourses': function( company_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/listCompanyCourses/${company_id}`,
                {},
                function( error, response ){
                  if( error ) {
                    console.log(error);
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * LIST ALL COURSES BY USER (COMPLETED/CURRENT)
   * GET http://scorm.academy-smart.org.ua/player/listStudentCourses/<company_id>/<user_id>
   *                                                                          XXX
   */
   'scormListUserCourses': function( company_id, user_id ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/listStudentCourses/${company_id}/${user_id}`,
                {},
                function( error, response ){
                  if( error ){
                    console.log( error );
                  } else {
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE:');
                    console.log( response );
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE.DATA:');
                    console.log( response.data );
                    console.log('-------------------------------------------------------------------');
                  }
      });
   },
   
   
  /*
   * SCORM METRIC OF STUDENT OF SPECIFIED COURSE
   * GET http://scorm.academy-smart.org.ua/player/courseMetric/<company_id>/<user_id>/<course_id>/<scorm metric>
   * 
   */
   'scormStudentMetric': function( company_id, user_id, course_id, scorm_metric ) {
     HTTP.get( `http://scorm.academy-smart.org.ua/player/courseMetric/${company_id}/${user_id}/${course_id}/${scorm_metric}`,
                {},
                function( error, response ){
                  if ( error ){
                    console.log( error );
                  } else {
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE:');
                    console.log( response );
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE.DATA:');
                    console.log( response.data );
                    console.log('-------------------------------------------------------------------');
                  }
    });
   },
   
   
  /*
   * CREATE USER
   * POST http://scorm.academy-smart.org.ua/users/createUser
   * {"user":"<username>","pass":"<password>","comapny_id"":"numeric comapny id"}
   *                                                                      XXX
   */
  'scormCreateUser': function( user, pass, company_id ) {
    HTTP.post( 'http://scorm.academy-smart.org.ua/users/createUser',
                {
                  data: {
                    "user": `${user}`, "pass": `${pass}`, "company_id": `${company_id}`
                  }
                },
                function( error, response ) {
                  if( error ) {
                   console.log( error );
                  } else {
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE:');
                    console.log( response );
                    console.log('-------------------------------------------------------------------');
                    console.log( 'RESPONSE.DATA:');
                    console.log( response.data );
                    console.log('-------------------------------------------------------------------');
                  }
    });
  },
  
  
  /*
   * UPLOAD COURSE
   * POST http://scorm.academy-smart.org.ua/player/uploadCourse
   * {"comapny_id"":"numeric comapny id"}
   * and set multipart/mixed content
   * and attach files
   */
  'scormUploadCourse': function( company_id ) {
    HTTP.post( 'http://scorm.academy-smart.org.ua/player/uploadCourse', 
                { 
                  headers:{ 
                    "Content-Type": "multipart/mixed" 
                  },
                  data: { 
                    "company_id": `${company_id}` 
                  }
                }, 
                function( error, response ){
                  if ( error ) {
                    console.log( error );
                  } else {
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE:');
                   console.log( response );
                   console.log('-------------------------------------------------------------------');
                   console.log( 'RESPONSE.DATA:');
                   console.log( response.data );
                   console.log('-------------------------------------------------------------------');
                  }
    });
  },
  
  
  
  'upsertCompany': function( company_id, freq, req_cred ) {

    return Companies.update(  { _id: company_id }, 
                              { $set:
                                { 
                                  required_credits: req_cred, 
                                  frequency: freq 
                                } 
                              }
                           );    
  },
//-----------------------------------------------------------------------------


  'upsertCredits': function( company_id, cr ) {
    
    return Students.upsert( { company_id: company_id }, 
                            { $set:
                              { 
                                required_credits: cr
                              }
                            }, 
                            { multi: true }
                          );
  },
//-----------------------------------------------------------------------------


  'insertCompanyReturnId': function( name, backgroundColor, logo ) {
    
    return Companies.insert( { 
                                name:             name, 
                                backgroundColor:  backgroundColor, 
                                logo:             logo 
                              } 
                           );
  },
 //-----------------------------------------------------------------------------
 
 
  'saveBuiltCoursePdf': function( id, data, page ) {
    
    BuiltCourses.update(  { _id: id }, 
                          { $addToSet:
                            { pages:
                              { 
                                page:page, 
                                pdf: data 
                              }
                            }
                          }
                       );
  },
//-----------------------------------------------------------------------------


  'saveBuiltCourseImage': function( id, data, page ) {
    
    BuiltCourses.update(  { _id: id }, 
                          { $addToSet:
                            { pages:
                              { 
                                page:   page, 
                                image:  data 
                              }
                            }
                          }
                       );
  },
//-----------------------------------------------------------------------------


  'saveCompanyLogo': function( id, data ) {
    
    Companies.update( { _id: id }, 
                      { $set:
                        { 
                          logo: data 
                        } 
                      }
                    );
  },
//-----------------------------------------------------------------------------


  'saveCompanyColor'( id, data ) {
    
    Companies.update( { _id: id }, 
                      { $set:
                        { 
                          backgroundColor: data 
                        } 
                      }
                    );
  },
//-----------------------------------------------------------------------------


  'updateProfilePic': function( data ) {
    Newsfeeds.update( { owner_id: Meteor.userId() },
                      { $set:
                        {
                          poster_avatar: data
                        } 
                      }, 
                      { multi: true }
                    );
                     
    Comments.update(  { poster_id: Meteor.userId() },
                      { $set:
                        {
                          poster_avatar: data 
                        } 
                      }, 
                      { multi: true } 
                   );
                    
    Meteor.users.update(  { _id: Meteor.userId()},
                          { $set:
                            {
                              'profile.avatar': data
                            } 
                          }
                       );
                        
    Students.update(  { _id: Meteor.userId() },
                      { $set:
                        {
                          avatar: data
                        }
                      }
                   );
  },
//-----------------------------------------------------------------------------


  'changeNewsfeedAuthorName': function( id, p ) {
    Newsfeeds.update( { _id: id }, 
                      { $set:
                        { 
                          poster: p 
                        } 
                      },
                      { multi: true }
                    );
  },
//-----------------------------------------------------------------------------


  'changeCommentsAuthorName': function( id, p ) {
    Comments.update(  { _id: id },
                      { $set:
                        { 
                          poster_name: p 
                        } 
                      },
                      { multi: true }
                   );
  },
//-----------------------------------------------------------------------------


  'sendEmail': function (to, from, subject, text) {
    check( [ to, from, subject, text ], [String] );
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    Email.send({
      to:       to,
      from:     from,
      subject:  subject,
      text:     text
    });
  },
//-----------------------------------------------------------------------------


  'addUser': function( email, password, fname, lname, opt, dept, company, company_id, trial=false ) {

    let uid = Accounts.createUser({
      email:    email,
      password: password,
      roles: {
        [opt]: true
      },
      username: fname + ' ' + lname,
      profile:{
        avatar:     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACOCAYAAADThPEUAAALCElEQVR4Xu2dCdB2YxnHfyiSPSWyjS2JGltMQssYu0GDFrtCSqQRIz4hyUiTfR27ZBmljRAtlimTrTIIDWUsEZpEq6/5f+7n836vZznnPOc8576uc10z73zGe+77XPf//r/n3Oe+r+t/zUXYIATeDKwFvC/9rAAsnn4WAf4LvAz8CbgXuAy4AZgZkMJcAcIcCCwKbAfsCGwCzFsSHxFrZ+DZku3cXR7EenVK1wQOBT5agUzTSfEksB/wfXdsKTGgrhNrA+AIYHPqf3rfA1yQXo8PlJgTF5d2lVhvA04Edm2AUP2IoXXYjcD1wE+B512wZ8ggukisvYHjgbe0NLla9N8BXAecCfy1JT8avW2XiKWvvHOBTzaKaLnOXwCOA04B/lWuad5Xd4VYKwHfBd6b6XQ8CuyTXpeZuljOrS4Qaw3gZkDrqpztP4Be0xfl7GRR37wTywqpevOlzdXDga8XncBcr/NMrHcBvzTwpOrHjf2B03MlTRG/vBJrwfTltVoREDK85qW0aftQhr4Vcskrsb4DfLwQAvle9CtgQ+B/+bo42DOPxNLX1dkWJ6OPz/sC51gcizdivRV4sMXNz7o5cCewbt2dTqI/b8Q6C9BfuSdTuI72uUyZJ2ItDfyxhuiE3CZwB+Dq3Jwa5Y8nYp0AfGnUgA3+/lhghjW/vRBrHkBxULnvrlfhxxnA56o0bLONF2JtmkJS2sSyqXvriGePpjpvql8vxFL4yWeaAqnlfq8CdmrZh9K390Ks3wOrlx69jQbXAlvZcPU1Lz0QSwF7zwBzWwO/oL+/AD5U8NpsLvNArA8CP88G0fod+U1KP6u/5wZ79ECsXYBLGsSo7a7vB97dthNl7++BWIel8N6yY7dyvRIxlrfibM9PD8RS3NJnrQFfwl8lv5rbn/NArB8A25SYKGuX/gNQfJkp80Csu5LGgingSzj7CqCTBVPmgVjaalC4jGdT6poESMyYB2IpjHd+M4hXc1QqN89Va9pOKw/EUqJnWVWYdtCuftdlgcerN598Sw/EUky41133HiPWT8khk2dIxTtaJ5b81+LWu0kWQAkiZsw6sd4I/NsM2tUdvRjYvXrzybe0Tqw3WftaqjjFet3rIPrWiu0n3sw6sbRx+PeJo9bODU8FDmjn1uXvap1Y0gx1L2KWplV6WluWn+J2WlgnlmKxXAqX9aGDNE0lvGvCrBOrS69CUwt468R6AyBdqS6YRHi/ZmWg1oklnKXpae6QtgJBJBX+vQrtWmnigVgvAgu0gt7kbqqn8pKWzgs9EEtp9dI38Gw3pUoZZsbogVhKpFBChWdTJrQyos2YB2KdD+xpBvHyjuosVNENT5Rv2l4LD8T6RKq81R6Kzd5Zyn7vb/YW9ffugVjaff+zxbjwgtO5m8X0Ng/E0vxIvkgyRt7sYUDqz+Z0SL0QS+EzyhjOtfJEVcJLoPeKqo3bbOeFWMJwHUDrEe3GezBTZ4PTAfdELI3tJOBAB6xSxIbUcyQmZ9K8EWvlpJpsPQZe2ycXmmRUctobsTSsHwJbG56UnwBbGPZ/luseibVcWmstZXRyVJ/6XqO+z3bbI7E0OKVLqUCTtXxD1ZFeyzqpvD6xevPy1VRI3NI8HQnIb/Pm9YmliVksZQ9L98CKfQT4mRVnh/npmVjWFvKSK1oCkBaFefNOLAmyWSkoaVLPfdBfgHdiKQBQgYAWbGPgFguOFvHRO7GEwSPAikXAaPGaPwCrtnj/2m/dBWKdB+xVO3L1dvhlDwXGp0LSBWIpnknrl1xNITHa1DUVIToKzC4QS4rDkrSWgEiOZrLyxCggu0AsYZBzXLw2RLUx6sq6Qiydv92d6cxtBtyQqW+V3eoKsQTQHZnWpFGoj75cXVmXiLVfprl5CwHK5nZlXSLWesCvM5u9mSmU2p2OapeIpXO4pzMjltxR8QN3Gl9dIpYmMUdNeGUW/S5Dwo/lUpeIpTh4SR7lNmYdlKumtSvLDeQmwc31QNpFjPv0iesKsTROPRX2bZK5FfvWAn5D4PaK7bNs1gViSQnvoDR5WU4CoOgGhc3k+HFRCTPPxFobOAX4QCVkJt/oAWB/QCJr5s0jsZRi/01AYmUWtUml1bC39cII3oglLVJNzFbG/+QfBLZNWd0mh+KJWAqP+RGgHXYP9hiwgdU4LS/E0lbC9cAqHhg1ZQxKYNWi3ly9IA/EWheQ5M87nJGqN5wbkxaFqfJ5loklsbXDAcWL6789mwoH7JRODkyM0yKxdDQjQduvOHz1DSONKqzuYqWirCViLZKA1TbCaib+bOt3UoWatBWR/Wsxd2LNB3wY2BH4WAdKmxSh4p3paEr/Zms5EkvxSdqH2gbYFFCEZdicCOh88TbgUuDKHIuB5kIsvdpEJP1ILN/ijnlb5FeM2Y8TyfRvFq/JNoglMTSd4+kMTxuA+lFlq7DxEXguPcEuaTtaYhLEWjyRp0ck7TvNPz6G0cMIBJT58+30JHto0mg1QSwJcGi3WDFGIpPELpq4z6Sxsno/rceURKKn2OWTqnlYx4SrJIeIpB+Vd1vG6gx0wG+tx6QqrW2L65rccK1CLEUQSC5aAXSSNnx7BybE4xAVVHhZEkypXaW5DLG0Ljoe+DRgSdfTIynqHpOIJUUercn+UkfnZYilc7lj67hp9JEtAqo9fS1w9LhaF0WJpS87SS4unC0k4VidCCgzW0+vI5IEVOm+ixLrAODk0r1HA+sI/DPlDehNVSomrCixclVqsT5xVvxXooc+1u4v6nARYr0TUMdFri1637jOHgJ6Yu2agipHel+ELDOAY0b2FBd0AQHtg2m/Um+woVaEWLcays0bNd74/fgIPA7oWG5ocu0oYim47llH5XDHhzV6EAKnAZ8fBsUoYmnBdnVgGQhMQ0DrrWWBvw1CZhSxzspUSCNmun0E9gHOrUosCYKt0f4YwoMMEZCMwcFViKWQYFVTj2jODGc1A5e0RNqhCrGUxHBzBgMIF/JE4L5hb7Nha6xDUzRDnsMKr9pGQOeJSnzRW+11NoxYetTpqzAsEBiEwHaDduKHEeupCOILRo1AQOo+yqwq/MTS+aA0msICgWEIqCSeuPK6KraDnlgqHKkCkmGBwCgEvgEcMv2iQcS6ANhjVI/x+0AghTIrgUbRp7NtELGUh6aqVGGBQBEEtgeuGUWspazKExZBIK5pBAHpd82xg9DvibVzyp5txIPo1CUCSu3XnpaSY2dZP2JZqPrucnaMD0rCLoo0HkisR4HljQ8y3J88Ap9Ktbf7Emsl4OHJ+xR3dICAQmgUStOXWLG+cjDDLQ1BIVaqvdiXWN8CvtCSY3Fb2wgo0WLBntDI9MX7LZlXybINvX/vJVmlSmZzfBUqoE8xzFKTCQsEqiAwO9ph6hNLIcjuahNXQSfaVEbgsF4M31Ri7Tn1c7Fy19GwywhICmnWGfNUYp0OqPB1WCBQFQFlSK8/nVjSqfRSkq0qMNFuPASUbzhL6qr3xNLCXf8z1IzHAzZav1qF7ckesSRQW1iiJtALBIYgILXs23rEUp0aSTWHBQLjIrCbpL97xDoO0KdiWCAwLgJHScO0RyzVYNly3B6jfSCQNOR37xFLmkdLByyBQA0ISE9tIxFLisjSwAoLBOpA4Ak9pEQsVZe4qY4eo49AIIUnLyBiabddu+5hgUBdCKwuYknn6It19Rj9BAJKuxexlLqjcIewQKAuBA4UsX4LvKeuHqOfQAA4ScR6MYL7ggw1I3CNiDU7ybDmzqO77iJwTxCru5Pf5Mhf+D9gO2eHwYwq7QAAAABJRU5ErkJggg==",
        company_id: company_id
      }
    });
    
    let s = {
      _id:                uid,
      avatar:             "data:image/png;base64,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",
      fname:              fname,
      lname:              lname,
      fullName:           fname + ' ' + lname,
      email:              email,
      department:         dept,
      company:            company,
      company_id:         company_id,
      role:               opt,
      current_credits:    0,
      required_credits:   0,
      compl_courses_cnt:  0,
      degrees:            [],
      certifications:     [],
      courses_completed:  [],
      current_courses:    [],
      password:           "",
      current_trainings:  [],
      compl_trainings:    [],
      articles_read:      [],
      created_at:         new Date()      
    };
    
    if ( trial ) {
      s.startTrial = new Date;
    }
    
    Students.insert({ s });
  },
//-----------------------------------------------------------------------------


  /*
   * ADD EVENT
   *
   * @method  addEvent( e )
   *
   * CALENDARING
   */
  addEvent( event ) {
    check( event, {
      title:        String,
      start:        Date,
      end:          Date,
      students:     [String],
      location:     String,
      description:  String,
      startTime:    String,
      endTime:      String,
      timezone:     String,
      //courses: [String]
    });

    try {
      
      /* USE METEOR.defer || applicable to send notification email */
      return Events.insert( event );
    } catch ( exception ) {
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
//-----------------------------------------------------------------------------


  /*
   * EDIT EVENT
   *
   * @method  editEvent( e )
   *
   * CALENDARING
   */
  editEvent( event ) {
    check( event, {
      _id:          String,
      title:        Match.Optional( String ),
      start:        Date,
      end:          Date,
      students:     Match.Optional( [String] ),
      location:     String,
      description:  String,
      startTime:    String,
      endTime:      String,
      timezone:     String,
      //courses: Match.Optional( [String] )
    });
    
    try {
      return Events.update( event._id, {
        $set: event
      });
      
    } catch ( exception ) {
      
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
//-----------------------------------------------------------------------------


  /*
   * DELETE EVENT
   *
   * @method  removeEvent( e )
   *
   * CALENDARING
   */
  removeEvent( event ) {
    check( event, String );

    try {
      // GET ALL STUDENTS ADDED TO THIS EVENT
      let s  = Students.find( { current_trainings:{ $elemMatch: {link_id: event }}} ).fetch();

      // DELETE EACH
      for( let i=0, len = s.length; i < len; i++ ) {

        Students.update({ _id: s[i]._id }, { $pull: {current_trainings:{link_id: event }} });
      }
      
      // DELETE THE EVENT
      return Events.remove( event );
      
    } catch ( exception ) {
      
      throw new Meteor.Error( '500', `${ exception }` );
    }
  },
  
  
  /*
   * CURATED ARTICLE STUDENT UPDATE
   */
  curatedArticleStudentUpdate( linkText, linkId ) {
    
    Students.update({ _id: Meteor.userId() }, 
                    { 
                      $inc:{ current_credits: 1 }, 
                      $addToSet:{ articles_read: { name: linkText, link_id: linkId } }
                    });
  },
  
  
  /*
   * UPDATE (STUDENT) CURRENT COURSES
   */
  updateCurrentCourses( cid ) {

    Students.update({ _id: Meteor.userId() },
                    { 
                      $push:{current_courses: {link_id: cid } }
                    });
  },
  
  
  /*
   * COURSE COMPLETION (STUDENT) UPDATE
   */
  courseCompletionUpdate( name, cid, percent, credits ) {
    console.log( credits );
    Students.update({ _id: Meteor.userId() },
                    { 
                      $pull:{ current_courses:{ link_id: cid }},
                      $push:{ courses_completed: { name: name, link_id: cid, passing_percent: percent, credits: credits, date_completed: new Date() }},
                      $inc:{ current_credits: Number(credits), compl_courses_cnt: 1 }
                    });
  },
});