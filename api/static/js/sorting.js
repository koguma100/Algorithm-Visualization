
let data = Array.from({ length: 50 }, () => Math.floor(Math.random() * 1001));

let speed = 100;

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

let x = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([0, width])
            .padding(0.1);

let y = d3.scaleLinear()
            .domain([0, d3.max(data)])
            .range([height, 0]);

svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => x(i))
    .attr("y", d => y(d))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d));


// ------------------------- HELPER FUNCTIONS -------------------------

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

function setSpeed(value) {
  speed = parseInt(value, 10);
}

async function updateCount(value) {
  data = Array.from({ length: value }, () => Math.floor(Math.random() * 1001));

  // Update scales
  x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([0, width])
    .padding(0.1);

  y= d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([height, 0]);

  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => x(i))
    .attr("y", d => y(d))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d))
    .attr("fill", "steelblue");

  await svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(speed / 2)
        .style("fill", "steelblue")
        .end();

  document.getElementById("countValue").innerText = value;
}

// ---------------------------------------------------------------------
// ------------------------- SORTING FUNCTIONS -------------------------
// ---------------------------------------------------------------------


// ------------------------- BUBBLE SORT ------------------------- 
async function bubbleSort() {
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = 0; j < data.length - i - 1; j++) {
      // Highlight current
      await svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(speed)
        .style("fill", (d, idx) => (idx === j || idx === j + 1) ? "#ff0000" : "steelblue")
        .attr("y", d => y(d))
        .attr("height", d => height - y(d))
        .end();

      if (data[j] > data[j + 1]) {
        [data[j], data[j + 1]] = [data[j + 1], data[j]];

        // Animate swap 
        await svg.selectAll("rect")
          .data(data)
          .transition()
          .duration(speed)
          .attr("y", d => y(d))
          .attr("height", d => height - y(d))
          .end();
      }

      // Reset color 
      await svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(speed / 2)
        .style("fill", "steelblue")
        .end();
    }
  }

  await svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(speed / 2)
        .style("fill", "green")
        .end();
}

// ------------------------- BOGO SORT ------------------------- 

async function bogoSort() {

    while (!isSorted(data)) {
        for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [data[i], data[j]] = [data[j], data[i]];
        }

        // Update visuals
        await svg.selectAll("rect")
            .data(data)
            .transition()
            .duration(speed)
            .attr("y", d => y(d))
            .attr("height", d => height - y(d))
            .end();
        
        await delay(speed);
    }

    await svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(speed / 2)
        .style("fill", "green")
        .end();
}

// ------------------------- QUICK SORT ------------------------- 

async function quickSort() {
  await quickSortHelper(data, 0, data.length - 1);

  // Mark sorted
  await svg.selectAll("rect")
    .data(data)
    .transition()
    .duration(speed)
    .style("fill", "green")
    .end();
}

async function quickSortHelper(arr, left, right) {
  if (left < right) {
    const pivotIndex = await partition(arr, left, right);
    await quickSortHelper(arr, left, pivotIndex - 1);
    await quickSortHelper(arr, pivotIndex + 1, right);
  }
}

async function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {

    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      await svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(speed)
        .attr("y", d => y(d))
        .attr("height", d => height - y(d))
        .attr("x", (d, i) => x(i))
        .style("fill", (d, idx) => (idx === i || idx === j) ? "#ff0000" : "steelblue")
        .end();
    }

    await delay(speed);
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];

  await svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(speed)
        .attr("y", d => y(d))
        .attr("height", d => height - y(d))
        .attr("x", (d, i) => x(i))
        .style("fill", (d, idx) => (idx === right|| idx === i + 1) ? "#ff0000" : "steelblue")
        .end();

  return i + 1;
}

// ------------------------- MERGE SORT ------------------------- 

async function mergeSort() {  
  await mergeSortHelper(data, 0, data.length - 1);

  // Mark sorted
  await svg.selectAll("rect")
    .data(data)
    .transition()
    .duration(speed)
    .style("fill", "green")
    .end();
}

async function mergeSortHelper(arr, left, right) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    await mergeSortHelper(arr, left, mid);
    await mergeSortHelper(arr, mid + 1, right);
    await merge(arr, left, mid, right);
  }
}

async function merge(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);
  
  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k++] = leftArr[i++];
    } else {
      arr[k++] = rightArr[j++];
    }

    await svg.selectAll("rect")
      .data(arr)
      .transition()
      .duration(speed)
      .attr("y", d => y(d))
      .attr("height", d => height - y(d))
      .attr("x", (d, idx) => x(idx))
      .style("fill", (d, idx) => (idx >= left && idx <= right) ? "#ff0000" : "steelblue")
      .end();
  }

  while (i < leftArr.length) {
    arr[k++] = leftArr[i++];
  }

  while (j < rightArr.length) {
    arr[k++] = rightArr[j++];
  }

  await svg.selectAll("rect")
      .data(arr)
      .transition()
      .duration(speed)
      .attr("y", d => y(d))
      .attr("height", d => height - y(d))
      .attr("x", (d, idx) => x(idx))
      .style("fill", (d, idx) => (idx >= left && idx <= right) ? "#ff0000" : "steelblue")
      .end();
}
