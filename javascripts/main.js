var sectionHeight = function() {
  var total    = $(window).height(),
      $section = $('section').css('height','auto');

  if ($section.outerHeight(true) < total) {
    var margin = $section.outerHeight(true) - $section.height();
    $section.height(total - margin - 20);
  } else {
    $section.css('height','auto');
  }
}

$(window).resize(sectionHeight);

$(document).ready(function(){
  $("section h1, section h2").each(function(){
    $("nav ul").append("<li class='tag-" + this.nodeName.toLowerCase() + "'><a href='#" + $(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,'') + "'>" + $(this).text() + "</a></li>");
    $(this).attr("id",$(this).text().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g,''));
    $("nav ul li:first-child a").parent().addClass("active");
  });
  
  $("nav ul li").on("click", "a", function(event) {
    var position = $($(this).attr("href")).offset().top - 190;
    $("html, body").animate({scrollTop: position}, 400);
    $("nav ul li a").parent().removeClass("active");
    $(this).parent().addClass("active");
    event.preventDefault();    
  });
  
  sectionHeight();
  
  $('img').load(sectionHeight);
});

fixScale = function(doc) {

  var addEvent = 'addEventListener',
      type = 'gesturestart',
      qsa = 'querySelectorAll',
      scales = [1, 1],
      meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

  function fix() {
    meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
    doc.removeEventListener(type, fix, true);
  }

  if ((meta = meta[meta.length - 1]) && addEvent in doc) {
    fix();
    scales = [.25, 1.6];
    doc[addEvent](type, fix, true);
  }
};

var META = [
  "Bildung/Lernen.tsv",
  "Gesundheit_und_Koerperpflege/Koerperpflege.tsv"
];
var FLASH = [['mattis','sittam']];
var CFG = {};

function activateFlashes(){
  var topics = document.getElementById('topics');
  var txt = '';
  for (var i=0,m; m=META[i]; i++) {
    txt += '<li><button onclick="setFlash(\''+m+'\');">'+m.replace(/_/g,' ')+'</button></li>';
  }
  topics.innerHTML = '<ul>'+txt+'</ul>';
}

function setFlash(flash){
  $.ajax({
        async: false,
        type: "GET",
        contentType: "application/text; charset=utf-8",
        url: 'data/'+flash,
        dataType: "text",
        success: function(data) {
          FLASH = [];
          lines = data.split('\n');
          console.log(lines);
          for(var i=0; i<lines.length; i++) {
            console.log(i);
            var line = lines[i];
            if(line.indexOf('\t') != -1) {

              var lineAB = line.split('\t');
              var lineA = lineAB[0];
              var lineB = lineAB[1];
              FLASH.push([lineA,lineB]);
              console.log(lineA);
            }
          }
          console.log('ENDOFFOR');
        },
        error: function() {
          console.log('ERROR');
          console.log('ERROR','../data/'+flash);
        }    
  });

  //FLASH = shuffle(FLASH);
  CFG['current'] = 0;
  CFG['correct'] = [];
  CFG['wrong'] = [];
  console.log('flashlength',FLASH.length);
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


function flashcard(direction) {
  
  var current = CFG['current'];
  console.log(CFG,CFG['content'],FLASH);

  if (direction == 'a') {
    var contentA = FLASH[current][0];
    var contentB = FLASH[current][1];
    var newd = 'b';
  }
  else {
    var contentA = FLASH[current][1];
    var contentB = FLASH[current][0];
    var newd = 'a';
  }

  var gone = current+1;
  var togo = FLASH.length - current;
  
  var flashy = document.getElementById('flashy');
  var txt = '';
  txt += '<div class="popup_background">';
  txt += ''
    + '<div class="breaker flx"><span>'
    + gone + ' of ' + FLASH.length + ' have been tested ('
    + togo + ' items to go)'
    + '</span>'
    + '</div>'
    + '<div class="flashcard flx">'
    + '  <div onclick="flashcard(\''+newd+'\')" class="item border"><span>TURN</span></div>'
    + '  <div class="innerflashcard">'
    + '    <div class="horizontal" onclick="storeRight();"><span>RIGHT</span></div>'
    + '    <div class="item"><span>'+contentA+'</span></div>'
    + '    <div class="horizontal" onclick="storeWrong();"><span>WRONG</span></div>'
    + '  </div>'
    + '  <div onclick="flashcard(\''+newd+'\')" class="item border"><span>TURN</span></div>'
    + '</div>'
    + '<div class="breaker flx" onclick="breakFlash();"><span>STOP</span></div>'
    + '</div>';
  flashy.innerHTML = txt;
}

function storeRight() {
  var current = CFG['current'];
  if (current < FLASH.length-1) {
    CFG['current'] = current + 1;
    CFG['correct'].push(FLASH[current]);
    flashcard('a');
  }
  else {
    breakFlash();
  }
}

function storeWrong() {
  var current = CFG['current'];
  if (current < FLASH.length-1) {
    CFG['current'] = current + 1;
    CFG['wrong'].push(FLASH[current]);
    flashcard('a');
  }
  else {
    breakFlash();
  }
}

function breakFlash() {
  var flashy = document.getElementById('flashy');
  var alc = CFG['correct'].length + CFG['wrong'].length;
  var cor = CFG['correct'].length;
  var wro = CFG['wrong'].length;
  var per = parseInt(cor / alc * 100);
  var txt = '<div class="popup_background">'
    + '<div class="flashcard flx" onclick="breakFull();">'
    + '<table>'
    + '<tr><th> Number of Cards: </th><td>' + alc + '</td></tr>'
    + '<tr><th> Correct Cards: </th><td>' + cor + '</td></tr>'
    + '<tr><th> Wrong Cards: </th><td>' + wro + '</td></tr>'
    + '<tr><th> Percentage: </th><td>' + per + '</td></tr>'
    + '</table>'
    + '</div>'
    + '</div>';
  flashy.innerHTML = txt;

}

function breakFull() {
  var flashy = document.getElementById('flashy');
  flashy.innerHTML = '';
}
