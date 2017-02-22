/*
 * @module importCV
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */
import { Template }     from 'meteor/templating';
import { ReactiveVar }  from 'meteor/reactive-var';

import '../../templates/admin/import-cv.html';



/*=======================================
 * CREATED
 *=======================================*/
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

    $( '#csv-dialog' ).dialog({
        autoOpen: false,
        position: {
          my: "left top",
          at: "left top",
          of: "#csv-help-btn"
        }
    });    
      //console.log('insertCSV:: jquery-ui.min.js loaded...');
  }).fail( function( jqxhr, settings, exception ) {
    console.log( 'importCSV:: load jquery-ui.min.js fail' );
//-------------------------------------------------------------------
  });

});



/*======================================
 * RENDERED
 *=====================================*/
Template.importCV.onRendered(function(){
  $( '#csv-cover' ).delay( 100 ).fadeOut( 'slow', function() {
    $( "#csv-cover" ).hide();
    $( ".import-body" ).fadeIn( 'slow' );
  });
  
});



/*=======================================
 * DESTROYED
 *======================================*/
Template.importCV.onDestroyed(function(){
  console.log( 'in csv destroyed');//DEBUG

  results        = null;
});



/*=========================
 * HELPERS
 *========================*/
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



/*========================
 * EVENTS
 *=======================*/
Template.importCV.events({


  /********************************
   * 
   * #DASHBOARD-PAGE  ::(CLICK)::
   * 
   ********************************/
  'click #dashboard-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-dashboard', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },



  /*****************************
   *
   * #STUDENTS-PAGE  ::(CLICK)::
   * 
   *****************************/
  'click #students-page'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    FlowRouter.go( 'admin-students', { _id: Meteor.userId() });
//-------------------------------------------------------------------
  },



  /******************************
   * 
   * #CSV-HELP-BUTTON ::(CLICK)::
   * 
   ******************************/
  'click #csv-help-btn'( e, t ) {
    e.preventDefault();
    console.log('clickjab');
    $( '#csv-dialog' ).dialog("open");
    $( '#csv-dialog button.ui-state-disabled:active' ).css('background-color','none');
  },
  
  
  
  /********************
   * 
   * #CSV  ::(CHANGE)::
   * 
   ********************/
  'change #csv'( e, t ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    
    let itype = ''
      , fil
      , raw_file;
      
    if ( e.currentTarget.files === 'undefined' ) {
      console.log('aborted');
      return;
    } else {
      raw_file = e.currentTarget.files[0]
    }

    //itype = raw_file.split(',');
   //console.log( itype );

    //itype = itype.name.slice( itype.name.length - 3);
  /*  
    if ( raw_file.type != 'text/csv' || !itype ) {
      Bert.alert('Incompatible File Type: Must be CSV', 'danger');
      e.currentTarget.files = undefined;
      e.currentTarget.files[0] = undefined;
      e.currentTarget.files[0].name = undefined;
      itype = '';
      return;
    }
  */
  // text/plain, text/csv
    fil = $( '#csv' ).get(0).files[0];

    var fr = new FileReader();
    
    fr.onload = function(e) {
      let s, slen = s1 = m = 0;
      //console.log( e.target.result ); //typeof is String
      raw_file = e.target.result;
      
      s     = raw_file.split('\n');
      slen  = raw_file.split('\n').length -1;
      
      if ( slen == 0 ) {
        console.log( 'not separate lines' );
        t.$( '#csv-error1' ).text('NO SEPARATE LINES IN FILE').css({'margin':'5px 5px 5px 5px;','padding':'5px 5px 5px 5px;','border':'1px dashed red','border-radius':'5px','background-color':'Crimson','color':'white', 'font-weight':'900'});
        return;
      } else {
        t.$( '#csv-error1' ).text('');
        t.$( '#csv-error1' ).attr('style',''); //remove artifacts from screen
      }
      
      for( let i = 0; i < slen; i++ ) {
        
        if ( i == 0 ) { //BASE CASE
          m = s[i].split(',').length - 1;
          s1 += m;
        } else {
          if ( s[i].split(',').length - 1 != m ) {
            console.log( 'separator mismatch');
            console.log( i );
            t.$( '#csv-error2' ).text(`SEPARATOR MISMATCH IN FILE ON LINE ${i+1}`).css({'margin':'5px 5px 5px 5px;','padding':'5px 5px 5px 5px;','border':'1px dashed red','border-radius':'5px','background-color':'Crimson','color':'white', 'font-weight':'900'});
            s1 = 0;
            return;
          } else {
            s1 += s[i].split(',').length -1;
            t.$( '#csv-error2' ).text('');
            t.$( '#csv-error2' ).attr('style',''); //remove artifacts from screen
          }
        }
        console.log( 'not in conditions i= ' + i );
      }
      
    };
    
    fr.readAsText(fil);
    

    Meteor.setTimeout( function() {
        if ( s1 == 0 ) {
          Bert.alert('Not a valid input file', 'danger');
          return;
        }
        
        Papa.parse( raw_file, { //fil
          config: { header: true },
	        complete: function( results ) {
	          t.res.set( results.data );
	        },
	        error: function(err, file, inputElem, reason) {
	          console.log( err );
	          console.log( file );
	          console.log( inputElem );
	          console.log( reason );
	        }
        });//papa
    }, 200);
    raw_file = fil = fr = null;
    $( '#csv' ).val('');
    //$( '#csv' ).attr( 'disabled','disabled' );
    return;
//-------------------------------------------------------------------
  },



  /*******************************************
   * 
   * .JS-IMPORT-STUDENTS-FROM-CSV  ::(CLICK)::
   * 
   *******************************************/
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
      $( "#cv-student-import-confirm" ).modal( 'show' );
    }, 100);
//-------------------------------------------------------------------
  },



  'click #cv-leave-yes'( e, t ) {
    e.preventDefault();
    
    $( '#csv' ).attr( 'disabled', '' );
    t.res.set( null );
    
    $( "#cv-student-import-confirm" ).modal('hide');
    
        //NECESSARY DELAY OR DIALOG CAUSES DISPLAY ISSUES ON DESTINATION
    Meteor.setTimeout(function(){
      FlowRouter.go( 'admin-students', { _id: Meteor.userId() });
    }, 500);
//-------------------------------------------------------------------
  },
  
});
