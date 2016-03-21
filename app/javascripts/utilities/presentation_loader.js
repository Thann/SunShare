
var presentations = {
  dummy: [
    {color: 'red', text: 'jon', img: 'https://www.google.com/logos/doodles/2016/first-day-of-spring-2016-northern-hemisphere-5727786629070848.4-hp.gif'},
    {color: 'black', text: 'charles', img: 'https://www.google.com/logos/doodles/2016/first-day-of-spring-2016-northern-hemisphere-5727786629070848.4-hp.gif'},
    {color: 'green', text: 'juan', img: 'https://www.google.com/logos/doodles/2016/first-day-of-spring-2016-northern-hemisphere-5727786629070848.4-hp.gif'},
  ]
}

module.exports = {
  load: function(pres) {
    console.log('Loading Pres:', pres)
    this.slides = presentations[pres];
    if (typeof this.onload == 'function') this.onload.apply(this, this.slides)
  },
  // upload: function() {
  // },
  slides: [],
  onload: null, // function() {}
}