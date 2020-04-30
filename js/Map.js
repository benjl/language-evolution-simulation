var __MAP__ = [
  '...................................................',
  '...................................................',
  '......A............................................',
  '...AAAAAAAAAAAAAA..................................',
  '.....AAAAAAAAAA....................................',
  '......AAAAAAAA.........................BB..........',
  '........AAAAAA........................BBBBB........',
  '.......AAAAAAA.......................BBBBBB........',
  '.......AAAAAAA.....................BBBBBBBBBBBB.....',
  '...AAAAAAAAAAA.AA.................zBBBBBBBBBBB.....',
  '...AAAAAAAAAAA.AA..................BBBBBBBBBB......',
  '...AAAAAAAAAAA.AAz...............BBBBBBBBBBBB......',
  '...AA....AAAAAAA..................BBBBBBBBB........',
  '...AA.....AAAAAAy...............yBBBBBBBBBB........',
  '...AAAAAAAAAAA.AA..................BBBBBBBBBB......',
  '...AAAAAAAAAAAAAA...................BBBBBBBBB......',
  '...AAAAAAAAAAAAA...................BBBBBBBBBB......',
  '.......AAAAAAAAx.....................BBBBBB........',
  '.......AAAAAAA.....................BBBBBBB.........',
  '........AAAAAA.......................BBBBB.........',
  '.....................................BBBB..........',
  '........................................B..........',
  '...................................................',
  '...................................................',
  '.................CCC....CCC..CCC...................',
  '................xCCCCC.CCCCC.CCC...................',
  '................CCCCCCCCCCCCCCCC...................',
  '.................CCCCCCCCCCCCCCC...................',
  '................CCCCCCCCCCCCCCCCCCCCCCCCCC.........',
  '...............CCCCCCCCCCCCCCCCCCCCCCCCCC..........',
  '................CCCCCCCCCCCCCCC...CCCCCCCCCCCC.....',
  '................CCCCCCCCCCCCCCC....CCCCCCCC........',
  '..................CCCCCCCCCCCC.......CCCCCC........',
  '....................CCCCCCCCCC.....................',
  '...................CCCCCCCCC.......................',
  '...................CCCCCCC.........................',
  '...................................................',
  '...................................................',
  '...................................................',
].join('');

var WIDTH = 51;

var __POPULATION__ = {
  'A': 12,
  'B': 12,
  'C': 12,
};

var __ISLANDS__ = {
  'A': ['Island A', '#4BACFF'],
  'B': ['Island B', '#00C230'],
  'C': ['Island C', '#F1958F'],
};

var __INITIAL_WORDS__ = {
  'A': 'falafel',
  'B': 'macaroni',
  'C': 'soda',
};

var __AGENT_COLORS__ = {
  'A': ['#03fcec', '#0394fc', '#031cfc'],
  'B': ['#1b6b00', '#32fa00', '#17ff64'],
  'C': ['#fc1703', '#fc0330', '#fc037f']
};

var __GATES__ = {
   'x': ['A', 'C'],
   'y': ['A', 'B'],
   'z': ['A', 'B'],
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
