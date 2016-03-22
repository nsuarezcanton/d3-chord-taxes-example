//*******************************************************************
//  DRAW THE CHORD DIAGRAM
//  Adapted from Steve Hall's example (https://github.com/sghall/d3-chord-diagrams)
//*******************************************************************

function drawChords(matrix, mmap) {

    var w = 800,
        h = 800,
        r1 = h / 2,
        r0 = r1 - 100;

    var fill = d3.scale.ordinal()
        .domain(d3.range(54))
        .range(d3.range(54));

    var chord = d3.layout.chord()
        .padding(.03)
        .sortSubgroups(d3.descending)

    var arc = d3.svg.arc()
        .innerRadius(r0)
        .outerRadius(r0 + 7);

    var svg = d3.select("#vis_container").append("svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("id", "circle")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    svg.append("circle")
        .attr("r", r0 + 20);

    var rdr = chordRdr(matrix, mmap);
    chord.matrix(matrix);

    var g = svg.selectAll("g.group")
        .data(chord.groups())
        .enter().append("svg:g")
        .attr("class", "group")
        .on("mouseover", mouseover)
        .on("mouseout", function(d) {
            d3.select("#tooltip").style("visibility", "hidden")
        });

    g.append("svg:path")
        .style("stroke", "rgba(0,0,0,0.1)")
        .style("fill", function(d) {
            if (rdr(d).gdata == "state") {
                return "#E0E0E0";
            }
            return "#757575";
        })
        .attr("d", arc);

    g.append("svg:text")
        .each(function(d) {
            d.angle = (d.startAngle + d.endAngle) / 2;
        })
        .attr("dy", ".35em")
        .style("font-family", "helvetica, arial, sans-serif")
        .style("font-size", "10px")
        .attr("text-anchor", function(d) {
            return d.angle > Math.PI ? "end" : null;
        })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (r0 + 15) + ")" + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) {
            return rdr(d).gname;
        });

    var chordPaths = svg.selectAll("path.chord")
        .data(chord.chords())
        .enter().append("svg:path")
        .attr("class", "chord")
        .style("stroke", "rgba(0,0,0,0.15)")
        .style("fill", function(d) {
            if (rdr(d).tname == "Income") {

                return "#B3C2F2";

            } else if (rdr(d).tname == "Other") {

                return "#3BCEAC";

            } else if (rdr(d).tname == "Sales") {

                return "#E2EB98";

            } else if (rdr(d).tname == "Property") {

                return "#F40076";

            } else {
                return "#57467B";

            }
        })
        .attr("d", d3.svg.chord().radius(r0))
        .on("mouseover", function(d) {
            d3.select("#tooltip")
                .style("visibility", "visible")
                .html(chordTip(rdr(d)))
                .style("top", function() {
                    return (d3.event.pageY - 170) + "px"
                })
                .style("left", function() {
                    return (d3.event.pageX - 100) + "px";
                })
        })
        .on("mouseout", function(d) {
            d3.select("#tooltip").style("visibility", "hidden")
        });

    function chordTip(d) {
        var p = d3.format(".1%"),
            q = d3.format(",f")
        return "Chord Info: (amounts in thousands)<br/>" + d.sname + " → " + d.tname + ": $" + q(d.svalue) + "<br/>" + p(d.svalue / d.stotal) + " of " + d.sname + "'s Total ($" + q(d.stotal) + ")<br/>" + p(d.svalue / (d.mtotal / 2)) + " of US Total Tax Collection ($" + q(d.mtotal / 2) + ")<br/>" + "<br/>" + d.tname + " → " + d.sname + ": $" + q(d.tvalue) + "<br/>" + p(d.tvalue / d.ttotal) + " of " + d.tname + "'s Total ($" + q(d.ttotal) + ")<br/>" + p(d.tvalue / (d.mtotal / 2)) + " of US Total Tax Collection ($" + q(d.mtotal / 2) + ")";
    }

    function groupTip(d) {
        var p = d3.format(".1%"),
            q = d3.format(",f")
        return "Group Info: (amounts in thousands)<br/>" + d.gname + " : $" + q(d.gvalue) + "<br/>" + p(d.gvalue / (d.mtotal / 2)) + " of US Total Tax Collection ($" + q(d.mtotal / 2) + ")"
    }

    function mouseover(d, i) {

        d3.select("#tooltip")
            .style("visibility", "visible")
            .html(groupTip(rdr(d)))
            .style("top", function() {
                return (d3.event.pageY - 80) + "px"
            })
            .style("left", function() {
                return (d3.event.pageX - 130) + "px";
            })

        chordPaths.classed("fade", function(p) {
            return p.source.index != i && p.target.index != i;
        });
    }
}
