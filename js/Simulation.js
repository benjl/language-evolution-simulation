function Simulation(canvas, model) {
  this.canvas = canvas;
  this.model = model;
  this.gridPixelSize = 6;
  this.paused = false;
  this.fast = false;
  this.turboMult = 1;
  this.drawnBridges = [];

  model.eventLog.onUpdate(
    this.onEventLogUpdate.bind(this)
  );

  window.__MODEL__ = model;
}

Simulation.prototype.tick = function () {
  if (!this.paused) {
    this.model.step();
    if (this.turboMult > 0.001) {
      this.drawBridges();
      this.drawAgents();
      this.renderRoster();
      this.renderStats();
    }
  }
};

Simulation.prototype.run = function () {
  // this.drawGrid();
  this.drawIslands();
  this.drawBridges();
  this.renderStats();

  var request = function () {
    requestAnimationFrame(function () {
      this.tick();
      setTimeout(request, this.fast ? 30*this.turboMult : 300*this.turboMult);
    }.bind(this));
  }.bind(this);

  request();
};

Simulation.prototype.renderRoster = function () {
  var roster = document.getElementById('roster');
  var fragment = document.createDocumentFragment();
  var islands = this.model.islands;
  this.model.agents.forEach(function (key, idx) {
    fragment.appendChild(
      htmlToElement(
        template('roster_template', {
          anum: key.name,
          acolor: key.color,
          vocab: buildVocabString(key.vocabulary),
        })
      )
    );
  });
  
  while (roster.firstChild) {
    roster.removeChild(roster.firstChild);
  }
  
  roster.appendChild(fragment);
};

function buildVocabString(vocab) {
  vocabstr = '';
  vocab.forEach(function (key) {
    vocabstr += key.word;
    vocabstr += ' ';
  });
  return vocabstr;
};

Simulation.prototype.drawAgents = function () {
  var model = this.model,
      canvas = this.canvas,
      gridPixelSize = this.gridPixelSize,
      fragment = document.createDocumentFragment();

  model.agents.forEach(function (agent) {
    var x = agent.position[0];
    var y = agent.position[1];
    var circle = document.getElementById(agent.id);

    if (!circle) {
      circle = createSvgElement('circle');
      fragment.appendChild(circle);
    }

    circle.setAttribute('id', agent.id);
    
    circle.style.transform = [
      'translate(',
        x * gridPixelSize + gridPixelSize / 2,
      'px, ',
        y * gridPixelSize + gridPixelSize / 2,
      'px)',
    ].join('');

    circle.setAttribute('r', gridPixelSize / 2 - 1);
    circle.setAttribute('fill', agent.color);
    
  });

  if (fragment.childElementCount) {
    canvas.appendChild(fragment);
  }
};


Simulation.prototype.drawIslands = function () {
  var model = this.model,
      canvas = this.canvas,
      gridPixelSize = this.gridPixelSize,
      fragment = document.createDocumentFragment();

  Object.keys(model.islands).forEach(function (islandKey) {
    var island = model.islands[islandKey];
    
    island.cells.forEach(function (cell) {
      var x = cell[0];
      var y = cell[1];
      var rect = createSvgElement('rect');
      rect.setAttribute('x', x * gridPixelSize);
      rect.setAttribute('y', y * gridPixelSize);
      rect.setAttribute('width', gridPixelSize);
      rect.setAttribute('height', gridPixelSize);
      rect.setAttribute('fill', __ISLANDS__[islandKey][1]);

      if (isGate(x, y)) {
        rect.setAttribute('fill', 'gray');        
      };

      fragment.appendChild(rect);
    });
  });

  canvas.appendChild(fragment);
};

Simulation.prototype.drawBridges = function () {
  var model = this.model,
      canvas = this.canvas,
      gridPixelSize = this.gridPixelSize,
      center = gridPixelSize / 2,
      drawnBridges = this.drawnBridges;

  Object.keys(__GATES__).forEach(function (indicator) {
    // console.log(model.iteration, __GATE_OPENING__[indicator]);
    if (model.iteration >= __GATE_OPENING__[indicator] && drawnBridges.indexOf(indicator) <= -1) {
      drawnBridges.push(indicator);
      var gates = getGates(indicator);
      var source = gates[0];
      var target = gates[1];

      var line = createSvgElement('line');
      line.setAttribute('x1', source[0] * gridPixelSize + center);
      line.setAttribute('y1', source[1] * gridPixelSize + center);
      line.setAttribute('x2', target[0] * gridPixelSize + center);
      line.setAttribute('y2', target[1] * gridPixelSize + center);
      line.setAttribute('stroke-width', 1);
      line.setAttribute('stroke', 'gray');
      canvas.appendChild(line);
    }
  });
};

Simulation.prototype.drawGrid = function () {
  var model = this.model,
      canvas = this.canvas,
      gridPixelSize = this.gridPixelSize;

  for(var i = 0; i <= model.width * gridPixelSize; i = i + gridPixelSize) {
    var line = createSvgElement('line');
    line.setAttribute('x1', 0);
    line.setAttribute('y1', i);
    line.setAttribute('x2', model.width * gridPixelSize);
    line.setAttribute('y2', i);
    line.setAttribute('stroke-width', 0.2);
    line.setAttribute('stroke', 'black');
    canvas.appendChild(line);
  }

  for(var j = 0; j <= model.width * gridPixelSize; j = j + gridPixelSize) {
    var line = createSvgElement('line');
    line.setAttribute('x1', j);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', j);
    line.setAttribute('y2', model.height * gridPixelSize);
    line.setAttribute('stroke-width', 0.2);
    line.setAttribute('stroke', 'black');
    canvas.appendChild(line);
  }
};

Simulation.prototype.colorizeWord = function (instance) {
  var span = document.createElement('span');
  if (instance.island) {
    span.style.color = __ISLANDS__[instance.island.code][1];
  }
  span.innerHTML = instance.word || instance;
  return span;
};

Simulation.prototype.onEventLogUpdate = function (event, instance) {
  if (this.turboMult < 1)
    return;
  var eventLogElement = document.getElementById('event-log');
  var logEntry = document.createElement('li');
  if (instance.compoundOf) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(this.colorizeWord(instance));
    fragment.appendChild(this.colorizeWord(' compound with '));
    fragment.appendChild(this.colorizeWord(instance.parent));
    fragment.appendChild(this.colorizeWord(' and '));
    fragment.appendChild(this.colorizeWord(instance.compoundOf));
    logEntry.appendChild(fragment);
  } else {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(this.colorizeWord(instance));
    fragment.appendChild(this.colorizeWord(' derived from '));
    fragment.appendChild(this.colorizeWord(instance.parent));
    logEntry.appendChild(fragment);
  }
  eventLogElement.insertBefore(logEntry, eventLogElement.firstChild);
  if (eventLogElement.children.length > 100) {
    eventLogElement.children[eventLogElement.children.length-1].remove();
  }
};

Simulation.prototype.renderStats = function () {
  var stats = document.getElementById('stats');
  var fragment = document.createDocumentFragment();
  var islands = this.model.islands;
  Object.keys(__ISLANDS__).forEach(function (key) {
    var topWords = this.model.counter.mostOccurrence(key);
    var nativeCount = this.model.counter.nativePop(this.model.agents, key);
    var localCount = this.model.counter.localPop(this.model.agents, key);
    var islandMeta = __ISLANDS__[key];
    fragment.appendChild(
      htmlToElement(
        template('island_stats_template', {
          name: islandMeta[0],
          color: islandMeta[1],
          top: topWords ? topWords : null,
          pop: nativeCount,
          lpop: localCount,
        })
      )
    );
  });

  while (stats.firstChild) {
    stats.removeChild(stats.firstChild);
  }

  stats.appendChild(fragment);
};
