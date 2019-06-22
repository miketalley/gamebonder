import d3 from 'd3';

export default class D3 {
  nodes: any;
  links: any;
  simulation: any;

  constructor(settings) {
    const { nodes, links } = settings;

    this.nodes = nodes;
    this.links = links;
  }
  
  private onTick() {
    const u = d3.select('svg')
      .selectAll('circle')
      .data(this.nodes);

    u.enter()
      .append('circle')
      .attr('r', 5)
      .merge(u)
      .attr('cx', function(d) {
        return d.x
      })
      .attr('cy', function(d) {
        return d.y
      });

    u.exit().remove()
  }

  createForce() {
    this.simulation = d3.forceSimulation(this.nodes)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
      .on('tick', this.onTick);
  }

  createLink() {
    this.simulation.force('link', d3.forceLink().links(this.links));
  }
}
