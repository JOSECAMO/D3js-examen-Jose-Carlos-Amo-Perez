

//data2 contendrá los datos bajados del csv y filtrados por el año elegido
//yearDeCorte contendrá el valor del año elegido en el slide. De momento lo inicializo a 1966.
// Vamos contendrá el conjunto de datos ya preparado para graficar

let data2
// ***************************************************
let yearDeCorte = 2018    // ****** ESTE VALOR DE MOMENTO SE CAMBIA A MANO AQUI
// ***************************************************

let Vamos
let VamosOrdenado      /// el objeto de datos final y ya ordenado
var valueMaximo = 0.5  /// maximo de triunfos acumulados desde 1930 hasta yearDeCorte. Solo para inicilizarlo con valor > 0
const width = 800
const height = 500
const margin = {
    top: 10,
    bottom: 40,
    left: 70,
    right: 10
}
const colors = ["#355f8d", "#22a884"] ///son los colores con los que pinto las barras
//"#482475", "#414487", "#2a788e", "#21908d", , "#482475", "#42be71", "#7ad151", "#bddf26", "#bddf26"

d3.csv("data.csv").then (data => {
  data.map(d => {
  d.year = +d.year
  
  data2 = data.filter ( d => d.year <= yearDeCorte).filter(d => d.winner != '' )

  Vamos = d3.nest()
    .key (d => d.winner )
    .rollup (d => d.length) 
    .entries (data2)
})
    
const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

const elementGroup = svg
    .append("g")
    .attr("id", "elementGropu")
    .attr('transform', `translate(${0}, ${margin.top})`)

////// reordeno Vamos de mayor a menor creando VamosOrdenado
const VamosOrdenado = Vamos.sort ((a, b) => {
    return Number.parseInt(b.value) - Number.parseInt(a.value)
})
////// fin reordeno y calculo el mayor value que será el que está en la posicion 0
valueMaximo = VamosOrdenado[0].value

let x = d3.scaleLinear().range([0, width-margin.left-margin.right])
    .domain([0, d3.max(VamosOrdenado.map(d => d.value))])
let y = d3.scaleBand().range([height-margin.top-margin.bottom,0]).padding(0.3)
    .domain(VamosOrdenado.map(d => d.key))   

elementGroup.selectAll("rect").data(VamosOrdenado)
    .join("rect")
        .attr("class", d => d.key)
        .attr("x", 0)
        .attr("y", d => y(d.key))
        .attr("width", d => x(d.value))
        .attr("height", y.bandwidth())
        .attr('transform', `translate(${margin.left},${0})`)
        .attr("fill", d => colors[Math.floor(d.value / valueMaximo)]);

const axisGroup = svg.append("g").attr("id", "axisGroup")

let xAxis = d3.axisBottom().scale(x).ticks(5).tickSize(-height)
let yAxis = d3.axisLeft().scale(y)

let xAxisGroup = axisGroup
        .append("g")
        .attr("id", "xAxisGroup")
        .attr('transform', `translate(${margin.left},${height-margin.top-margin.bottom})`)

let yAxisGroup = axisGroup
        .append("g")
        .attr("id", "yAxisGroup")
        .attr('transform', `translate(${margin.left},${margin.top})`)

xAxisGroup.call(xAxis)
yAxisGroup.call(yAxis)

x.domain(d3.extent(VamosOrdenado.map(d=>d.value)))
y.domain(VamosOrdenado.map(d=>d.key))

xAxisGroup.select('.domain').remove()

elementGroup.selectAll('.bar').data(VamosOrdenado)

})



