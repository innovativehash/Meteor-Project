/*
 * @module createDOM
 *
 * @programmer Nick Sardo <nsardo@aol.com>
 */
export class CreateDOM {
  
  constructor( o ) {
    this.domObj = o;
    this.titles = [];
    this.texts  = [];
    this.images = [];
    this.pdfs   = [];
    this.videos = [];
    this.markup = [];
  }

  makeTitle( obj ){

    this.titles.push(`<span id="${obj.id}" style="cursor:move;position:relative;font-size:${obj.fontSize};font-style:${obj.fontStyle};font-weight:${obj.fontWeight};opacity:${obj.opacity};text-decoration:${obj.textDecoration};">${obj.text}</span>`);
    this.markup.push( 
                      `$('#${obj.id}').offset({ top: ${obj.offset.top}, left: ${obj.offset.left} });`,
                      `$('#${obj.id}').draggable();`
                    );
                      
  }

  makeText( obj ){

    this.texts.push(`<span id="${obj.id}" style="cursor:move;position:relative;font-size:${obj.fontSize};font-style:${obj.fontStyle};font-weight:${obj.fontWeight};opacity:${obj.opacity};text-decoration:${obj.textDecoration};">${obj.text}</span>`);
    this.markup.push( 
                      `$('#${obj.id}').offset({ top: ${obj.offset.top}, left: ${obj.offset.left} });`,
                      `$('#${obj.id}').draggable();`
                    );
  }

  makeImage( obj ) {

    this.images.push( `<div id="${obj.id}" data-img_lnk="${obj.img_lnk}" class="ui-widget" style="position:relative;cursor:move;text-align: center; width:${obj.dwidth}px;height:${obj.dheight}px;border: 4px solid #eeepadding 10px; float: left; margin: 0 auto;box-shadow:5px 5px 5px #888;opacity:${obj.opacity}"><img id="${obj.iid}" src="${obj.src}" style="position:relative;width:${obj.iwidth}px;height:${obj.iheight}px;"></div>`);
    this.markup.push( 
                      `$('#${obj.id}').offset({ top: ${obj.offset.top}, left: ${obj.offset.left} });`,
                      `$('#${obj.id}').draggable();`,
                      `$('#${obj.id}').resizable({ handles: "all", autoHide: false, aspectRatio: true, alsoResize: "#${obj.iid}" });`
                    );
    
  }
  
  makeVideo( obj ) {

    this.videos.push( obj.url );

  }

  makePdf( obj ) {

    this.pdfs.push( obj.url );

  }

  
  buildDOM() {
    for ( let i = 0, ilen = this.domObj.length; i < ilen; i++ ) {
      switch( this.domObj[i].type ) {
        case 'title':
          this.makeTitle( this.domObj[i] );
          break;
        case 'text':
          this.makeText( this.domObj[i] );
          break;
        case 'image':
          this.makeImage( this.domObj[i] );
          break;
        case 'pdf':
          this.makePdf( this.domObj[i] );
          break;
        case 'video':
          this.makeVideo( this.domObj[i] );
          break;
      }
    }
    
    let ret_str = '';
    for ( let j = 0, jlen = this.titles.length; j < jlen; j++ ) {
      ret_str += this.titles[j];
    }
    for ( let k = 0, klen = this.texts.length; k < klen; k++ ) {
      ret_str += this.texts[k];
    }
    for ( let l = 0, llen = this.images.length; l < llen; l++ ) {
      ret_str += this.images[l];
    }
    for ( let m = 0, mlen = this.pdfs.length; m < mlen; m++ ) {
      ret_str += this.pdfs[m];
    }
    for ( let n = 0, nlen = this.videos.length; n < nlen; n++ ) {
      ret_str += this.videos[n];
    }
    
    return [ret_str, this.markup];
  }
}