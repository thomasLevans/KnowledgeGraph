import d3 from 'd3';

export default class KnowledgeGraph {
  constructor(svg) {
    this.props = {
      width: 500,
      height: 500,
      buffer: 50,
      radius: 5,
      numCandidates: 20,
      color: d3.scale.category20(),
      nodes: new Map(),
      links: []
    };

    this.svg = svg;

    this.vertices - this.svg.append('g')
      .attr('class', 'vertex');

    this.qt = d3.geom.quadtree()
      .extent([0,0], [this.props.width,this.props.height])
      ([this._genCoor()]);
  }

  /**
  * Takes the root of a data hierarchy and creates the
  * vertices and edges of the graph
  *
  * @method
  * @param data {Array} | {Map} - array of vertices or the root vertex
  */
  updateData(data) {
    if (data.length) {
      data.forEach((datum) => {
        this._normalize(datum);
      });
    } else {
      this._normalize(data);
    }
  }

  /**
  * generates edges
  *
  * @method
  */
  _getLinks() {
    this.props.nodes.values().forEach(function(n) {
      n.get('__data__').children.forEach(function(c) {
        this.props.links.push({
          source: n,
          target: this.props.nodes.get(c.name)
        });
      });
    });
  }

  /**
  * normailizes the vertex to be renderable
  *
  * @method
  * @param v {Map} - has a name and children
  */
  _normalize(v) {
    if (!this.props.nodes.get(v.name)) {
      let n = new Map(this._getBestCandidate());
      n.set('__data__', v);
      this.props.nodes.set(v.name, n);
    }

    if (v.children) {
      v.children.forEach((c) => {
        this._normalize(c);
      });
    }
  }

  /**
  * gets the coordinates using Mitchell's Best
  * Candidate algorithm
  *
  * @method
  */
  _getBestCandidate() {
    let best = undefined;
    let furthest = 0;

    for (let i = 0; i < this.props.numCandidates; i++) {
      let candidate = this._genCoor();
      let closest = this.qt.find(candidate);
      let d0 = this._getDistance(closest, candidate);

      if (d0 > furthest) {
        furthest = d0;
        best = candidate;
      }
    }

    this.qt.add(best);
    return best;
  }

  /**
  * Renders the vertices of the knowledge-graph
  *
  * @method
  */
  render() {
    this.props.nodes.values().forEach(function(n) {
      this._drawVertex(n);
    });
  }

  /**
  * Generates coordinates on the cartesion plane
  * bound by the width and height
  *
  * @method
  */
  _genCoor() {
    return [
      Math.random() * (this.props.width - this.props.buffer),
      Math.random() * (this.props.height - this.props.buffer)
    ];
  }

  /**
  * returns the cartesion distance between two points
  *
  * @method
  * @param a {[Number, Number]} - a point on the cartesion plane
  * @param b {[Number, Number]} - a point on the cartesion plane
  */
  _getDistance(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
  * Draws a vertex on the svg
  *
  * @method
  * @param v {[Number, Number]} - a point on the cartesion plane
  */
  _drawVertex(v) {
    this.vertices.append('circle')
      .transition()
      .duration(400)
      .attr('r', this.props.radius) // TODO - should be dynamic
      .attr('cx', v[0])
      .attr('cy', v[1]);
  }
}
