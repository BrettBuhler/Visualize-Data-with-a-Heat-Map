let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
let tableData = [];
let w = window.innerWidth * 0.8;
let h = window.innerHeight * 0.8;
let padding = 60;
let svg = d3.select('svg');
let yScale;
let xScale;

async function getData(){
    fetch(url)
    .then(response => response.json())
    .then(data => {
        tableData = data.monthlyVariance;
        console.log(tableData);
        setCanvas();
        setScale();
        setXandYAxis();
        setCells();
    })
}

let setCanvas = () => {
    svg.attr('width', w)
        .attr('height', h);
}

let setScale = () => {

        yScale = d3.scaleTime()
        .domain([new Date(0,0,0,0,0,0,0),new Date(0,12,0,0,0,0,0)])
        .range([padding, h-padding]);

    xScale = d3.scaleLinear()
        .domain([d3.min(tableData, x => {
            return x.year;
        }), d3.max(tableData, x => {
            return x.year;
        })])
        .range([padding, w - padding])
}

let setXandYAxis = () => {
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'));
    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%B'));

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', "translate(0, " + (h-padding) + ")");

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

let setCells = () => {

    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('width', 'auto')
        .style('height', 'auto')
        .style('top', '70px');

    svg.selectAll('rect')
        .data(tableData)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('data-month', x => {
            return x.month-1;
        })
        .attr('data-year', x=> {
            return x.year;
        })
        .attr('data-temp', x => {
            return x.variance;
        })
        .attr('width', (w - (2 * padding))/(tableData.length/12))
        .attr('height', (h-(2 * padding))/12)
        .attr('x', x => {
            return xScale(x.year)
        })
        .attr('y', x => {
            return yScale(new Date(0,x.month - 1,0,0,0,0,0))
        })
        .attr('fill', x => {
            if (x.variance >= 3){
                return 'red';
            } else if (x.variance >= 1.5){
                return 'orange';
            } else if (x.variance >= 0){
                return '#Eaea9a';
            } else if (x.variance >= -1.5){
                return '#91dcd3';
            } else if (x.variance >= -3) {
                return '#66a0dc';
            } else {
                return '#2c079e';
            }
        })
        .on('mouseover', x => {
            tooltip.transition()
                .style('visibility', 'visible')
                .attr('data-year', x.year)

            tooltip.text("Year: " + x.year + "\n"+ "Temperature: " + (x.variance + 8.66) + " ℃")
        })
        .on('mouseout', x => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })

}
getData();