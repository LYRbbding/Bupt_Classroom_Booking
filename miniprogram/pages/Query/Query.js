// miniprogram/pages/Query/Query.js
const db = wx.cloud.database()
const _ = db.command

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    result_array_morning: [{
      color: 'normal-a', hover: 'hover-a', array: ['', '', '', '', '']
    }, {
      color: 'normal-b', hover: 'hover-b', array: ['', '', '', '', '']
    }, {
      color: 'normal-c', hover: 'hover-c', array: ['', '', '', '', '']
    }, {
      color: 'normal-d', hover: 'hover-d', array: ['', '', '', '', '']
    }, {
      color: 'normal-e', hover: 'hover-e', array: ['', '', '', '', '']
    }],
    result_array_afternoon: [{
      color: 'normal-a', hover: 'hover-a', array: ['', '', '', '', '', '']
    }, {
      color: 'normal-b', hover: 'hover-b', array: ['', '', '', '', '', '']
    }, {
      color: 'normal-c', hover: 'hover-c', array: ['', '', '', '', '', '']
    }, {
      color: 'normal-d', hover: 'hover-d', array: ['', '', '', '', '', '']
    }, {
      color: 'normal-e', hover: 'hover-e', array: ['', '', '', '', '', '']
    }],
    result_array_evening: [{
      color: 'normal-a', hover: 'hover-a', array: ['', '', '']
    }, {
      color: 'normal-b', hover: 'hover-b', array: ['', '', '']
    }, {
      color: 'normal-c', hover: 'hover-c', array: ['', '', '']
    }, {
      color: 'normal-d', hover: 'hover-d', array: ['', '', '']
    }, {
      color: 'normal-e', hover: 'hover-e', array: ['', '', '']
    }],
    result_detail: [
      [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], []],
      [[], [], [], [], [], [], [], [], [], [], [], [], [], []]
    ],
    loading: true,
    info: '',
    inf_status: false
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    let query = async function (_collection, _where) {
      var page_limit = 20     //云函数取100，小程序端取20
      var start = 0           //已经查找过的记录数量
      var query_result = []   //储存查询结果的数组
      var count = 0           //当前页面返回值数量
      do {
        var result_temp = await db.collection(_collection).orderBy('week_search', 'asc').orderBy('date_search', 'asc')
          .orderBy('section_search', 'asc').where(_where).skip(start).get().then(res => { return res.data })
        count = result_temp.length  //更新当前页面记录数量
        start = start + page_limit  //更新已经查询的记录数量
        query_result = query_result.concat(result_temp) //查询结果数组拼合
      } while (count >= page_limit)   //查询终止条件
      return query_result
    }
    var param = JSON.parse(options.param)
    var dateS = param.dateS.split('-')
    var dateE = param.dateE.split('-')
    var date_term = new Date(2020, 1, 23)
    var date_s = new Date(parseInt(dateS[0]), parseInt(dateS[1]) - 1, parseInt(dateS[2]))
    var date_e = new Date(parseInt(dateE[0]), parseInt(dateE[1]) - 1, parseInt(dateE[2]))
    var days_s = (date_s - date_term) / 86400000
    var days_e = (date_e - date_term) / 86400000
    var week_s = Math.ceil(days_s / 7)
    var week_e = Math.ceil(days_e / 7)
    var day_s = days_s - week_s * 7 + 7
    var day_e = days_e - week_e * 7 + 7
    var _where
    this.setData({
      classroom: param.classroom
    })
    if (week_s == week_e) {
      _where = {
        classroom: param.classroom,
        week_search: db.RegExp({
          regexp: week_s < 10 ? '0' + week_s : week_s.toString()
        }),
        date_search: _.and(_.lte(day_e), _.gte(day_s)),
        section_search: _.and(_.lte(param.sectionE), _.gte(param.sectionS))
      }
    }
    else if (week_s == week_e - 1) {
      _where = _.or({
        classroom: param.classroom,
        week_search: db.RegExp({
          regexp: week_s < 10 ? '0' + week_s : week_s.toString()
        }),
        date_search: _.and(_.lte(7), _.gte(day_s)),
        section_search: _.and(_.lte(param.sectionE), _.gte(param.sectionS))
      }, {
        classroom: param.classroom,
        week_search: db.RegExp({
          regexp: week_e < 10 ? '0' + week_e : week_e.toString()
        }),
        date_search: _.and(_.lte(day_e), _.gte(1)),
        section_search: _.and(_.lte(param.sectionE), _.gte(param.sectionS))
      })
    }
    else {
      var week_string = ''
      for (var i = week_s + 1; i < week_e; i++) {
        week_string = week_string + '|' + i < 10 ? '0' + i : i.toString()
      }
      _where = _.or({
        classroom: param.classroom,
        week_search: db.RegExp({
          regexp: week_s < 10 ? '0' + week_s : week_s.toString()
        }),
        date_search: _.and(_.lte(7), _.gte(day_s)),
        section_search: _.and(_.lte(param.sectionE), _.gte(param.sectionS))
      }, {
        classroom: param.classroom,
        week_search: db.RegExp({
          regexp: week_string
        }),
        date_search: _.and(_.lte(7), _.gte(1)),
        section_search: _.and(_.lte(param.sectionE), _.gte(param.sectionS))
      }, {
        classroom: param.classroom,
        week_search: db.RegExp({
          regexp: week_e < 10 ? '0' + week_e : week_e.toString()
        }),
        date_search: _.and(_.lte(day_e), _.gte(1)),
        section_search: _.and(_.lte(param.sectionE), _.gte(param.sectionS))
      })
    }
    Promise.all([query('Curriculum', _where), query('Activities', _where)]).then(value => {
      const res = value[0]
      const res2 = value[1]
      for (var i = 0; i < res.length; i++) {
        this.data.result_detail[res[i].date_search - 1][res[i].section_search - 1].push(res[i])
        if (res[i].date_search < 6) {
          if (res[i].section_search < 6) {
            this.data.result_array_morning[res[i].date_search - 1].array[res[i].section_search - 1] +=
              (res[i].course + '\r\n' + res[i].teacher + '\r\n' + res[i].week_display + '\r\n\r\n')
          }
          else if (res[i].section_search < 12) {
            this.data.result_array_afternoon[res[i].date_search - 1].array[res[i].section_search - 7] +=
              (res[i].course + '\r\n' + res[i].teacher + '\r\n' + res[i].week_display + '\r\n\r\n')
          }
          else {
            this.data.result_array_evening[res[i].date_search - 1].array[res[i].section_search - 13] +=
              (res[i].course + '\r\n' + res[i].teacher + '\r\n' + res[i].week_display + '\r\n\r\n')
          }
        }
      }
      for (var i = 0; i < res2.length; i++) {
        this.data.result_detail[res2[i].date_search - 1][res2[i].section_search - 1].push(res2[i])
        if (res2[i].date_search < 6) {
          if (res2[i].section_search < 6) {
            this.data.result_array_morning[res2[i].date_search - 1].array[res2[i].section_search - 1] +=
              (res2[i].course + '\r\n' + res2[i].week_display + '\r\n\r\n')
          }
          else if (res2[i].section_search < 12) {
            this.data.result_array_afternoon[res2[i].date_search - 1].array[res2[i].section_search - 7] +=
              (res2[i].course + '\r\n' + res2[i].week_display + '\r\n\r\n')
          }
          else {
            this.data.result_array_evening[res2[i].date_search - 1].array[res2[i].section_search - 13] +=
              (res2[i].course + '\r\n' + res2[i].week_display + '\r\n\r\n')
          }
        }
      }
      this.setData({
        result_array_morning: this.data.result_array_morning,
        result_array_afternoon: this.data.result_array_afternoon,
        result_array_evening: this.data.result_array_evening,
        loading: false
      })
    }).catch(err => {
      this.setData({
        loading: false
      })
      wx.showToast({
        title: '查询失败',
        image: '../../images/error.png'
      })
    })
  },

  showDetails(e) {
    var row = parseInt(e.currentTarget.id.substring(1, e.currentTarget.id.indexOf('C')))
    var column = parseInt(e.currentTarget.id.substring(e.currentTarget.id.indexOf('C') + 1))
    console.log(this.data.result_detail[column][row])
    if (this.data.result_detail[column][row].length == 0) {
      this.setData({
        info: '查询时间段内所选节次无课程',
        inf_status: true
      })
    }
    else {
      getApp().globalData.query_detail = this.data.result_detail[column][row]
      wx.navigateTo({
        url: './Query_detail?classroom=' + this.data.classroom + '&row=' + row + '&column=' + column,
      })
    }
  }

})