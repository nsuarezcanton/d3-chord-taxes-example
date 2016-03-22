//*******************************************************************
//  CREATE MATRIX AND MAP FROM TAX DATA
//*******************************************************************
d3.csv("data/2014_taxes_by_state.csv", function(taxes) {

    var property_tax = [];
    var sales_tax = [];
    var license_tax = [];
    var income_tax = [];
    var other_tax = [];

    var json = {};
    index = 0;

    data = taxes.map(function(d) {

        row = Array.apply(null, Array(50)).map(Number.prototype.valueOf, 0);

        row.push(parseInt(d.property));
        property_tax.push(parseInt(d.property));

        row.push(parseInt(d.sales));
        sales_tax.push(parseInt(d.sales));

        row.push(parseInt(d.license));
        license_tax.push(parseInt(d.license));

        row.push(parseInt(d.income));
        income_tax.push(parseInt(d.income));

        row.push(parseInt(d.other));
        other_tax.push(parseInt(d.other));


        var state = {};
        state.name = d.state;
        state.id = index;
        state.data = "state"

        json[d.state] = state
        index++;

        return row;
    })

    categories = Array.apply(null, Array(5)).map(Number.prototype.valueOf, 0);

    property_tax = property_tax.concat(categories);
    sales_tax = sales_tax.concat(categories);
    license_tax = license_tax.concat(categories);
    income_tax = income_tax.concat(categories);
    other_tax = other_tax.concat(categories);

    data.push(property_tax);
    data.push(sales_tax);
    data.push(license_tax);
    data.push(income_tax);
    data.push(other_tax);


    var taxTypes = ["Property", "Sales", "License", "Income", "Other"];
    for (var i = 0; i < taxTypes.length; i++) {

        taxType = {}
        taxType.name = taxTypes[i];
        taxType.id = i + 50; // States
        taxType.data = "tax"


        json[taxTypes[i]] = taxType;
    }

    drawChords(data, json)
})


//*******************************************************************
// Author: Steve Hall
// Source: https://github.com/sghall/d3-chord-diagrams/blob/master/js/mapper.js
//*******************************************************************
var chordRdr = function(matrix, mmap) {
    return function(d) {

        var i, j, s, t, g, m = {};
        if (d.source) {
            i = d.source.index;
            j = d.target.index;
            s = _.where(mmap, { id: i });
            t = _.where(mmap, { id: j });
            m.sname = s[0].name;
            m.sdata = d.source.value;
            m.svalue =+ d.source.value;
            m.stotal = _.reduce(matrix[i], function(k, n) {
                return k + n
            }, 0);
            m.tname = t[0].name;
            m.tdata = d.target.value;
            m.tvalue = +d.target.value;
            m.ttotal = _.reduce(matrix[j], function(k, n) {
                return k + n
            }, 0);
        } else {
            g = _.where(mmap, { id: d.index });
            m.gname = g[0].name;
            m.gdata = g[0].data;
            m.gvalue = d.value;
        }
        m.mtotal = _.reduce(matrix, function(m1, n1) {
            return m1 + _.reduce(n1, function(m2, n2) {
                return m2 + n2
            }, 0);
        }, 0);
        return m;
    }
}
