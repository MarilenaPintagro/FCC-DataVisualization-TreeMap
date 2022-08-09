document.addEventListener('DOMContentLoaded', function () {
  req = new XMLHttpRequest();

  req.open("GET", 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json', true);
  req.send();

  req.onload = function () {

    dataset = JSON.parse(req.responseText);

    // console.log(dataset)
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 1024 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    var svg = d3.select("a").
    append("svg").
    attr("width", width + margin.left + margin.right).
    attr("height", height + margin.top + margin.bottom + 400).
    append("g").
    attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

    var treemap = d3.treemap().size([width, height]).paddingInner(1);

    var root = d3.
    hierarchy(dataset).
    eachBefore(function (d) {
      d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name;
    }).
    sum(sumBySize).
    sort(function (a, b) {
      return b.height - a.height || b.value - a.value;
    });

    treemap(root);
    var categorie = [];
    for (var i = 0; i < root.data.children.length; i++) {
      categorie.push(root.data.children[i].name);

    }

    var colore = d3.scaleOrdinal().range(['#0075e2', '#06acf1', '#0ce3ff', '#51f0e8', ' #95fed0', '#bbee9e', '#e0de6d', '#f0c17f', '#ffa391', '#e78166', '#cf5f3b', '#fac8cd', '#d7bcc8', '#98b6b1', '#629677', '#495d63', "#242038", "#725ac1", "#8d86c9", "#cac4ce", "#f7ece1", "#483c46", "#3c6e71", "#70ae6e", "#beee62", "#f4743b"]).domain(categorie);

    var cell = svg.
    selectAll('g').
    data(root.leaves()).
    enter().
    append('g').
    attr('class', 'group').
    attr('transform', function (d) {
      return 'translate(' + d.x0 + ',' + d.y0 + ')';
    });

    cell.
    append('rect').
    attr('id', function (d) {
      return d.data.id;
    }).
    attr('class', 'tile').
    attr('width', function (d) {
      return d.x1 - d.x0;
    }).
    attr('height', function (d) {
      return d.y1 - d.y0;
    }).
    attr('data-name', function (d) {
      return d.data.name;
    }).
    attr('data-category', function (d) {
      return d.data.category;
    }).
    attr('data-value', function (d) {

      return d.data.value;
    }).
    attr('fill', function (d) {

      return colore(d.data.category);
    });

    //text
    cell.
    append('text').
    attr('class', 'tile-text').
    selectAll('tspan').
    data(function (d) {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    }).
    enter().
    append('tspan').
    attr('x', 4).
    attr('y', function (d, i) {
      return 13 + i * 10;
    }).
    attr("font-size", "50%").
    attr("font-family", "arial").
    text(function (d) {
      return d;
    });


    //legend
    const legend = svg.append("g").
    classed('legend', true).
    attr('id', 'legend').
    attr("transform", (d, i) => "translate( 0," + i * 20 + ")");

    var quad = legend.
    append('g').
    selectAll('rect').
    data(categorie).
    enter().
    append("rect").
    attr("class", "legend-item").
    attr("x", (d, i) => 30).
    attr("y", (d, i) => height + 10 + i * 15).
    attr("width", 15).
    attr("height", 15).
    attr("fill", d => colore(d));


    legend.
    append('g').
    selectAll('rect').
    data(categorie).
    enter().
    append("text")
    //    .attr("id", "legend")
    .attr("x", (d, i) => 45).
    attr("y", (d, i) => height + 20 + i * 15).
    attr("font-size", "65%").
    attr("font-family", "arial").
    text(d => {
      return d;
    });

    //tooltip
    var tooltip = d3.select(".graph").
    append("div").
    style("position", "absolute").
    style("visibility", "hidden").
    attr("id", "tooltip");



    d3.selectAll("rect").
    on("mouseover", (d, idx) => {
      // console.log(idx);
      tooltip.style("visibility", "visible");
      tooltip.html("Name: " + idx.data.name + "<br>Category: " + idx.data.category +
      "<br>Value: " + idx.data.value).

      attr('data-value', idx.data.value).
      style("top", event.pageY - 2 + "px").
      style("left", event.pageX + 2 + "px").
      style("opacity", 0.9).

      style("transform", "translateX(60px)");
    }).on('mouseout', (d, idx) => {
      // console.log(idx);
      tooltip.style("visibility", "hidden");});

    //
    function sumBySize(d) {
      return d.value;
    }
  };});