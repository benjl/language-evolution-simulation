function choiceRandom(items) {
  return items[Math.floor(Math.random()*items.length)]
}

function createSvgElement(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name)
}

function attributeGetter(attr) {
  return function (item) {
    return item[attr];
  };
}

function isEqual(value) {
  return function (item) {
    return item == value;
  };
}

function similarity(vocab, otherVocab) {
  var words = vocab.map(attributeGetter('word'));
  var otherWords = otherVocab.map(attributeGetter('word'));
  var sharedWordList = words.filter(function (word) {
	return otherWords.indexOf(word) > -1;
  });
  // console.log(sharedWordList.length / words.length);
  return sharedWordList.length / words.length;
}

function togglePause(sim) {
    sim.paused = !sim.paused;
    return 1;
}

function toggleFFW(sim) {
	sim.fast = !sim.fast
	return 1;
}

function toggleTurbo(sim) {
  if (sim.turboMult > 0.001)
    sim.turboMult = 0.001
  else if (sim.turboMult < 1)
    sim.turboMult = 1
}

var weightedRandom = function (spec) {
  var sum = 0, 
      random = Math.random();

  for (var i in spec) {
    var state = spec[i];
    sum += state[0];
    if (random <= sum) {
      return state[1]
    };
  }
};

function htmlToElement(html) {
  var template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};
  this.template = function template(str, data){
  var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
    template(document.getElementById(str).innerHTML) :
  new Function("obj",
  "var p=[],print=function(){p.push.apply(p,arguments);};" +
  "with(obj){p.push('" +
  str
    .replace(/[\r\t\n]/g, " ")
    .split("{{").join("\t")
    .replace(/((^|\}\})[^\t]*)'/g, "$1\r")
    .replace(/\t=(.*?)\}\}/g, "',$1,'")
    .split("\t").join("');")
    .split("}}").join("p.push('")
    .split("\r").join("\\'")
  + "');}return p.join('');");
  return data ? fn( data ) : fn;
  };
})();
