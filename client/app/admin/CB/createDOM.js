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
    this.markup = [];
  }

  makeTitle( obj ){

    this.titles.push(`<span id="${obj.id}" style="position:relative;font-size:${obj.fontSize};font-style:${obj.fontStyle};font-weight:${obj.fontWeight};opacity:${obj.opacity};text-decoration:${obj.textDecoration};">${obj.text}</span>`);
    this.markup.push( `$('#${obj.id}').offset({ top: ${obj.offset.top}, left: ${obj.offset.left} });` );
  }

  makeTexts( obj ){

    this.texts.push(`<span id="${obj.id}" style="position:relative;font-size:${obj.fontSize};font-style:${obj.fontStyle};font-weight:${obj.fontWeight};opacity:${obj.opacity};text-decoration:${obj.textDecoration};">${obj.text}</span>`);
    this.markup.push( `$('#${obj.id}').offset({ top: ${obj.offset.top}, left: ${obj.offset.left} });`);
  }
/*
  makeImages() {
    let len           = this.domObj.images.length
      , imagesA       = '';

    for ( let i = 0; i < len; i++ ) {
      if ( this.domObj.images[i] ) {
        imagesA += `<img src="${this.domObj.images[i].image}" style="left:${this.domObj.images[i].left};top:${this.domObj.images[i].top};position:absolute;">`;
      }
    }
    return imagesA;
  }

  makeVideos() {
    let len           = this.domObj.videos.length
      , videosA       = '';

    for ( let i = 0; i < len; i++ ) {
      if ( this.domObj.videos[i] ) {
        videosA += this.domObj.videos[i].url;
      }
    }
    return videosA;
  }

  makePdfs() {
    let len   = this.domObj.pdfs.length
      , pdfsA = '';
      
    for ( let i = 0; i < len; i++ ) {
      if ( this.domObj.pdfs[i] ) {
        pdfsA += this.domObj.pdfs[i].url;
      }
    }
    return pdfsA;
  }
*/ 
  
  buildDOM() {
    for ( let i = 0, ilen = this.domObj.length; i < ilen; i++ ) {
      switch( this.domObj[i].type ) {
        case 'title':
          this.makeTitle( this.domObj[i] );
          break;
        case 'text':
          this.makeText( this.domObj[i] );
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
    return [ret_str, this.markup];
  }
}