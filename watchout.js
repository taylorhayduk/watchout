// start slingin' some d3 here.
var gameHeight = 500;
var gameWidth = 500;
var enemyCount = 25;
var currentScore = 0;
var highScore = 0;
var collisions = 0;
var r = 10;
var enemyBorderWidth = 5;


var svg = d3.select('body')
  .append('svg')
  .attr({
      "width": gameWidth,
      "height": gameHeight,
  })
  .style('border', '5px solid black');

var createEnemies = function() {
  return d3.range(enemyCount).map(function(i){
    return {x: Math.random() * gameWidth, y: Math.random() * gameHeight, collided: false};
  });
};


svg.selectAll('circle').data(createEnemies).enter()
  .append('circle')
    .attr('r', r)
    .attr('cx', function(d){return d.x;})
    .attr('cy', function(d){return d.y;})
    .attr("class", "enemy")
    .style('transform-origin', function(d){return d.x + "px " + d.y + "px";});


var min =  r;
var maxY = gameHeight - r;
var maxX = gameWidth - r;

var drag = d3.behavior.drag()
    .on('drag', function() {
        player.attr('cx', function() {
          var x = parseFloat(player.attr('cx'));
          if (x <= min) {
            return min + 1;
          }
          if (x >= maxX) {
            return maxX - 1;
          }
          return d3.event.x;
        })
        .attr('cy', function() {
          var y = parseFloat(player.attr('cy'));
          if (y <= min) {
            return min + 1;
          }
          if (y >= maxY) {
            return maxY - 1;
          }
          return d3.event.y;
        });
    });

var player = svg.append('circle')
    .attr('r', r)
    .attr('cx', gameWidth/2)
    .attr('cy', gameHeight/2)
    .attr("class", "player")
    .call(drag);


var onCollision = function() {
  if (currentScore > highScore) {
    highScore = currentScore;
    d3.select('.high span')
      .text(highScore);
  }
  currentScore = 0;
    d3.select('.collisions span')
      .text(collisions++);
};

var checkCollision = function(enemy, collisionCallback) {
  var rSum = r + r + enemyBorderWidth;
  var xDiff = parseFloat(enemy.attr('cx')) - parseFloat(player.attr('cx'));
  var yDiff = parseFloat(enemy.attr('cy')) - parseFloat(player.attr('cy'));

  var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  if (separation < rSum) {
    if (!enemy.collided) {
      collisionCallback(enemy);
    }
    enemy.collided = true;
  }
  else {
    enemy.collided = false;
  }
};

var tweenWithCollisionDetection = function(endData) {
  var enemy = d3.select(this);

  var startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };

  var endPos = {
    x: endData.x,
    y: endData.y
  };

  return function(t) {
    checkCollision(enemy, onCollision);

    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };

    var origin = enemyNextPos.x + "px " + enemyNextPos.y + "px";

    enemy.attr('cx', enemyNextPos.x)
        .attr('cy', enemyNextPos.y)
        .style('transform-origin', origin);
  };
};

var update = function(data) {
  svg.selectAll('circle').data(data)
    .transition().duration(1000)
    .tween('custom', tweenWithCollisionDetection);
};


setInterval(function() {
  update(createEnemies());
}, 1000);

setInterval(function(){
  d3.select('.current span')
    .text(currentScore++);
}, 50);
