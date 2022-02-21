import { useEffect } from 'react';
import bondsMock from '../data/bonds-mock1.json';
import gamesMock from '../data/games-mock1.json';
import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';
const width = 500;
const height = Math.min(500, width * 0.6);

export default (props) => {
  useEffect(() => {
    //   // Draw Game Name
    //   var texts = svg.selectAll("text")
    //     .data(nodes)
    //     .enter()
    //     .append("text")
    //     .attr("fill", "white")
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", "10px")
    //     .attr('class', 'text')
    //     .text(function(d) { return d.name; });

    //   // Draw Nodes
    //   // node = svg.selectAll(".node")
    //   //   .data(nodes)
    //   //   .enter()
    //   //   .append('g')
    //   //   .attr('class', 'node')
    //   //   .call(drag);

    //   // Append Images to Nodes
    //   node.append('image')
    //     .attr("xlink:href", function(d){ return d.thumb_url; })
    //     .attr('ondblclick', function(d){ return "openLink('/games/" + d.id + "')"; })
    //     .attr("x", 0)
    //     .attr("y", 5)
    //     .attr("width", 50)
    //     .attr("height", 50);

    const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]),
      link = svg
        .selectAll('.link')
        .data(bondsMock)
        .join('line')
        .classed('link', true),
      node = svg
        .selectAll('.node')
        .data(gamesMock)
        .join('circle')
        .attr('r', 12)
        .classed('node', true)
        .classed('fixed', (d) => d.fx !== undefined);

    d3.select('#games-force-chart-target').node().append(svg.node());

    const simulation = d3
      .forceSimulation()
      .nodes(gamesMock)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'link',
        d3.forceLink(bondsMock).id((d) => d.id)
      )
      .on('tick', tick);

    const drag = d3.drag().on('start', dragstart).on('drag', dragged);

    node.call(drag).on('click', click);

    function tick() {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
      node
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        // .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr('weight', function (d) {
          return d.weight;
        });
      //     texts.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function click(event, d) {
      delete d.fx;
      delete d.fy;
      d3.select(this).classed('fixed', false);
      simulation.alpha(1).restart();
    }

    function dragstart() {
      d3.select(this).classed('fixed', true);
    }

    function dragged(event, d) {
      d.fx = clamp(event.x, 0, width);
      d.fy = clamp(event.y, 0, height);
      simulation.alpha(0).restart();
    }

    function clamp(x, lo, hi) {
      return x < lo ? lo : x > hi ? hi : x;
    }
  });

  return <div id="games-force-chart-target"></div>;
};
