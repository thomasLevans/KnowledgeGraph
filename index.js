/* global d3 */
const width = 500;
const height = 500;
const buffer = 50;
const numCandidates = 20;
const numVertices = 40;

const svg = d3.select('body')
  .append('svg')
    .attr('width', width + buffer)
    .attr('height', height + buffer)
  .append('g');
    // .attr('transform',`translate(0,${width})`);

const vertices = svg.append('g')
  .attr('class', 'vertex');

// use the quadtree to partition the svg spatially
// for more performant searching
const qt = d3.geom.quadtree()
  // Setting an extent is required when constructing
  // a quadtree lazily from an initially-empty set of nodes
  .extent([[0, 0],[width, height]])([genCoor()]);

// generate the 40 samples
for (let i = 0; i < numVertices; i++) {
  createVertex();
}

function createVertex() {
  let best = undefined;
  let furthest = 0;

  // generate candidates, keeping the furthest/best
  for (let i = 0; i < numCandidates; i++) {
    let candidate = genCoor();
    let closest = qt.find(candidate);
    let d0 = distance(closest, candidate);

    if (d0 > furthest) {
      furthest = d0;
      best = candidate;
    }
  }

  qt.add(best);
  drawVertex(best);
}

function genCoor() {
  return [Math.random() * width, Math.random() * height];
}

function distance(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function drawVertex(v) {
  vertices.append('circle')
    .attr('r', 5)
    .attr('cx', v[0])
    .attr('cy', v[1]);
}

// d3.json('dat/skills.json', function(err, root) {
//   if (err) {
//     console.error(`Error: ${err.message}`);
//   } else {
//     parse(root);
//
//   }
// });
//
// function parse(vertex) {
//   if (!vertices.get(vertex.name)) {
//     vertices.set(vertex.name, vertex);
//   }
//
//   if (vertex.children) {
//     vertex.children.forEach((d) => {
//       parse(d);
//     });
//   }
//
// }
