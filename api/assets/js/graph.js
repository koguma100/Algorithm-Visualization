// ---------------- VARIABLES ----------------

const maxNodeCount = 30;
let maxValue = 4;
const minValue = 2;
let startNode = 0;
let endNode = 1;

let nodes = []
let links = [];

let speed = 500;

let isSCC = false;

// ----------------- HELPER FUNCTIONS -----------------

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setSpeed(value) {
  speed = parseInt(value, 10);
}


// ----------------- INPUT VALIDATION -----------------


function validateNodeInput(value) {
    const input = parseInt(value, maxValue);

    if (input > maxValue - 1) {
        return maxValue - 1;
    }
    if (input < 0) {
        console.warn("Input is less than 0, resetting to 0");
        return 0;
    }
    if (isNaN(input) || input === '') {
      console.warn("Invalid input, resetting to 0");
        return 0;
    }
    else {
        return input;
    }
}

let startNodeInput = document.getElementById('start-node');

startNodeInput.addEventListener('blur', function() {
    startNode = validateNodeInput(this.value);
    startNodeInput.value = startNode;
});

startNodeInput.addEventListener('input', function() {
    const value = this.value;
    this.value = validateNodeInput(value);
});

let endNodeInput = document.getElementById('end-node');

endNodeInput.addEventListener('blur', function() {
    endNode = validateNodeInput(this.value);
    endNodeInput.value = endNode;
});

endNodeInput.addEventListener('input', function() {
    const value = this.value;
    this.value = validateNodeInput(value);
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

function toggleSCC(checked) {
  isSCC = checked;
  document.getElementById("sccCheckbox").checked = checked;
  generateGraph();
}

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

function generateRandomGraph() {
  const nodes = Array.from({ length: maxValue }, (_, i) => ({ id: i }));
  const links = [];

  const edgeCount = Math.floor(maxValue * 1.5); // tweak density

  while (links.length < edgeCount) {
    const source = Math.floor(Math.random() * maxValue);
    const target = Math.floor(Math.random() * maxValue);

    // Avoid self-loops and duplicates
    if (source !== target && !links.some(l => l.source === source && l.target === target)) {
      links.push({ source, target });
    }
  }

  return { nodes, links };
}


function generateGraph() {
  svg.selectAll("*").filter(":not(defs)").remove();

  const n = parseInt(document.getElementById("nodeCount").value);

  if (isSCC) ({ nodes, links } = generateRandomSCC(maxValue));
  else ({ nodes, links } = generateRandomGraph(maxValue));

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
  generateGraph();
}

generateGraph();

const buildAdjList = (edges) => {
  const adj = Array.from({ length: maxValue }, () => []);

  for (const edge of edges) {
    let { source, target } = edge;

    if (typeof source === 'object') source = source.id;
    if (typeof target === 'object') target = target.id;
    if (
      typeof source !== 'number' ||
      typeof target !== 'number' ||
      source < 0 || source >= maxValue ||
      target < 0 || target >= maxValue
    ) {
      continue;
    }
    adj[source].push(target);
  }
  return adj;
};

// ----------------- DFS VISUALIZATION -----------------

async function dfsVisual() {
  // Reset colors
  svg.selectAll(".node circle")
    .transition()
    .duration(speed)
    .style("fill", "steelblue");

  svg.selectAll(".link")
    .transition()
    .duration(speed)
    .style("stroke", "#888")
    .style("stroke-width", "2px");

  // Choose correct adjacency list
  const adj = isSCC ? buildAdjList(links) : buildAdjListUndirected(links);
  const visited = Array(maxValue).fill(false);
  const parent = Array(maxValue).fill(null);
  const stack = [startNode];

  visited[startNode] = true;

  while (stack.length) {
    const current = stack.pop();

    // Mark current node as visited (red)
    svg.selectAll(".node circle")
      .filter(d => d.id === current)
      .transition()
      .duration(speed)
      .style("fill", "red");
    await delay(speed);

    if (current === endNode) break;

    for (const neighbor of adj[current]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        parent[neighbor] = current;
        stack.push(neighbor);
      }
    }
  }

  // No path found
  if (!visited[endNode]) return;

  // Reset all to base color before showing path
  await delay(speed);
  svg.selectAll(".node circle")
    .transition()
    .duration(speed)
    .style("fill", "steelblue");

  // Trace back path using parent array
  const path = [];
  let curr = endNode;
  while (curr !== null) {
    path.push(curr);
    curr = parent[curr];
  }
  path.reverse();

  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];

    svg.selectAll(".node circle")
      .filter(d => d.id === nodeId)
      .transition()
      .duration(speed)
      .style("fill", "green");

    if (i < path.length - 1) {
      const nextId = path[i + 1];
      svg.selectAll(".link")
        .filter(d =>
          (d.source.id === nodeId && d.target.id === nextId) ||
          (d.source.id === nextId && d.target.id === nodeId)
        )
        .transition()
        .duration(speed)
        .style("stroke", "green")
        .style("stroke-width", "4px");
    }

    await delay(speed);
  }
}


// ----------------- BFS VISUALIZATION -----------------

function buildAdjListUndirected(edges) {
  const adj = Array.from({ length: maxValue }, () => []);
  for (const { source, target } of edges) {
    const from = typeof source === "object" ? source.id : source;
    const to = typeof target === "object" ? target.id : target;
    adj[from].push(to);
    adj[to].push(from);
  }
  return adj;
}

async function bfsVisual() {
  const adj = buildAdjListUndirected(links);
  const visited = Array(maxValue).fill(false);
  const parent = Array(maxValue).fill(null);
  const layers = [];

  const queue = [startNode];
  visited[startNode] = true;

  // Reset node colors
  svg.selectAll(".node circle")
    .transition()
    .duration(speed)
    .style("fill", "steelblue");
  svg.selectAll(".link")
    .transition()
    .duration(speed)
    .style("stroke", "#888"); 

  while (queue.length) {
    const layer = [...queue];
    layers.push(layer);
    
    const nextQueue = [];

    for (const node of queue) {
      for (const neighbor of adj[node]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          parent[neighbor] = node;
          nextQueue.push(neighbor);
        }
      }
    }

    queue.length = 0;
    queue.push(...nextQueue);
  }

  for (const layer of layers) {
    svg.selectAll(".node circle")
      .filter(d => layer.includes(d.id))
      .transition()
      .duration(speed)
      .style("fill", "red");
    await delay(speed);
  }

  await delay(speed);
  svg.selectAll(".node circle")
    .transition()
    .duration(speed)
    .style("fill", "steelblue");

  if (!visited[endNode]) return;

  const path = [];
  let current = endNode;
  while (current !== null) {
    path.push(current);
    current = parent[current];
  }
  path.reverse();

  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    svg.selectAll(".node circle")
      .filter(d => d.id === nodeId)
      .transition()
      .duration(speed)
      .style("fill", "green");

    if (i < path.length - 1) {
      const nextId = path[i + 1];
      svg.selectAll(".link")
        .filter(d => 
          (d.source.id === nodeId && d.target.id === nextId) ||
          (d.source.id === nextId && d.target.id === nodeId)
        )
        .transition()
        .duration(speed)
        .style("stroke", "green")
        .style("stroke-width", 3);
    }

    await delay(speed);
  }
}
