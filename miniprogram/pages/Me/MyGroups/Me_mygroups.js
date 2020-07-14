// miniprogram/pages/Me/MyGroups/Me_mygroups.js

Page({

  //页面的初始数据
  data: {
    PCmode: false,
    navigationbar_show: false,
    access_token: '',
    nogroup: true,
    nogroup_text: '加载中……',
    classes: false,
    associations: false,
    classes_title: '我的班级',
    associations_title: '我的学生组织/社团',
    classes_array: [],
    associations_array: [],
    showLoading: true,
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    if (getApp().globalData.systemPlatform.indexOf('macOS') != -1 || getApp().globalData.systemPlatform.indexOf('Windows') != -1 || getApp().globalData.systemPlatform.indexOf('win') != -1) {
      this.setData({
        PCmode: true
      })
    }
    this.data.teacher = ''
    this.refreshList()
    this.data.groups_array = []
    if (getApp().globalData.identity == 'teacher') {
      this.data.teacher = '管理'
    }
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    if (getApp().globalData.newgroup) {
      getApp().globalData.newgroup = false
      this.setData({
        showLoading: true
      })
      this.refreshList()
    }
  },

  refreshList: function () {
    var that = this
    wx.getStorage({
      key: 'MyGroups',
      success: function (result) {
        that.getUserGroupInfo('verify', result.data.groups_array, result.data.associations_array, result.data.classes_array)
        if (result.data.groups_array.length !== 0) {
          that.setData({
            nogroup: false
          })
          that.data.groups_array = result.data.groups_array
          that.setData({
            associations: result.data.associations_count == 0 ? false : true,
            associations_array: result.data.associations_array,
            associations_title: '我' + that.data.teacher + '的学生组织/社团 (' + result.data.associations_count + ')',
            classes: result.data.classes_count == 0 ? false : true,
            classes_array: result.data.classes_array,
            classes_title: '我' + that.data.teacher + '的班级 (' + result.data.classes_count + ')'
          })
        }
      },
      fail: function (result) {
        that.getUserGroupInfo('get')
      }
    })
  },

  addgroup: function () {
    wx.navigateTo({
      url: './CreateGroup/Me_Groups_create',
    })
  },

  getUserGroupInfo: function (method, groups = [], associations = [], classes = []) {
    var that = this
    wx.cloud.callFunction({
      name: 'SearchUserGroups',
      data: {
        uid: getApp().globalData.uid,
        method: method,
        groups: groups,
        associations: associations,
        classes: classes
      },
      success: function (result) {
        console.log(result)
        if (result.result.result == 'Fail') {
          wx.showToast({
            title: '拉取失败',
            image: '../../../images/error.png'
          })
        }
        else if (result.result.verification == false) {
          var associations_count = 0
          var classes_count = 0
          var associations_array = []
          var classes_array = []
          var groups_array = result.result.groups_array
          var i = 0
          if (result.result.groups_array == undefined) {
            result.result.groups_array = []
          }
          if (result.result.groups_array.length !== 0) {
            that.setData({
              nogroup: false
            })
            while (i < result.result.groups_array.length && result.result.group_res[i].group_type == 'associations') {
              if (that.data.groups_array.indexOf(result.result.group_res[i]._id) == -1) {
                result.result.group_res[i].new_group = true
              }
              associations_array.push(result.result.group_res[i])
              i++
            }
            associations_count = i
            while (i < result.result.groups_array.length && result.result.group_res[i].group_type == 'classes') {
              if (that.data.groups_array.indexOf(result.result.group_res[i]._id) == -1) {
                result.result.group_res[i].new_group = true
              }
              classes_array.push(result.result.group_res[i])
              i++
            }
            classes_count = i - associations_count
            wx.setStorage({
              key: 'MyGroups',
              data: {
                groups_array: groups_array,
                associations_count,
                associations_array,
                classes_count,
                classes_array
              },
            })
            that.setData({
              associations: associations_count == 0 ? false : true,
              associations_array: associations_array,
              associations_title: '我' + that.data.teacher + '的学生组织/社团 (' + associations_count + ')',
              classes: classes_count == 0 ? false : true,
              classes_array: classes_array,
              classes_title: '我' + that.data.teacher + '的班级 (' + classes_count + ')'
            })
          }
          else {
            that.setData({
              nogroup: true,
              nogroup_text: '您还没有' + (that.data.teacher == '' ? '加入' : that.data.teacher) + '任何团体！',
            })
          }
        }
        that.setData({
          showLoading: false
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '拉取失败',
          image: '../../../images/error.png'
        })
        that.setData({
          showLoading: false
        })
      }
    })
  },

  GoToGroup: function (e) {
    var groups_array = this.data.associations_array.concat(this.data.classes_array)
    getApp().globalData.groups_array = groups_array
    for (var i = 0; i < groups_array.length; i++) {
      if (e.currentTarget.id == groups_array[i]._id) {
        getApp().globalData.currentGroup = groups_array[i]
      }
    }
    wx.navigateTo({
      url: './GroupDetails/Me_Groups_details?group_id=' + e.currentTarget.id,
    })
  },

})