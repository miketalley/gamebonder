import { useEffect } from "react";
import bondsMock from '../data/bonds-mock1.json';
import gamesMock from '../data/games-mock1.json';
import * as d3 from 'd3';
import { forceSimulation } from 'd3-force';
  // d3 = require("d3@6")
const width = 500
const height = Math.min(500, width * 0.6)
// import * as d3Scale from 'd3-scale';

export default (props) => {
  useEffect(() => {
    
    // var w = window.innerWidth,
    //     h = window.innerHeight,
    //     root, games, bonds;

    // // console.log('d3.scale: ', d3Scale)

    // // var color = d3.scaleOrdinal(d3.schemeCategory20);

    // // Set Dynamic Force
    // // var force = d3.layout.force()
    // // var force = forceSimulation()
    // //   .size([w,h])
    // //   .linkDistance([50])
    // //   .charge([-2500])
    // //   .gravity(0.3);

    // var svg = d3.select("#games-force-chart-target").append("svg")
    //   .attr("width", w)
    //   .attr("height", h);

    // var link = svg.selectAll(".link"),
    //   node = svg.selectAll(".node");
      
    // // Getting data for nodes and links
    // // queue()
    // //   .defer(d3.json, "../games.json")
    // //   .defer(d3.json, "../bonds.json")
    // //   .await(update);
    // const simulation = update();

    // // Fix position of nodes once moved
    // var drag = simulation.drag().on("dragstart", dragstart);

    // function dragstart(d) {
    //     d3.select(this).classed("fixed", d.fixed = true);
    // }


    // function update(error, games, bonds) {
    //   // TODO - Mock games and bonds here
    //   games = gamesMock;
    //   bonds = bondsMock;
      
    //   console.log('Games: ' + games.length);
    //   console.log('Bonds: ' + bonds.length);
    //   var nodes = games,
    //       links = bonds;
    //   var newLinks = [];

    //   // Replace references of IDs
    //   links.forEach(function(e) {
    //     var sourceNode = nodes.filter(function(n) { return n.id === e.source; })[0],
    //         targetNode = nodes.filter(function(n) { return n.id === e.target; })[0];

    //     newLinks.push({source: sourceNode, target: targetNode});
    //     console.log('Pushing newLinks: ' + sourceNode + ' : ' + targetNode);
    //   });

    //   links = newLinks;

    //   var numberOfNodeLinks = function(game){
    //     return links.filter(function(p){
    //       if (!p.source || !p.target) {
    //         console.log('Missing Data: ', p);
    //         return;
    //       }
    //       return (p.source.id === game.id || p.target.id === game.id);
    //     });
    //   };

    //   for(var i = 0; i < nodes.length; i++){
    //     nodes[i].weight = numberOfNodeLinks(nodes[i]).length;
    //     console.log(nodes[i].name + ': ' + nodes[i].weight);
    //   }

    //   console.log('Nodes: ', nodes, nodes.filter(n => !n || !n.weight));
    //   console.log('Links: ', links);
    //   // force.nodes(nodes).links(links).start();
    //   const sim = forceSimulation(nodes)
    //     .force("charge", d3.forceManyBody())
    //     .force("link", d3.forceLink(links))
    //     .force("center", d3.forceCenter());

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

    //   // Draw Lines for Bonds
    //   var edges = svg.selectAll("line")
    //     .data(links)
    //     .enter()
    //     .append("line")
    //     .style("stroke", "#fff")
    //     .style("stroke-width", 3);

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

    //   // Turn on Force
    //   sim.on("tick", function() {
    //     edges
    //       .attr("x1", function(d) { return d.source.x + 20; })
    //       .attr("y1", function(d) { return d.source.y + 20; })
    //       .attr("x2", function(d) { return d.target.x + 20; })
    //       .attr("y2", function(d) { return d.target.y + 20; });
    //     node
    //       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    //       .attr("weight", function(d) { return d.weight; });
    //     texts.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    //   });
    //   return sim;
    // }

    const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]),
    link = svg
      .selectAll(".link")
      .data(bondsMock)
      .join("line")
      .classed("link", true),
    node = svg
      .selectAll(".node")
      .data(gamesMock)
      .join("circle")
      .attr("r", 12)
      .classed("node", true)
      .classed("fixed", d => d.fx !== undefined);

  const foo = svg.node();
  // console.log('foo: ', foo, svg)
  const ele = d3.select("#games-force-chart-target").node().append(foo);
  // console.log('ele: ', ele);
  // ele.append(foo);

  const simulation = d3
    .forceSimulation()
    .nodes(gamesMock)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(bondsMock).id(d => d.id))
    .on("tick", tick);

  const drag = d3
    .drag()
    .on("start", dragstart)
    .on("drag", dragged);

  node.call(drag).on("click", click);

  function tick() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function click(event, d) {
    delete d.fx;
    delete d.fy;
    d3.select(this).classed("fixed", false);
    simulation.alpha(1).restart();
  }

  function dragstart() {
    d3.select(this).classed("fixed", true);
  }

  function dragged(event, d) {
    d.fx = clamp(event.x, 0, width);
    d.fy = clamp(event.y, 0, height);
    simulation.alpha(1).restart();
  }

  function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
  }
  })

  return <div id="games-force-chart-target"></div>;
};