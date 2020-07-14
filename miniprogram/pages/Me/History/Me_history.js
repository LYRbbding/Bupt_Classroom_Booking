// miniprogram/pages/Me/History/Me_history.js
Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    var identity = getApp().globalData.identity
    var post = getApp().globalData.post
    const db = wx.cloud.database()
    const _ = db.command
    let query = async function (_collection, _where, _field) {
      var data = []
      var count = 0
      do {
        var t = await db.collection(_collection).where(_where).field(_field).skip(count).get().then(res => { return res.data })
        data = data.concat(t)
        count = count + t.length
      } while (t.length >= 20)
      return { data, count }
    }
    if (identity == 'student') {
      var where1 = _.or({ manage_ownership: getApp().globalData.openid }, { members: getApp().globalData.openid })
      var field1 = { _id: true, group_name: true, manage_ownership: true, manage_admins: true }
      query('Groups', where1, field1).then(res => {
        var group_id = []
        var group_name = []
        var admins_id = []
        for (var i = 0; i < res.count; i++) {
          group_id.push(res.data[i]._id)
          group_name.push(res.data[i].group_name)
          if (res.data[i].manage_ownership == getApp().globalData.openid || res.data[i].manage_admins != undefined && res.data[i].manage_admins.length != 0 && res.data[i].manage_admins.indexOf(getApp().globalData.openid) != -1) {
            admins_id.push(res.data[i]._id)
          }
        }
        this.data.mygroup_id = group_id
        this.data.mygroups_name = group_name
        this.data.admins_id = admins_id
        var where2 = { activity_group: _.in(group_id), status: 'finish' }
        var field2 = {
          activity_group: true,
          activity_name: true,
          classroom_school: true,
          classroom: true,
          time_start: true,
          time_end: true
        }
        return {
          finish: query('ActivityApplication', where2, field2).then(res => {
            for (var i = 0; i < res.count; i++) {
              res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
              var t_s = res.data[i].time_start
              var t_e = res.data[i].time_end
              res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
              res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
              res.data[i].time_start = t_s.split(' ')[2]
              res.data[i].time_end = t_e.split(' ')[2]
            }
            this.setData({
              arrayFinish: res.data,
            })
            return res.data
          }),
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading()
      })
    }
    else if (post != '教务处') {
      var where1 = { manage_teacher: getApp().globalData.openid }
      var field1 = { _id: true, group_name: true }
      query('Groups', where1, field1).then(res => {
        var group_id = []
        var group_name = []
        for (var i = 0; i < res.count; i++) {
          group_id.push(res.data[i]._id)
          group_name.push(res.data[i].group_name)
        }
        this.data.mygroup_id = group_id
        this.data.mygroups_name = group_name
        var where2 = { activity_group: _.in(group_id), status: 'finish' }
        var field2 = {
          activity_group: true,
          activity_name: true,
          classroom_school: true,
          classroom: true,
          time_start: true,
          time_end: true
        }
        return {
          finish: query('ActivityApplication', where2, field2).then(res => {
            for (var i = 0; i < res.count; i++) {
              res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
              var t_s = res.data[i].time_start
              var t_e = res.data[i].time_end
              res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
              res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
              res.data[i].time_start = t_s.split(' ')[2]
              res.data[i].time_end = t_e.split(' ')[2]
            }
            this.setData({
              arrayFinish: res.data,
            })
            return res.data
          }),
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading()
      })
    }
    else {
      var where2 = { status: 'finish' }
      var field2 = {
        activity_group: true,
        activity_name: true,
        classroom_school: true,
        classroom: true,
        time_start: true,
        time_end: true
      }
      query('ActivityApplication', where2, field2).then(res => {
        for (var i = 0; i < res.count; i++) {
          res.data[i].activity_group = this.data.mygroups_name[this.data.mygroup_id.indexOf(res.data[i].activity_group)]
          var t_s = res.data[i].time_start
          var t_e = res.data[i].time_end
          res.data[i].date_start = t_s.split(' ')[0] + '(' + t_s.split(' ')[1] + ')'
          res.data[i].date_end = t_e.split(' ')[0] + '(' + t_e.split(' ')[1] + ')'
          res.data[i].time_start = t_s.split(' ')[2]
          res.data[i].time_end = t_e.split(' ')[2]
        }
        this.setData({
          arrayFinish: res.data,
        })
        wx.hideLoading()
        return res.data
      })
    }
  },

  GoToApplicationResult(e) {
    wx.navigateTo({
      url: '../../Todos/Result/Todos_result?_id=' + e.currentTarget.id,
    })
  },

})