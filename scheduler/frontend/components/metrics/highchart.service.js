/* eslint no-trailing-spaces: 0 */
/* eslint guard-for-in: 0 */

const highchartColors = ['#3f51b5', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'];

export default class highchartService {

  constructor(utilityService, $http) {
    this.historicalChart = 'historicalChart';
    this._utilityService = utilityService;
    this._$http = $http;
  }

  static _getBaseChartConfig() {
    const chartConfig = {
      credits: {
        enabled: false
      },
      options: {
        chart: {
          type: 'column'
        },
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
        categories: [],
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
    config.xAxis.categories = this.buildCategories(configDetail.categoryNameKey, configDetail.objectList);
    config.yAxis.title.text = configDetail.yAxisLabel;
    return config;
  }

  createResourceChart(chartObj) {
    console.log(chartObj.url);
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

    config.xAxis.categories.length = 0;
    config.xAxis.categories.push(...categories);

    const series = [];

    // populate empty data
    Object.keys(dataMap).forEach((groupByName, index) => {
      series.push({
        name: groupByName,
        color: highchartColors[index],
        data: highchartService._getCategoryData(dataMap, config.xAxis.categories, groupByName)
      });
    });

    config.series.length = 0;
    config.series.push(...series);

    return config;

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
