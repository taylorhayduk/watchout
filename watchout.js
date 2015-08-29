// start slingin' some d3 here.
var gameHeight = 500;
var gameWidth = 500;
var enemyCount = 50;

var svg = d3.select('body')
  .append('svg')
    .attr('width', gameWidth)
    .attr('height', gameHeight);

var createEnemies = function() {
  return _.range(enemyCount).map(function(i){
    return {id: i, x: Math.random() * gameWidth, y: Math.random() * gameHeight};
  });
};

svg.selectAll('circle').data(createEnemies).enter()
  .append('circle')
    .attr('r', 5)
    .attr('cx', function(d){return d.x;})
    .attr('cy', function(d){return d.y;});

var drag = d3.behavior.drag()
    .on('drag', function() {
        player.attr('cx', d3.event.x)
        .attr('cy', d3.event.y);
    });

var player = svg.append('circle')
    .attr('r', 5)
    .attr('cx', gameWidth/2)
    .attr('cy', gameHeight/2)
    .attr("class", "player")
    .call(drag);


var update = function(data) {
  svg.selectAll('circle').data(data)
    .attr('r', 5)
    .attr('cx', function(d){return d.x;})
    .attr('cy', function(d){return d.y;});
};


setInterval(function() {
  update(createEnemies());
}, 500);
