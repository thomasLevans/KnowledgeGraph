import d3 from 'd3';

import KnowledgeGraph from './knowledge-graph';

const width = 500;
const height = 500;
const buffer = 50;

const svg = d3.select('body')
  .append('svg')
    .attr('width', width + buffer)
    .attr('height', height + buffer)
  .append('g');

d3.json('../dat/skills.json', function(err, root) {
  if (err) {
    console.error(`Error: ${err.message}`);
  } else {
    const kg = new KnowledgeGraph(svg);
    kg.updateData(root);
    kg.render();
  }
});
