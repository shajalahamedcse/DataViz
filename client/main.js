import { Template } from 'meteor/templating';
import { HTTP } from 'meteor/http';

url = 'http://192.168.0.1/awp/SFF%20PW%20Treatment%20Plant/io.html';


Router.route('/', function() {
    this.render('Real');
});


import './main.html';
var tv = 2000;

var ph_value = 0;
var line_pressure = 0;
var ro_conductivity = 0;
var ro_pressure = 0;
var edi_conductivity = 0;
var edi_pressure = 0;
var ro_temperature = 0;
var edi_temperature = 0;
var ro_flow = 0;
var distribution_pressure = 0;
var distribution_conductivity = 0;
Template.Real.onRendered(function() {
    var graph = new Rickshaw.Graph({
        element: document.getElementById("chart"),
        width: 960,
        height: 500,
        renderer: 'line',
        series: new Rickshaw.Series.FixedDuration([
            { name: 'PH_value' },
            { name: 'Line_Pressure' },
            { name: 'RO_Conductivity' },
            { name: 'RO_Pressure' },
            { name: 'EDI_Conductivity' },
            { name: 'EDI_Pressure' },
            { name: 'RO_Temperature' },
            { name: 'EDI_Temperature' },
            { name: 'RO_Flow' },
            { name: 'Distribution_Pressure' },
            { name: 'Distribution_Conductivity' }

        ], undefined, {
            timeInterval: tv,
            maxDataPoints: 100,
            timeBase: new Date().getTime() / 1000
        })
    });

    graph.render();

    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph: graph
    });

    var legend = new Rickshaw.Graph.Legend({
        graph: graph,
        element: document.getElementById('legend')

    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: graph,
        legend: legend
    });

    var axes = new Rickshaw.Graph.Axis.Time({
        graph: graph
    });

    var ticksTreatment = 'glow';

    var xAxis = new Rickshaw.Graph.Axis.Time({
        graph: graph,
        ticksTreatment: ticksTreatment,
        timeFixture: new Rickshaw.Fixtures.Time.Local()
    });

    xAxis.render();

    var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: ticksTreatment
    });

    yAxis.render();
    var i = 0;
    var iv = setInterval(function() {

        HTTP.call('GET', url, {}, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                JSONdata = JSON.parse(response.content);
                console.log(JSONdata);
                ph_value = parseFloat(JSONdata.PH_value);
                line_pressure = parseFloat(JSONdata.Line_Pressure);
                ro_conductivity = parseFloat(JSONdata.RO_Conductivity);
                ro_pressure = parseFloat(JSONdata.RO_Pressure);
                edi_conductivity = parseFloat(JSONdata.EDI_Conductivity);
                edi_pressure = parseFloat(JSONdata.EDI_Pressure);
                ro_temperature = parseFloat(JSONdata.RO_Temperature);
                edi_temperature = parseFloat(JSONdata.EDI_Temperature);
                ro_flow = parseFloat(JSONdata.RO_Flow);
                distribution_pressure = parseFloat(JSONdata.Distribution_Pressure);
                distribution_conductivity = parseFloat(JSONdata.Distribution_Conductivity);

                //dep = Math.floor(Math.random() * 40) + 120;
                //console.log(data);
                //console.log(dep);

            }
        });
        //last = dep;
        //console.log(ph_value);
        var data = {
            PH_value: ph_value,
            Line_Pressure: line_pressure,
            RO_Conductivity: ro_conductivity,
            RO_Pressure: ro_conductivity,
            EDI_Conductivity: edi_conductivity,
            EDI_Pressure: edi_pressure,
            RO_Temperature: ro_temperature,
            EDI_Temperature: edi_temperature,
            RO_Flow: ro_flow,
            Distribution_Pressure: distribution_pressure,
            Distribution_Conductivity: distribution_conductivity
        };
        // console.log(data)

        //var data = { one: Math.floor(Math.random() * 40) + 120 };

        //var randInt = Math.floor(Math.random() * 100);
        // data.two = (Math.sin(i++/ 40) + 4) * (randInt + 400);
        //data.three = randInt + 300;
        console.log(data);

        graph.series.addData(data);
        graph.render();

    }, tv);
    axes.render();
});