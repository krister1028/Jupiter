export default class highchartService {
  constructor(jobService, jobTypeService) {
    this._jobService = jobService;
    this._jobTypeService = jobTypeService;
  }

  _getBaseChartConfig() {
    const chartConfig = {
      credits: {
        enabled: false
      },
      options: {
        chart: {
          type: 'line'
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
        }
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

  getJobsCompletedByProductChart() {
    const config = this._getBaseChartConfig();
    config.options.chart.type = 'column';
    config.title.text = 'Jobs Completed By Product';
    config.xAxis.title.text = 'Product';
    config.xAxis.type = 'category';
    config.yAxis.title.text = 'Job Count';
    config.series = [
      {
        showInLegend: false,
        data: this._jobService.getJobsCompletedByProduct(config.startDate, config.endDate)
      }
    ];
    return config;
  }

  getJobsCompletedByTypeChart() {
    const config = this._getBaseChartConfig();
    return this.getJobsCompletedByJobType(config.startDate, config.endDate).then(seriesData => {
      config.options.chart.type = 'column';
      config.title.text = 'Jobs Completed By Type';
      config.xAxis.title.text = 'Job Type';
      config.xAxis.type = 'category';
      config.yAxis.title.text = 'Job Count';
      config.series = [
        {
          showInLegend: false,
          data: seriesData
        }
      ];
      return config;
    });
  }

  getJobsCompletedByJobType() {
    const config = this._getBaseChartConfig();
    return this._jobTypeService.get().then(() => {
      const jobByType = {};
      let typeName;
      // generate object with product name and job count
      this._filterJobsByDate(config.startDate, config.endDate).forEach(job => {
        if (job.completed_timestamp) {
          typeName = this._jobTypeService.itemList.filter(jt => jt.id === job.type)[0].description;
          if (jobByType.hasOwnProperty(typeName)) {
            jobByType[typeName] += 1;
          } else {
            jobByType[typeName] = 1;
          }
        }
      });
      const returnArray = [];
      Object.keys(jobByType).forEach(p => returnArray.push([p, jobByType[p]]));
      return returnArray;
    });
  }

  _filterJobsByDate(startDate, endDate) {
    let jobs = this._jobService.itemList;
    if (startDate) {
      jobs = jobs.filter(j => new Date(j.completion_date) >= startDate);
    }
    if (endDate) {
      jobs = jobs.filter(j => new Date(j.completion_date) <= endDate);
    }
    return jobs
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
