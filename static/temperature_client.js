var breware = breware || {};

(function(ns, $){

    $(function () {
        function log(message) {
            $('#log').append('<li>' + message + '</li>');
        }

        var temps = $('#temps');


        var sec = 0;
        var data = [new Array(1)];

        var showMinutes = function (format, val) {
            return Math.round((val / 60)*10)/10;
        };

        var plot1 = $.jqplot('mashrest', [[0]], {
            title: 'Mash Rest',
            series: [
                {
                    showMarker: false,
                    lineWidth: 2.2,
                    color: '#0571B6',
                    fillAndStroke: false
                }
            ],
            axes: {
                xaxis: {
                    min: 0,
                    max: 6000,
                    numberTicks: 11,
                    tickOptions:{
                        formatter: showMinutes
                    },
                    pad: 0
                },
                yaxis: {
                    min: 50,
                    max: 160,
                    tickOptions: {
                        formatString: '%.1f'
                    },
                    numberTicks: 12,
                    pad: 0
                }
            },
            cursor: {
                zoom: false,
                showTooltip: false,
                show: false
            },
            highlighter: {
                useAxesFormatters: false,
                showMarker: false,
                show: false
            },
            grid: {
                gridLineColor: '#DDDDDD',
                borderWidth: 2,
                shadow: true
            }
        });

        window.onresize = function(event) {
            plot1.replot();
        }

        function addTemp(temp) {
            data.push([sec++, parseFloat(temp)]);
            $("#currentTemperature").text(temp);
            plot1.series[0].data = data
            plot1.replot();
        }

        log('Attempting to connect to socket server');

        var ws = window.WebSocket || window.MozWebSocket;

        ws = new WebSocket('ws://' + location.host + '/temperaturesocket');

        ws.onopen = function (e) {
            log('Connection opened');
        };

        ws.onclose = function (e) {
            log('Connection closed');
        };

        ws.onmessage = function (evt) {
            var temperature = evt.data;
            addTemp(temperature);
        };

        $('#start_temperature_reading').on('click', function () {
            ws.send("GetTemps");
        });

        $('#close_socket').on('click', function () {
            ws.close();
        });
    });


})(breware, jQuery)