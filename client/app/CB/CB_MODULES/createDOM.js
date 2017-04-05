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
	  
	//Rahman: changes on makeTitle for course viewer alignment fixes for mobile & desktop
  
    /*this.titles.push(`<span id="${obj.id}" style="cursor:move;
                                                  position:relative;
                                                  top:${obj.offset.top};
                                                  left:${obj.offset.left};
                                                  font-size:${obj.fontSize};
                                                  font-style:${obj.fontStyle};
                                                  font-weight:${obj.fontWeight};
                                                  opacity:${obj.opacity};
                                                  text-decoration:${obj.textDecoration};">
                          ${obj.text}
                      </span>`);
                      
    this.markup.push(
                      `$('#${obj.id}').offset({ top: ${obj.offset.top}, left: ${obj.offset.left} });`,
                      `$('#${obj.id}').draggable({ containment: "#fb-template", scroll: false });`
                    );*/
					
	this.titles.push(`<span id="${obj.id}" style="cursor:move;
                                                  position:relative;                                                 
                                                  font-size:${obj.fontSize};
                                                  font-style:${obj.fontStyle};
                                                  font-weight:${obj.fontWeight};
                                                  opacity:${obj.opacity};
                                                  text-decoration:${obj.textDecoration};">
                          ${obj.text}
                      </span>`);
                      
    this.markup.push(
                      `$('#${obj.id}').offset({ margin-bottom:10px; });`,
                      `$('#${obj.id}').draggable({ containment: "#fb-template", scroll: false });`
                    );				

  }
  makeText( obj ){
    try {
      if ( obj && obj.offset == undefined ) {
        obj.offset = $(`#${obj.id}`).offset()
      }
    } catch (e) {
        obj.offset = $(`#${obj.id}`).offset();
    }
	
	//Rahman: changes on makeText for course viewer alignment fixes for mobile & desktop
	
  /*  this.texts.push(`<span id="${obj.id}" style="cursor:move;
                                                  position:relative;
                                                  top:${obj.offset.top};
                                                  left:${obj.offset.left};
                                                  font-size:${obj.fontSize};
                                                  font-style:${obj.fontStyle};
                                                  font-weight:${obj.fontWeight};
                                                  opacity:${obj.opacity};
                                                  text-decoration:${obj.textDecoration};">
                          ${obj.text}
                      </span>`);
                      
    this.markup.push(
                      `$('#${obj.id}').offset({ top: ${obj.offset.top}, left: ${obj.offset.left} });`,
                      `$('#${obj.id}').draggable({ containment: "#fb-template", scroll: false });`
                    );*/
					
		 this.texts.push(`<span id="${obj.id}" style="cursor:move;
                                                  position:relative;                                                  
                                                  font-style:${obj.fontStyle};
                                                  font-weight:${obj.fontWeight};
                                                  opacity:${obj.opacity};
                                                  text-decoration:${obj.textDecoration};">
                          ${obj.text}
                      </span>`);
                      
    this.markup.push(
                      `$('#${obj.id}').offset({ margin-bottom:10px; });`,
                      `$('#${obj.id}').draggable({ containment: "#fb-template", scroll: false });`
                    );			
  }
//Rahman: changes on makeText for course viewer alignment fixes for mobile & desktop
  makeImage( obj ) {
    /*this.images.push( `
                       <div id="${obj.id}" style="position:relative;
                                                  top:${obj.offset.top}px;
                                                  left:${obj.offset.left}px;
                                                  background-image:${obj.src};
                                                  width:${obj.width}px;
                                                  height:${obj.height}px;
                                                  background-size:cover;">
                       </div>`);
    this.markup.push(
                      `$('#${obj.id}').offset({ top: ${obj.offset.top}, left: ${obj.offset.left} });`,
                      `$('#${obj.id}').draggable({ containment: "#fb-template", scroll: false });`,
                      `$('#${obj.id}').resizable({ autoHide: false, aspectRatio: true, containment: "#fb-template" });`
                    );
					*/
					this.images.push( `
                       <div id="${obj.id}" style="position:relative;                                                  
                                                  background-image:${obj.src};
                                                  width:${obj.width}px;
                                                  height:${obj.height}px;
                                                  background-size:cover;">
                       </div>`);
    this.markup.push(
                      `$('#${obj.id}').offset({ margin-bottom:10px; });`,
                      `$('#${obj.id}').draggable({ containment: "#fb-template", scroll: false });`,
                      `$('#${obj.id}').resizable({ autoHide: false, aspectRatio: true, containment: "#fb-template" });`
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