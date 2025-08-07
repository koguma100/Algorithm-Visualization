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