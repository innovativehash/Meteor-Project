/*
 * @module scormHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovation
 */



  /**
   *
   * #CB-SCORM-SAVE  ::(CLICK)::
   *
   * id = add-scorm
   * scorm dialog
   */
  export function cbScormSave( e, t, tbo, contentTracker ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get()    + 1 );
    Template.instance().total.set( Template.instance().total.get()  + 1 );
//-----------------------------------------------------------------------------
  }