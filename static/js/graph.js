// ----------------- HELPER FUNCTIONS -----------------

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ----------------- INPUT VALIDATION -----------------
const maxNodeCount = 30;
let maxValue = 4;
const minValue = 2;
let startNode = 0;
let endNode = 1;

function validateNodeInput(value) {
    if (this.value > maxValue - 1) {
        return maxValue - 1;
    }
    if (this.value < minValue - 1) {
        return minValue - 1;
    }
    if (isNaN(this.value) || this.value === '') {
        return minValue - 1;
    }
    else {
        return parseInt(this.value);
    }
}

let startNodeInput = document.getElementById('start-node');

startNodeInput.addEventListener('blur', function() {
    startNode = validateNodeInput(this.value);
    startNodeInput.value = startNode;
});

let endNodeInput = document.getElementById('end-node');

startNodeInput.addEventListener('blur', function() {
    endNode = validateNodeInput(this.value);
    startNodeInput.value = startNode;
});


// ----------------- GRAPH SETUP -----------------

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const arrowDefs = svg.append("defs").append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 18)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "#888");

function generateRandomSCC() {
  const nodes = Array.from({ length: maxValue}, (_, i) => ({ id: i }));
  const links = [];

  const buildAdjList = (edges, reverse = false) => {
    const adj = Array.from({ length: maxValue }, () => []);
    for (const { source, target } of edges) {
      const from = reverse ? target : source;
      const to = reverse ? source : target;
      adj[from].push(to);
    }
    return adj;
  };

  const dfs = (adj, start, visited) => {
    const stack = [start];
    while (stack.length) {
      const node = stack.pop();
      if (!visited[node]) {
        visited[node] = true;
        stack.push(...adj[node]);
      }
    }
  };

  const isStronglyConnected = () => {
    let visited = Array(maxValue).fill(false);
    const adj = buildAdjList(links);
    dfs(adj, 0, visited);
    if (visited.includes(false)) return false;

    visited = Array(maxValue).fill(false);
    const revAdj = buildAdjList(links, true);
    dfs(revAdj, 0, visited);
    return !visited.includes(false);
  };

  while (!isStronglyConnected()) {
    const source = Math.floor(Math.random() * maxValue);
    const target = Math.floor(Math.random() * maxValue);
    if (source !== target && !links.some(l => l.source === source && l.target === target)) {
      links.push({ source, target });
    }
  }

  return { nodes, links };
}


function generateGraph() {
  svg.selectAll("*").filter(":not(defs)").remove();

  const n = parseInt(document.getElementById("nodeCount").value);
  const { nodes, links } = generateRandomSCC(maxValue);

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
    .attr("stroke", "#888")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("marker-end", "url(#arrow)");


  const node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded));

  node.append("circle").attr("r", 10);
  node.append("text")
    .attr("dy", -15)
    .attr("text-anchor", "middle")
    .text(d => d.id);

  simulation.on("tick", () => {
  link
    .attr("x1", d => clamp(d.source.x, 0, width))
    .attr("y1", d => clamp(d.source.y, 0, height))
    .attr("x2", d => clamp(d.target.x, 0, width))
    .attr("y2", d => clamp(d.target.y, 0, height));

  node.attr("transform", d => 
    `translate(${clamp(d.x, 20, width - 20)},${clamp(d.y, 20, height - 20)})`
  );
});

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

function updateNodeCount(value) {
  document.getElementById("nodeCountValue").textContent = value;
  maxValue = parseInt(value);
  startNodeInput.max = maxValue - 1;
  endNodeInput.max = maxValue - 1;
  generateGraph();
}

generateGraph();


// ----------------- DFS VISUALIZATION -----------------
async function dfsVisual(startNode, endNode) {
  const buildAdjList = (edges) => {
    const adj = Array.from({ length: maxValue }, () => []);
    for (const { source, target } of edges) {
      const from =  target;
      const to = source;
      adj[from].push(to);
    }
    return adj;
  };

  const adj = buildAdjList(links);
  const visited = Array(maxValue).fill(false);
  const stack = [startNode];
  const path = [];

}