/*
 * @module postbox
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */

import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

//import { Blaze } from 'meteor/blaze'

import { Newsfeeds }     from '../../../both/collections/api/newsfeeds.js';
import { Students }     from '../../../both/collections/api/students.js';

import '../../templates/shared/postbox.html';


/*
 * CREATED
 */
Template.postbox.onCreated(function() {

  Session.setDefault( 'photoClicked', false );

});



let ig = ''
  , ext;

/*
 * EVENTS
 */
Template.postbox.events({

  /*
   * #CANCEL  ::(CLICK)::
   */
  'click #cancel':  _.throttle( function( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $( '' ).hide();
  }, 1000),
//-------------------------------------------------------------------


  /*
   * #UL  ::(CHANGE)::
   */
  'change #ul'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let mark = ( e.currentTarget.files[0].name ).lastIndexOf( '.' ) + 1;

    ext  = ( e.currentTarget.files[0].name ).slice( mark );
    ext = ( ext == ('jpg' || 'jpeg' ) ) ? 'jpeg' : 'png';

    let fil = t.$( '#ul' ).get(0).files[0];
    let fr = new FileReader();

    fr.onload = function() {
      ig  = this.result;
    };

    fr.readAsDataURL( fil );

    var img = $( '<img height="32" width="32" />' );
    Meteor.setTimeout( function() {
      if ( ig ) {
        img.attr( "src", ig );
        img.appendTo( '#thumbnail' );
      } else {
        img = null;
      }
    }, 200);

    return;
//-------------------------------------------------------------------
  },


  /*
   * #POST, #POSTSUBMIT  ::(CLICK)::
   */
  'click #post, click #postSubmit':  function( e, t ) {
     e.preventDefault();
     e.stopImmediatePropagation();

     // $(event.currentTarget).attr('class')

     //TRANSITION ENTRY
      t.$( '.postText' ).css( "outline", "#0000FF solid thick" );

      let content = t.$( '.postText' ).val().trim();

      if ( content === null || content === 'undefined' || content === "" ) {
        return;
      }

      let name  = Meteor.user() && Meteor.user().username;
      let co_id = Meteor.user() && Meteor.user().profile.company_id;
      //let co_id = Students.findOne({_id: Meteor.userId()}).company_id;

      if ( ig ) {
        Newsfeeds.insert({  owner_id: Meteor.userId(),
                            poster: name,
                            poster_avatar: Meteor.user().profile.avatar,
                            type: "P",
                            private: false,
                            ext: ext,
                            bin: ig,
                            news: content,
                            comment_limit: 3,
                            likes: 0,
                            company_id: co_id,
                            date: new Date() });
      } else {
        Newsfeeds.insert({  owner_id: Meteor.userId(),
                            poster: name,
                            poster_avatar: Meteor.user().profile.avatar,
                            type: "P",
                            private: false,
                            news: content,
                            comment_limit: 3,
                            company_id: co_id,
                            likes: 0,
                            date: new Date() });
      }

      Meteor.setTimeout(function() {

        t.$( '.postText' ).val('');
        t.$( '#thumbnail img:last-child' ).remove();
        ig  = '';
        ext = '';
      }, 100);

      //TRANSITION EXIT
      t.$( '.postText' ).fadeOut( "slow", function() {
        // Animation complete.
        t.$( '.postText' ).css( "outline", "" );
      }).fadeIn( 'slow' );

		// NOTIFICATION
    Bert.alert( "Your post has been submitted!", 'success', 'growl-top-right' );
//-------------------------------------------------------------------
  },

});
