
export class CreateDOM {

  constructor( o ) {
    this.domObj = o;
  }

  makeTitles(){
    let len           = this.domObj.titles.length
      , titlesA       = '';

    for ( let i = 0; i < len; i++ ) {
      if ( this.domObj.titles[i] ) {
        titlesA += `<span style="background-color:${this.domObj.titles[i].backgroundColor};position:absolute;left:${this.domObj.titles[i].left};top:${this.domObj.titles[i].top};font-size:${this.domObj.titles[i].fontSize};font-style:${this.domObj.titles[i].fontStyle};font-weight:${this.domObj.titles[i].fontWeight};opacity:${this.domObj.titles[i].opacity};text-decoration:${this.domObj.titles[i].textDecoration};">${this.domObj.titles[i].text}</span>`;
      }
    }
    return titlesA;
  }

  makeTexts(){
    let len         = this.domObj.texts.length
      , textsA      = '';

    for ( let i = 0; i < len; i++ ) {
      if ( this.domObj.texts[i] ) {
        textsA += `<span style="background-color:${this.domObj.texts[i].backgroundColor};position:absolute;left:${this.domObj.texts[i].left};top:${this.domObj.texts[i].top};font-size:${this.domObj.texts[i].fontSize};font-style:${this.domObj.texts[i].fontStyle};font-weight:${this.domObj.texts[i].fontWeight};opacity:${this.domObj.texts[i].opacity};text-decoration:${this.domObj.texts[i].textDecoration};">${this.domObj.texts[i].text}</span>`;
      }
    }
    return textsA;
  }

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
        videosA += `<div id="vid-${i}">`;
      }
    }
    return videosA;
  }

  buildDOM() {

    let l1 = this.domObj.images.length
      , l2 = this.domObj.titles.length
      , l3 = this.domObj.texts.length;

    for( let i = 0; i < l1; i++ ) {
      if ( this.domObj.images[i] )  $( `#ig-${i}` ).remove();
    }
    for( let i = 0; i < l2; i++ ) {
      if ( this.domObj.titles[i] )  $( `#div-title-${i}` ).remove()
    }
    for( let i = 0; i < l3; i++ ) {
      if ( this.domObj.texts[i] )   $( `#span-text-${i}` ).remove()
    }
    //$('#ig-0').remove();
    //$('#div-title-0').remove();
    //$('#span-text-0').remove();

    if ( ! this.makeImages() && ! this.makeTexts() && ! this.makeTitles() && ! this.makeVideos() ) {
      return false;
    } else {
      return `${ this.makeTitles() }${ this.makeTexts() }${ this.makeImages() }`;
    }

    //$('#fb-template').html( `${ this.makeTitles() }${ this.makeTexts() }${ this.makeImages() }` );
  }
}