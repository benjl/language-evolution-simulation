function Model(size) {
  this.width = 96;
  this.height = 49;
  this.iteration = -1;
  this.islands = [];
  this.agents = [];
  this.eventLog = new EventLog();
  this.counter = new Counter();

  window.__COUNTER__ = this.counter;
}

Model.prototype.setup = function () {
  Object.keys(__ISLANDS__).forEach(function (islandKey) {
    this.islands[islandKey] = new Island(islandKey, this);
    for (var i = 0; i < __POPULATION__[islandKey]; i++) {
      this.agents.push(
        new Agent(
          this.islands[islandKey],
          this,
          this.eventLog,
          this.counter
        )
      );
    }
  }.bind(this));

  this.agents.forEach(function (agent) {
    agent.setup();
  });
};

Model.prototype.step = function () {
  this.iteration++;
  this.counter.zero();
  this.agents.forEach(function (agent) {
    agent.step();
    agent.vocabulary.forEach(function (wrd) {
      agent.counter.count(agent.island.code, wrd.word);
    });
  });

};
