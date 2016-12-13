/*
 * @module importCV
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import '../../templates/admin/import-cv.html';
/*
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.structure.min.css';
import '../../../public/jquery-ui-1.12.0.custom/jquery-ui.theme.min.css';
*/


/*
 * CREATED
 */
Template.importCV.onCreated( function() {

  this.res = new ReactiveVar();

  $( "#csv-cover" ).show();


  /*
   * BOOTSTRAP-SELECT
   */
  $.getScript( '/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js', function() {
    $( '.selectpicker' ).selectpicker({ style: "btn-new", title:"Choose One" });
    //console.log('importCSV:: bootstrap.min.js loaded...');
  }).fail( function(jqxhr, settings, exception ) {
    console.log( 'importCSV:: load bootstrap-select.min.js fail' );
//-------------------------------------------------------------------
  });


  /*
   * PAPA PARSE
   */
  $.getScript( '/js/papaparse.min.js', function() {
      //console.log('insertCSV:: papaparse.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'importCSV:: load papaparse.min.js fail' );
//-------------------------------------------------------------------
  });


  /*
   * JQUERY-UI
   */
  $.getScript( '/jquery-ui-1.12.0.custom/jquery-ui.min.js', function() {
      //console.log('insertCSV:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'importCSV:: load jquery-ui.min.js fail' );
//-------------------------------------------------------------------
  });

});


/*
 * RENDERED
 */
Template.importCV.onRendered(function(){
  $( '#csv-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#csv-cover" ).hide();
    $( ".import-body" ).fadeIn( 'slow' );
  });
});


/*
 * DESTROYED
 */
Template.importCV.onDestroyed(function(){
  console.log( 'in csv destroyed');//DEBUG

  results        = null;
});


/*
 * HELPERS
 */
Template.importCV.helpers({

  names: () => {
    try {
        let len, headers, obj = {};
        let foo = Template.instance().res.get();
        headers = foo[0];
        len     = headers.length;
        for ( let i = 0; i < len; i++ ) {
          obj[ 'col' + i ] = {};
          obj[ 'col' + i ] = headers[i];
        }
        return obj;
    } catch (e) {
      return;
    }
  },

  td: () => {

    try {
      let len, num, headers, records, obj = {};
      let foo = Template.instance().res.get();
      headers = foo[0];
      records = foo.slice(1);

      len = headers.length;
      num = records.length;
      for( let i = 0; i < num; i++ ) {
        obj[ 'row' + i ] = {};
        for( let j = 0; j < len; j++ ) {
         obj[ 'row' + i ][ 'col' + j ] =  records[i][j];
        }
      }
    return obj;

    } catch (e) {
      return;
    }
  },

});


/*
 * EVENTS
 */
Template.importCV.events({

  /*
   * #DASHBOARD-PAGE  ::(CLICK)::
   */
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * #STUDENTS-PAGE  ::(CLICK)::
   */
  'click #students-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-students', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },


  /*
   * #CSV  ::(CHANGE)::
   */
  'change #csv'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    }

    let mark = ( e.currentTarget.files[0].name ).lastIndexOf( '.' ) + 1;
    let ext  = ( e.currentTarget.files[0].name ).slice( mark );
    fil      = $( '#csv' ).get(0).files[0];

    Meteor.setTimeout( function() {

        Papa.parse( fil, {
          config: { header: true },
	        complete: function( results ) {
	          t.res.set( results.data );
	        }
        });//papa
    }, 200);
    $( '#csv' ).attr( 'disabled','disabled' );
    return;
//-------------------------------------------------------------------
  },


  /*
   * .JS-IMPORT-STUDENTS-FROM-CSV  ::(CLICK)::
   */
  'click .js-import-students-from-csv'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    let
      num_props, num_recs, records, temp, pa,
      studentObj = {},
      errStr = 'you must assign a mapping to all fields.',
      p0 = $( '.selectpicker.p0 option:selected' ).val(),
      p1 = $( '.selectpicker.p1 option:selected' ).val(),
      p2 = $( '.selectpicker.p2 option:selected' ).val(),
      p3 = $( '.selectpicker.p3 option:selected' ).val(),
      p4 = $( '.selectpicker.p4 option:selected' ).val();

    temp      = Template.instance().res.get();
    headers   = temp[0];
    num_props = headers.length;
    records   = temp.slice(1);
    num_recs  = records.length;

    if ( p0 == '' && num_props >  0 ) console.log( errStr );
    if ( p1 == '' && num_props >= 1 ) console.log( errStr );
    if ( p2 == '' && num_props >= 2 ) console.log( errStr );
    if ( p3 == '' && num_props >= 3 ) console.log( errStr );
    if ( p4 == '' && num_props >  4 ) console.log( errStr );

    pa = [ p0, p1, p2, p3, p4 ];
    for ( let i = 0; i < num_recs; i++ ) {
      for ( let j = 0; j < num_props; j++ ) {
        switch( pa[j] ) {
          case 'f':
            studentObj.f = records[i][j];
            break;
          case 'l':
            studentObj.l = records[i][j];
            break;
          case 'e':
            studentObj.e = records[i][j];
            break;
          case 'd':
            studentObj.d = records[i][j];
            break;
          case 'c':
            studentObj.c = records[i][j];
            break;
        }
      }
      Meteor.call(  'addUser',
                    studentObj.e,
                    "pass",
                    studentObj.f,
                    studentObj.l,
                    studentObj.c = studentObj.c || "student",
                    studentObj.d = studentObj.d || "sales");
    }

    Meteor.setTimeout(function() {
      $( "#dialog-message" ).dialog({
        dialogClass: "no-close",
        height: "auto",
        width: 400,
        resizable: false,
        modal: true,
        buttons: {
          Ok: function() {
            $( this ).dialog( "close" );
            $( '#csv' ).attr( 'disabled', '' );
            t.res.set( null );

            FlowRouter.go( 'admin-students', { _id: Meteor.userId() });
          }
        }
      });
    }, 100);
//-------------------------------------------------------------------
  },

});
