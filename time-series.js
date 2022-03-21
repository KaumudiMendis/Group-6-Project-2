const api_key='1q9pUx5oxhzqhW2X3oNr';

var ticker = ['ATVI','ADBE','ADP','ABNB','ALGN','GOOGL','GOOG','AMZN','AMD','AEP','AMGN','ADI','ANSS','AAPL','AMAT','ASML','AZN','TEAM','ADSK',
'BIDU','BIIB','BKNG','AVGO','CDNS','CHTR','CTAS','CSCO','CTSH','CMCSA','CEG'];

//Create an empty array to hold the corresponding url to ticker
var tickUrls = [];

//Store the url for each ticker that is scraped
ticker.forEach(data => {
    tickUrls.push(`https://data.nasdaq.com/api/v3/datasets/WIKI/${data}.json?start_date=2008-03-27&api_key=${api_key}`)
});

function makeResponsive(){

    var svgArea = d3.select("body").select("svg")

    if(!svgArea.empty()){
        svgArea.remove();
    }

    var svgWidth = window.innerWidth/1.4;
    var svgHeight = window.innerHeight/1.3;

    var margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    }

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3
        .select("#time-series")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var tsChartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    var parseDate = d3.timeParse("%Y-%m-%d");


    function xScale(data) {
        var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data,d => d.date))
        .range([0, width]);

        return xTimeScale;
      
    }

    function yScale(data) {
        var yLinearScale = d3.scaleLinear()
          .domain(d3.extent(data,d => d.closePrice))
          .range([height,0]);

        return yLinearScale;

    }

    // function renderXAxes(newXScale, xAxis) {
    //     var bottomAxis = d3.axisBottom(newXScale);
      
    //     xAxis.transition()
    //       .duration(1000)
    //       .call(bottomAxis);
    
    //     return xAxis;
    // }

    function UrlExists(url)  {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status != 404){
            d3.json(url).then((tickData,err)=>{

                if (err) throw err;
            
                else{
                var data = [];
                var treemapData = [];

                for(i=0;i<tickData.dataset.data.length;i++){
                    data[i] = {
                        date: parseDate(tickData.dataset.data[i][0]),
                        closePrice : tickData.dataset.data[i][4]
                    };

                    treemapData[i] ={
                        name: tickData.dataset.data[i][0].split("-")[0],//for year
                        children: [
                            {
                            name:tickData.dataset.data[i][0].split("-")[1],//for month
                            size: null,
                            children:[
                                {
                                name: tickData.dataset.data[i][0].split("-")[2],//for day
                                size: tickData.dataset.data[i][4],
                                children: []
                                }
                            ]
                            }
                        ]
                    }
                };
            
                console.log(data)
                console.log(treemapData)
        
                xTimeScale = xScale(data);
                yLinearScale = yScale(data);
        
        
                var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b-%Y"));
                var leftAxis = d3.axisLeft(yLinearScale);
        
                var drawLine = d3.line()
                    .x(d => xTimeScale(d.date))
                    .y(d => yLinearScale(d.closePrice));;
        
                tsChartGroup.append("path")
                    .attr("d", drawLine(data))
                    .classed("line", true);
            
                tsChartGroup.append("g")
                    .classed("axis", true)
                    .call(leftAxis);
            
                tsChartGroup.append("g")
                    .classed("axis", true)
                    .attr("transform", `translate(0, ${height})`)
                    .call(bottomAxis);
        
                }
            });
        }
            
        else{
            d3.select("svg").remove()
            
            d3.select("#time-series").append("p")
            .text("Looks like we don't have the data on that one, check back later!");
        }
    }

    UrlExists(tickUrls[2])

}

// When the browser loads, makeResponsive() is called.
makeResponsive();
  
//When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);