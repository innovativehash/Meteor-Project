/*
 * @module powerPointHandling
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 * @copyright  2016-2017 Collective Innovations
 */




  /**
   *
   * #CB-POWERPOINT-SAVE  ::(CLICK)::
   *
   * id = add-powerpoint
   * powerpoint dialog
   */
  export function cbPowerPointSave( e, t, cbo, contentTracker ) {
    e.preventDefault();
    e.stopImmediatePropagation();

    Template.instance().page.set( Template.instance().page.get()    + 1 );
    Template.instance().total.set( Template.instance().total.get()  + 1 );
//-----------------------------------------------------------------------------
  }