var __MAP__ = 
   ['................................................................................................',
    '................................................................................................',
    '................................................................................................',
    '................................................................................................',
    '..........A.................AAAAA...............................................................',
    '........AAAAAA.....AAAAAAAAAAAAAAAAAAAA.........................................................',
    '.......AAAAAAAAAAAAAAAAAAAAAAA..............................................CCCCC...............',
    '.......AAAAAAAAAAAAAAAAAAA...2................................CCC...CCC...CCCCCCCC..............',
    '......AAAAAAAAAAAAA.AAA..................................CCCCCCCCCCCCCCCCCCCCCCCCC..............',
    '.....AAAAAAAAAAAA............2...............................CCCCCCCCCCCCCC...CCCC..............',
    '.....AAAAAAAAAA..........BBBBBB..................................CCCCCCCCCCCCCCCCCC.............',
    '.......AAAAAAA1........BBBBBBBB...................................3CCCCC..CCCCCCCCC.............',
    '......AAAAAAAA........BBBBB..BBB3..................................CCCC...CCCCCC................',
    '......AAA.AA.A......1BBBBBBBBBB..................................CCCCCCCCCCCCC..................',
    '..........AA.........BBBBBBBB.....................................CCCCCCCCCCCC..................',
    '..........AA.........BBBBBB4.......................................CCCCC.CCCCCC.................',
    '..........7........................................................5.....CC.CCC.................',
    '..........................................................................CCCC..................',
    '................................................................................................',
    '..................................................................5.............................',
    '..............................................................DDDDD.............................',
    '.......7..................................................DDDDDDDDDDDD..........................',
    '.......E................................................DDDDDDDDDDDDDDDD........................',
    '......EEEEE..........................................DDDD.DDD.DDDDDDDDDDD.......................',
    '.....EEEE.............................4........DDDDDDDDDDDDD..DDDDDDDDDDDD......................',
    '.......EEE............................DD....DDDD..DDDDDDDDD....DDDDDDDDDDDD.....................',
    '......EEEE............................DDD...DDDDDDD..DDDDDD...DDDDDDDDDDDDD.....................',
    '........EE............................DDDD.DDDD......DDDDDDDDDD.....DDDDDD......................',
    '........EE............................DDDDDDDD.....DDDDDDD...............6......................',
    '.......EE..............................DDDDDD...DDDDDDDD........................................',
    '.....EEEE.............................DDDDDDDDDDDDDDDD..........................................',
    '.....EEEE.............................DDDDDDDDDDDDDD............................................',
    '.....EEE.............................DDDDDD.DDDD..................................6FFF..........',
    '.....EEE..EE..........................DDDD.......................................FFFFFFF........',
    '.....EEEEEEE..........................DDD....................................FFFFFFFFFFFFF......',
    '.....EEEEEEEE.........................D..............................FFFFFFFFFFFFFFFFFFFFFF.....',
    '....EEEEEEEEEE8......................8D...........................FFFFFFFFFFFFF....FFFFFFFFF....',
    '....EEEEEEEEEE...................................................FFFFFF..FFFF...FFFF..FFFFFF....',
    '......EEE...EEE......................................................FFF.FFFFFFFFFFFFFF..FFF....',
    '.............EEEE....................................................F.FFFFF..FFFFFFFFF..FFF....',
    '..............EEE....................................................FFFFFFFFFFFFFFFFFFFFFF.....',
    '..............EEE...................................................FFFFFFFFFF.....FFFFF........',
    '..............EEE.E...............................................FFFFFFFF..FFF.................',
    '..............EEEEE.E....................................FFFFFFFFFFFFFFF.FFFFFF.................',
    '................EEEEEE.EEE.............................FFF..FFF.FFF.FFFFFFF.....................',
    '................E...EEEE.EEEE.........................FFFFFFFFFFFFFFFFFFFFF.....................',
    '..........................EEE9.......................9FFFFF........FF...........................',
    '................................................................................................',
    '................................................................................................'].join('');

var WIDTH = 96;

var __POPULATION__ = {
  'A': 12,
  'B': 10,
  'C': 10,
  'D': 15,
  'E': 12,
  'F': 15,
};

var __ISLANDS__ = {
  'A': ['Falafel Island', '#754100'],
  'B': ['Macaroni Island', '#d9a8e0'],
  'C': ['Soda Island', '#F1958F'],
  'D': ['Salad Island', '#00C230'],
  'E': ['Water Island', '#0056b3'],
  'F': ['Banana Island', '#fcdf03'],
};

var __INITIAL_WORDS__ = {
  'A': 'falafel',
  'B': 'macaroni',
  'C': 'soda',
  'D': 'salad',
  'E': 'water',
  'F': 'banana',
};

var __AGENT_COLORS__ = {
  'A': ['#472700', '#301b00', '#b07e41'],
  'B': ['#dd42f5', '#c788d1', '#660175'],
  'C': ['#fc1703', '#fc0330', '#fc037f'],
  'D': ['#1b6b00', '#32fa00', '#17ff64'],
  'E': ['#03fcec', '#0394fc', '#031cfc'],
  'F': ['#fca503', '#f0b000', '#f09000'],
};

var __GATES__ = {
   '1': ['A', 'B'],
   '2': ['A', 'B'],
   '3': ['B', 'C'],
   '4': ['B', 'D'],
   '5': ['C', 'D'],
   '6': ['D', 'F'],
   '7': ['A', 'E'],
   '8': ['D', 'E'],
   '9': ['E', 'F'],
};

function mooreNeighborhood(index) {
  var row = Math.floor(index / WIDTH);
  var column = index % WIDTH;
  var map = __MAP__;
  var columnPerRow = WIDTH;
  return [
    map[ (row - 1) * columnPerRow + column - 1 ],  // NW
    map[ (row - 1) * columnPerRow + column ],      // N
    map[ (row - 1) * columnPerRow + column + 1 ],  // NE

    map[ row * columnPerRow + column - 1 ],  // W
    map[ row * columnPerRow + column + 1 ],  // E

    map[ (row + 1) * columnPerRow + column - 1 ],  // SW
    map[ (row + 1) * columnPerRow + column ],      // S
    map[ (row + 1) * columnPerRow + column + 1 ],  // SE
  ];
};

function isGate(x, y) {
  return __GATES__.hasOwnProperty(
    __MAP__[y * WIDTH + x]
  );
};

function cellToPosition(index) {
  return [
    index % WIDTH, 
    Math.floor(index / WIDTH)
  ];
};

function getIslandCells(indicator, excludeGates) {
  var map = Array.prototype.map;
  return map.call(__MAP__, function (node, index) {
    var isGate = (
      __GATES__.hasOwnProperty(node) &&
      mooreNeighborhood(index).filter(
        isEqual(indicator)
      ).length > 0
    );

    if (node === indicator || isGate) {
      return cellToPosition(index);
    }
  }).filter(
    Boolean
  );
};

function getIndicator(x, y) {
  return __MAP__[y * WIDTH + x];
}

function getGates(indicator) {
  var map = Array.prototype.map;
  return map.call(__MAP__, function (node, index) {
    if (node === indicator) {
      return cellToPosition(index);
    }
  }).filter(
    Boolean
  );
}

function findTargetGate(sourceIsland, position) {
  var indicator = getIndicator.apply(null, position);
  var map = Array.prototype.map;
  
  var indexes = map.call(__MAP__, function (node, index) {
    if (node === indicator) {
      return index
    }
  }).filter(
    Boolean
  ).filter(function (index) {
    return (
      mooreNeighborhood(index).indexOf(sourceIsland) === -1
    )
  });

  var targetCell = indexes[0];
  var targetIsland = mooreNeighborhood(
    targetCell
  ).filter(function (key) {
    return __ISLANDS__.hasOwnProperty(key);
  })[0];

  return {
    islandCode: targetIsland,
    position: cellToPosition(targetCell)
  };
}
