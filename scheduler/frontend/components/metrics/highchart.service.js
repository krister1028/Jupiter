/* eslint no-trailing-spaces: 0 */
/* eslint guard-for-in: 0 */

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
    config.yAxis.title.text = configDetail.yAxisLabel;
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

  getCategoryCount(config, objectList, seriesNameAttr, categoryNameAttr) {
    /*
     example: (for jobs by product, grouped by job status)
     category = product
     series = job status
     objectList = jobs


     categories = [Product 1, Product 2, Product 3] // list of product names

     categoryNameAttr = 'product.description'
     seriesNameAttr = 'status.description'
     objectList = [ // jobs
      {id: 1, product: {description: Product 1}, status: {description: 'Active'}},
      {id: 2, product: {description: Product 1}, status: {description: 'Active'}},
      {id: 3, product: {description: Product 2}, status: {description: 'Inactive'}},
     ]

     expected series = [
      {name: Active, data: [2, 0]}, // 2 active jobs for Product 1, 0 for Product 2
      {name: Inactive, data: [0, 1]} // 0 active jobs for Product 1, 1 for Product 2
     ]

     expected categories = [Product 1, Product 2]

     */


    const categories = new Set;
    const dataMap = {};

    objectList.forEach((object) => {
      const categoryName = this._utilityService.getDotAttribute(categoryNameAttr, object);
      const seriesName = this._utilityService.getDotAttribute(seriesNameAttr, object);

      categories.add(categoryName);
      highchartService._incrementDataMap(dataMap, categoryName, seriesName);

    });

    config.xAxis.categories = [...categories];

    const series = [];

    // populate empty data
    for (const groupByName in dataMap) {
      series.push({name: groupByName, data: highchartService._getCategoryData(dataMap, config.xAxis.categories, groupByName)});
    }

    config.series = series;

  }

  static _getCategoryData(dataMap, categories, group) {
    const data = [];
    categories.forEach((category, index) => {
      data[index] = dataMap[group][category] || 0;
    });
    return data;
  }

  static _incrementDataMap(dataMap, categoryName, seriesName) {

    if (!dataMap.hasOwnProperty(seriesName)) { // if we're seeing this series for the first time, initialize count to 1
      dataMap[seriesName] = {[categoryName]: 1};
    } else {
      // if the series exists, but this is the first instance of the category, initialize count to 1
      if (!dataMap[seriesName].hasOwnProperty(categoryName)) {
        dataMap[seriesName][categoryName] = 1;
      } else {
        // otherwise, if we've seen both before, increment the count
        dataMap[seriesName][categoryName] += 1;
      }
    }
  }

  buildCategories(categoryNameKey, objectList) {
    const categories = new Set;
    objectList.forEach(obj => {
      categories.add(this._utilityService.getDotAttribute(categoryNameKey, obj));
    });
    return [...categories];
  }

  getDataForTimeLine(rawData) {
    const processedData = [];
    const categoryKeys = this._getKeysFromRawData(rawData);
    categoryKeys.forEach((categoryName, index) => {
      const series = {name: categoryName.replace('__', ' '), data: [], color: highchartColors[index]};
      rawData.forEach(point => {
        if (point.data[categoryName] !== undefined) {
          series.data.push([point.date, point.data[categoryName]]);
        }
      });
      processedData.push(series);
    });
    return processedData;
  }

  _getKeysFromRawData(rawData) {
    const keyList = new Set;
    rawData.forEach(point => {
      Object.keys(point.data).forEach(key => keyList.add(key));
    });
    return keyList;
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
