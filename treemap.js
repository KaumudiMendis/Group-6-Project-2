const api_key='1q9pUx5oxhzqhW2X3oNr';

var ticker = ['ATVI','ADBE','ADP','ABND','ALGN','GOOGL','GOOG','AMZN','AMD','AEP','AMGN','ADI','ANSS','AAPL','AMAT','ASML','AZN','TEAM','ADSK',
'BIDU','BIIB','BKNG','AVGO','CDNS','CHTR','CTAS','CSCO','CTSH','CMCSA','CEG'];

//Create an empty array to hold the corresponding url to ticker
var tickUrls = [];

//Store the url for each ticker that is scraped
ticker.forEach(data => {
    tickUrls.push(`https://data.nasdaq.com/api/v3/datasets/WIKI/${data}.json?start_date=2016-03-27&api_key=${api_key}`)
});

function makeResponsive(){

    var svgArea = d3.select("body").select("svg")

    if(!svgArea.empty()){
        svgArea.remove();
    }

    var svgWidth = window.innerWidth/1.4;
    var svgHeight = window.innerHeight/1.3;

    var margin = {
        top: 120,
        bottom: 50,
        left: 50,
        right: 50
    }

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3
        .select("#treemap")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var tmChartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    

    function UrlExists(url)  {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status != 404){
            d3.json(url).then((tickData,err)=>{

                if (err) throw err;
            
                else{


                var currentYear = tickData.dataset.data[0][0].split("-")[0]
                var currentMonth = tickData.dataset.data[0][0].split("-")[1]
                var currentDay = tickData.dataset.data[0][0].split("-")[2]

                var treemapDay = [];
                var treemapMonth = [{name:currentMonth,children:treemapDay}];
                var treemapYear = [{name:currentYear,children:treemapMonth}];

                j=0;
                k=0;

                for(i=0;i<tickData.dataset.data.length;i++){

                  currentDay = tickData.dataset.data[i][0].split("-")[2]
                  treemapDay.push({name: currentDay, value:tickData.dataset.data[i][4]});

                  if(currentMonth==tickData.dataset.data[i][0].split("-")[1]){
                    treemapMonth[j] = {name:currentMonth,children:treemapDay}
                  }
                  else{
                    currentMonth = tickData.dataset.data[i][0].split("-")[1]
                    j++
                    treemapDay=[]
                  }

                  if(currentYear==tickData.dataset.data[i][0].split("-")[0]){
                    treemapYear[k]={name:currentYear,children:treemapMonth}
                  }
                  else{
                    currentYear = tickData.dataset.data[i][0].split("-")[0]
                    k++;
                    treemapMonth=[];
                    j=0;
                  }
                };
                
                var treemapData = {name:"All Time",children: treemapYear};

                var hierarchy = d3.hierarchy(treemapData)
                              .sum(d=> d.value)
                              .sort((a,b)=> b.value-a.value)

                treemap = data => d3.treemap()
                  .tile(tile)
                (d3.hierarchy(data)
                  .sum(d => d.value)
                  .sort((a, b) => b.value - a.value))
                
                console.log(treemap);

                
                // tmChartGroup.selectAll('rect')
                //   .data(hierarchy.leaves())
                //   .enter()
                //   .append('rect')
                //   .attr('x', d =>  d['x0'])
                //   .attr('y', d => d['y0'])
                //   .attr('width', d => d['x1'] - d['x0'])
                //   .attr('height', d => d['y1'] - d['y0'])

                // tmChartGroup.selectAll('text')
                //   .data(hierarchy.leaves())
                //   .enter()
                //   .append('text')
                //   .attr('x', d =>  d['x0'])
                //   .attr('y', d => d['y0'])
                //   .attr('width', d => d['x1'] - d['x0'])
                //   .attr('height', d => d['y1'] - d['y0'])
                //   .text(d => d.data.name)
                //   .style('fill','white')
                

                  treemap = dt => d3.treemap()
                  .tile(tile)
                  (d3.hierarchy(dt)
                  .sum(d => d.value)
                  .sort((a, b) => b.value - a.value))
                  
                  const name = d => d.ancestors().reverse().map(d => d.data.name).join("/")
                  const format = d3.format("$,")
                
                  const x = d3.scaleLinear().rangeRound([0, width]);
                  const y = d3.scaleLinear().rangeRound([0, height]);
                

                
                  let group = tmChartGroup.append("g")
                  .call(render, treemap(treemapData));
                
                 function render(group, root) {
                   const node = group
                   .selectAll("g")
                   .data(root.children.concat(root))
                   .join("g");
                
                   node.filter(d => d === root ? d.parent : d.children)
                    .attr("cursor", "pointer")
                    .on("click", d => d === root ? zoomout(root) : zoomin(d));
                
                  node.append("title")
                    .text(d => `${name(d)}\n${format(d.value)}`);
                
                  node.append("rect")
                    .attr("id", d => (d.leafUid = d3.select("leaf")).id)
                    .attr("fill", d => d === root ? "rgb(225,160,66)" : d.children ? "rgb(163,141,194)" : "rgb(206,196,223)")
                    .attr("stroke", "#fff");
                
                  node.append("clipPath")
                    .attr("id", d => (d.clipUid = d3.select("clip")).id)
                    .append("use")
                    .attr("xlink:href", d => d.leafUid.href);
                
                  node.append("text")
                    .attr("clip-path", d => d.clipUid)
                    .attr("font-weight", d => d === root ? "bold" : null)
                    .selectAll("tspan")
                    .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
                  .join("tspan")
                    .attr("x", 3)
                    .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
                    .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
                    .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
                    .text(d => d);
                
                 group.call(position, root);
                }
                
                function position(group, root) {
                    group.selectAll("g")
                    .attr("transform", d => d === root ? `translate(0,-70)` :    `translate(${x(d.x0)},${y(d.y0)})`)
                    .select("rect")
                    .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
                    .attr("height", d => d === root ? 70 : y(d.y1) - y(d.y0));
                 }
                
                
                function zoomin(d) {
                  const group0 = group.attr("pointer-events", "none");
                  const group1 = group = tmChartGroup.append("g").call(render, d);
                
                  x.domain([d.x0, d.x1]);
                  y.domain([d.y0, d.y1]);
                
                  svg.transition()
                    .duration(750)
                    .call(t => group0.transition(t).remove()
                      .call(position, d.parent))
                    .call(t => group1.transition(t)
                      .attrTween("opacity", () => d3.interpolate(0, 1))
                      .call(position, d));
                 }
                
                function zoomout(d) {
                  const group0 = group.attr("pointer-events", "none");
                  const group1 = group = tmChartGroup.insert("g", "*").call(render, d.parent);
                
                  x.domain([d.parent.x0, d.parent.x1]);
                  y.domain([d.parent.y0, d.parent.y1]);
                
                  svg.transition()
                      .duration(750)
                      .call(t => group0.transition(t).remove()
                      .attrTween("opacity", () => d3.interpolate(1, 0))
                      .call(position, d))
                      .call(t => group1.transition(t)
                      .call(position, d.parent));
                 }
                
                  return svg.node();
                }  
                
                
                
                function tile(node, x0, y0, x1, y1) {
                   d3.treemapBinary(node, 0, 0, width, height);
                    for (const child of node.children) {
                    child.x0 = x0 + child.x0 / width * (x1 - x0);
                    child.x1 = x0 + child.x1 / width * (x1 - x0);
                    child.y0 = y0 + child.y0 / height * (y1 - y0);
                    child.y1 = y0 + child.y1 / height * (y1 - y0);
                  }
                 }
            });
        }
            
        else{
            d3.select("svg").remove()
            
            d3.select("#treemap").append("p")
            .text("Looks like we don't have the data on that one, check back later!");
        }
    }

  UrlExists(tickUrls[2])

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);