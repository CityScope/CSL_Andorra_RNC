$(window).on("load", parseJson());

var hoursData;

function parseJson() {


  $.getJSON('data/full.json', function (data) {
    viz(data);
  })
}