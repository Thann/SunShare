
var dummyPres = [
  {color: 'red', text: 'jon', img: 'https://www.google.com/logos/doodles/2016/first-day-of-spring-2016-northern-hemisphere-5727786629070848.4-hp.gif'},
  {color: 'black', text: 'charles', img: 'https://www.google.com/logos/doodles/2016/first-day-of-spring-2016-northern-hemisphere-5727786629070848.4-hp.gif'},
]

module.exports = {
  load: function(pres) {
    console.log('Loading Pres:', pres)
    this.slides = dummyPres;
    console.log('OOO',this.onchange)
    if (typeof this.onchange == 'function') this.onchange();
  },
  // upload: function() {
  // },
  slides: []
}