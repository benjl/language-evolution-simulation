function Counter(size) {
  this.size = size || 50;
  this.table = {};
  this.payload = {};
}

Counter.prototype.zero = function () {
  this.table = {};
}

Counter.prototype.count = function (key, item) {
  var table = this.table;

  if (!table[key]) {
    table[key] = [];
  };

  table[key].push(item);
};

Counter.prototype.nativePop = function (agentList, isle) {
  return agentList.filter(function (a) {
    return a.nativeIsland.code == isle;
  }).length;
}

Counter.prototype.localPop = function (agentList, isle) {
  return agentList.filter(function (a) {
    return a.island.code === isle;
  }).length;
}

Counter.prototype.mostOccurrence = function (key) {
  var items = this.table[key];

  if (!items) {
    return [[null, null], [null, null], [null, null], [null, null], [null, null]];
  }

  var modeMap = {};

  for (var i = 0; i < items.length; i++) {
    var el = items[i];
    if(modeMap[el] == null) {
      modeMap[el] = 1;
    } else {
      modeMap[el]++;  
    }
  }
  
  var sortThis = [];
  for (var w in modeMap) {
    sortThis.push([w, modeMap[w]]);
  }
  sortThis.sort(function (a, b) {
    return a[1] - b[1];
  });
  sortThis.reverse();
  
  for (sortThis.length; sortThis.length < 5;) {
    sortThis.push([null, null]);
  }
  
  return sortThis;
}