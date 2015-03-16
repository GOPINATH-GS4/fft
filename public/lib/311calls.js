function barChartMultipleSeries(element, type, width, height, data) {

    var chart1 = new Highcharts.Chart({
        chart: {
            renderTo: element,
            type: type,
            events: {
                load: function() {
                    console.log('Chart loaded');
                },
                afterPrint: function() {},
                redraw: function() {}
            }

        },
        title: {
            text: data.chart_title
        },
        xAxis: {
            categories: data.categories
        },
        yAxis: {
            title: {
                text: data.yLabel
            },
            plotOptions: {
                series: {
                    animation: {
                        complete: function() {
                            this.hideLoading();
                        }
                    }
                }
            }
        },
        series: data.series
    });

}

$(function() {
    $(document).ready(function() {

      //  311 data SODA API 
        // generate an array of random data
        //
        // Base URL
        var str = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?';
        // APP_KEY 
        str += '$$app_token=tIpcD7hNPN5HyiwzU1no6rHyJ'
            // Select clause 
        str += '&$select=date_trunc_ymd(created_date) as month, count(*) as total&$group=month';
        // Where Clause 
        str += '&$where=created_date >= \'2014-01-01\'   and agency_name=\'Department of Health and Mental Hygiene\'';
        // Order by clause
        str += '&$order=created_date'

        var data = [];
        var self = this;

        HTTPRequest.get(str, function(status, headers, content) {
            var d = JSON.parse(content);
            var chart = {};
            chart.chart_title = '311 data';
            chart.series = [];
            chart.categories = [];
            chart.yLabel = 'Count';
            var obj = {};
            obj.type = 'line';
            obj.name = 'count';
            obj.data = [];

            for (var i = 0; i < d.length; i++) {
                chart.categories.push(d[i].month);
                obj.data.push(Number(d[i].total));
            }
            chart.series.push(obj);
            barChartMultipleSeries('chart', 'line', 0, 0, chart);


            // FFT of the above chart 

            var fftData = [];

            console.log(d.length);
            // Copy all the data 
            for (var i = 0; i < d.length; i++) 
                fftData.push(parseFloat(d[i].total));
            
            // Make sue the data length is power of 2 by cycling through again 
            //
            for (var i = d.length; i < 512; i++) {
                fftData.push(parseFloat(d[i - d.length].total));
            }
            // Imaginary part 
            for (var i = 0; i < 512; i++) {
                fftData.push(0);
            }
            var results = getMagnitude(cfft(fftData));
            
            chart.title = 'FFT of 311 calls';

            chart.series = [];
            chart.categories = [];
            chart.yLabel = 'Value';

            obj.type = 'column';
            obj.name = 'fft';

            obj.data = [];
             
            // ALl relavant frequencies are within 255
            for (var i = 0; i < results.length / 2; i++) {
                chart.categories.push(round_to_1(i * (44100) / results.length));
                obj.data.push(Number(results[i]));
            }

            chart.series.push(obj);
            barChartMultipleSeries('fft', 'column', 0, 0, chart);

        });

    });
});
