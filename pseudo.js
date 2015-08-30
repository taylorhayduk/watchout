/*



*/

var grad = svg.append("defs").append("linearGradient").attr("id", "grad")
              .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
grad.append("stop").attr("offset", "50%").style("stop-color", "black");
grad.append("stop").attr("offset", "50%").style("stop-color", "blue");