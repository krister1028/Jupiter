/* eslint no-trailing-spaces: 0 */

const highchartColors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];

export default class highchartService {
  constructor(utilityService) {
    this._utilityService = utilityService;
  }

  static _getBaseChartConfig() {
    const chartConfig = {
      credits: {
        enabled: false
      },
      options: {
        chart: {
          type: 'column'
        }
        ,
        tooltip: {
          style: {
            padding: 10,
            fontWeight: 'bold'
          }
        }
      },
      series: [],
      title: {
        text: ''
      },
      size: {
        height: 400
      },
      startDate: undefined,
      endDate: undefined,
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y:.1f}%'
          }
        }
      },
      loading: false,
      xAxis: {
        currentMin: undefined,
        currentMax: undefined,
        title: {
          text: ''
        },
        labels: {}
      },
      yAxis: {
        currentMin: undefined,
        currentMax: undefined,
        title: {
          text: ''
        }
      }
    };
    return chartConfig;
  }

  getColumnConfig(configDetail) {
    const config = highchartService._getBaseChartConfig();
    config.title.text = configDetail.title;
    config.xAxis.title.text = configDetail.xAxisLabel;
    config.xAxis.categories = configDetail.categories;
    config.yAxis.title.text = configDetail.yAxisLabel;
    config.series = [{data: []}];
    return config;
  }

  getTimeLineConfig(configDetail) {
    const config = highchartService._getBaseChartConfig();
    config.options.chart.type = 'spline';
    config.title.text = configDetail.title;
    config.xAxis.title.text = 'Date';
    config.xAxis.dateTimeLabelFormats = {
      day: '%e of %b'
    };
    config.xAxis.minTickInterval = 86400000;
    config.yAxis.title.text = configDetail.yAxisLabel;
    config.xAxis.labels.format = '{value:%m-%d-%Y}';
    config.xAxis.labels.align = 'left';
    config.xAxis.type = 'datetime';
    config.series = [{data: []}];
    return config;
  }

  getCategoryCount(objectList, categories, groups, categoryAttr, groupAttr) {
  /*
    example: (for jobs by product, grouped by job status)
      categories = [Product 1, Product 2, Product 3] // list of product names
      groups = ['Active', 'Inactive'] // list of group columns for each xAxis value (product)
      categoryAttr = 'productDescription'
      groupAttr = 'status'
      objectList = [ // jobs
        {productDescription: Product 1, status: 'Active'},
        {productDescription: Product 1, status: 'Active'},
        {productDescription: Product 2, status: 'Inactive'},
      ]

      expected output = [
        {name: Active, data: [2, 0, 0]}, // 2 active jobs for Product 1, 0 for Product 2, 0 for product 3
        {name: Inactive, data: [0, 1, 0]} // 0 inactive jobs for Product 1, 1 for Product 2, 0 for product 3
      ]
   */

    let objectCategoryValue;
    let objectGroupValue;

    // initialize series list w/o data.  For the example above, series = [{name: 'Active' data: [0, 0, 0]},
    //                                                                    {name: 'Inactive' data: [0, 0, 0]}]
    const series = groups.map(groupName => {
      return {name: groupName, data: categories.map(() => 0), color: highchartColors[0]};
    });

    series.forEach(group => {
      categories.forEach((catName, index) => {
        objectList.forEach(obj => {
          objectCategoryValue = this._utilityService.getDotAttribute(categoryAttr, obj);
          objectGroupValue = this._utilityService.getDotAttribute(groupAttr, obj);
          if (objectCategoryValue === catName && objectGroupValue === group.name) {
            group.data[index] += 1;
          }
        });
      });
    });
    return series;
  }

  getDataForTimeLine(rawData, categoryKeys) {
    const processedData = [];
    categoryKeys.forEach((categoryName, index) => {
      const series = {name: categoryName, data: [], color: highchartColors[index]};
      rawData.forEach(point => {
        series.data.push([point.date, point[categoryName.toLowerCase()]]);
      });
      processedData.push(series);
    });
    return processedData;
  }

}

/*
 var chartConfig = {
 for reference:
 options: {
 //This is the Main Highcharts chart config. Any Highchart options are valid here.
 //will be overriden by values specified below.
 chart: {
 type: 'bar'
 },
 tooltip: {
 style: {
 padding: 10,
 fontWeight: 'bold'
 }
 }
 },
 //The below properties are watched separately for changes.

 //Series object (optional) - a list of series using normal Highcharts series options.
 series: [{
 data: [10, 15, 12, 8, 7]
 }],
 //Title configuration (optional)
 title: {
 text: 'Hello'
 },
 //Boolean to control showing loading status on chart (optional)
 //Could be a string if you want to show specific loading text.
 loading: false,
 //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
 //properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
 xAxis: {
 currentMin: 0,
 currentMax: 20,
 title: {text: 'values'}
 },
 //Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
 useHighStocks: false,
 //size (optional) if left out the chart will default to size of the div or something sensible.
 size: {
 width: 400,
 height: 300
 },
 //function (optional)
 func: function (chart) {
 //setup some logic for the chart
 }
 };

 */
