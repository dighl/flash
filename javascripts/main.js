

var META = [
  "Bildung/Lernen.tsv",
  "Gesundheit_und_Koerperpflege/Koerperpflege.tsv"
];
var FLASH = [['mattis','sittam']];
var CFG = {};

function activateFlashes(){
  var topics = document.getElementById('topics');
  var txt = '';
  var tnm = '';
  for (var i=0,m; m=META[i]; i++) {
    var nm = m.replace(/_/g,' ');
    var nmab = nm.split('/');
    var nma = nmab[0];
    var nmb = nmab[1].replace(/\.tsv/,'');
    var nmid = m.replace(/\//g,'_').replace(/\.tsv/,'');
    if(tnm != nma) {
      txt += '<h3>'+nma+'</h3>';
    }
    tnm = nma;
    txt += '<p><div onclick="setFlash(\''+m+'\');" id="'+nmid+'" class="clickit"><span >'+nmb+'</span></div></p>';
  }
  topics.innerHTML = txt;
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

  var nmid = flash.replace(/\//g,'_').replace(/\.tsv/,'');
  console.log(nmid);
  document.getElementById(nmid).style.backgroundColor="Crimson";

  FLASH = shuffle(FLASH);
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

    + '<div class="flashcard flx">'
    + '  <div onclick="flashcard(\''+newd+'\')" class="border"><span>TURN</span></div>'
    + '  <div class="innerflashcard">'
    + '<div class="breakerx flx"><span>'
    + gone + ' of ' + FLASH.length + ' have been tested ('
    + togo + ' items to go)'
    + '</span>'
    + '</div>'
    + '    <div class="horizontal" onclick="storeRight();"><span>RIGHT</span></div>'
    + '    <div class="item"><span>'+contentA+'</span></div>'
    + '    <div class="horizontal" onclick="storeWrong();"><span>WRONG</span></div>'
    + '<div class="breaker flx" onclick="breakFlash();"><span>STOP</span></div>'
    + '  </div>'
    + '  <div onclick="flashcard(\''+newd+'\')" class="border"><span>TURN</span></div>'
    + '</div>'

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
