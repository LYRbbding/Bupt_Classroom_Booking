// miniprogram/pages/Todos/Result/Todos_result.js
const db = wx.cloud.database()
const section = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14']
const section_time = ['08:00', '08:50', '09:50', '10:40', '11:30', '13:00', '13:50', '14:45', '15:40', '16:35', '17:25', '18:30', '19:20', '20:10']

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    school: '',
    type: '',
    volume: '',
    multimedia: '',
    dateS: '',
    dateE: '',
    dayS: '',
    dayE: '',
    sectionS: '',
    sectionE: '',
    person: '',
    uid: '',
    phone: '',
    group: '',
    name: '',
    remarks: '',
    status: 'waiting',
    identity: '',
    AcceptLoading: false,
    radioItems: [
      { name: '该时间段暂不出借教室', value: '0', checked: false },
      { name: '剩余可用教室不足', value: '1', checked: false },
      { name: '团体未登记相关信息', value: '2', checked: false }
    ],
    reason: '',
    SubmitDisabled: false,
    showReason: false,
    showChange: false,
    loading: false
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      identity: getApp().globalData.identity,
      post: getApp().globalData.post
    })
    if (options.data != undefined) {
      var data = JSON.parse(options.data)
      this.parseInfo(data)
    }
    else {
      db.collection('ActivityApplication').doc(options._id)
        .get().then(res => {
          this.parseInfo(res.data)
        })
    }
    this.data._id = options._id
  },

  parseInfo: function (data) {
    var week = ['一', '二', '三', '四', '五', '六', '日']
    this.setData({
      school: data.classroom_school,
      type: data.classroom_type,
      volume: data.classroom_volume,
      classroom: data.classroom,
      multimedia: data.classroom_multimedia,
      timeS: data.time_start,
      timeE: data.time_end,
      dateS: data.time_start.substring(0, data.time_start.indexOf('周') - 1),
      dateE: data.time_end.substring(0, data.time_end.indexOf('周') - 1),
      dayS: '第' + data.time_week_start + '周 周' + week[data.time_date_start - 1],
      dayE: '第' + data.time_week_end + '周 周' + week[data.time_date_end - 1],
      sectionS: data.time_start.substring(data.time_start.indexOf('第')),
      sectionE: data.time_end.substring(data.time_end.indexOf('第')),
      name: data.activity_name,
      remarks: data.activity_remarks,
      status: data.status,
      group_id: data.activity_group,
      creator: data.activity_person,
    })
    db.collection('Groups').doc(data.activity_group).field({
      group_name: true,
      manage_ownership: true,
      manage_admins: true
    }).get().then(res => {
      if (getApp().globalData.openid == res.data.manage_ownership || (res.data.manage_admins != undefined && res.data.manage_admins.length != 0 && res.data.manage_admins.indexOf(getApp().globalData.openid) != -1)) {
        this.setData({
          showChange: true
        })
      }
      this.setData({
        group: res.data.group_name,
      })
    })
    db.collection('StudentInfo').where({
      _openid: data.activity_person
    }).field({
      __realname: true,
      __uid: true,
      contacts_phonenumber: true,
    }).get().then(res => {
      this.setData({
        person: res.data[0].__realname,
        uid: res.data[0].__uid,
        phone: res.data[0].contacts_phonenumber,
      })
    })
    wx.hideLoading()
  },

  value_input: function (e) {
    this.setData({
      reason: e.detail.value,
      radioItems: [
        { name: '该时间段暂不出借教室', value: '0', checked: false },
        { name: '剩余可用教室不足', value: '1', checked: false },
        { name: '团体未登记相关信息', value: '2', checked: false }
      ]
    })
    this.checkInfo()
  },

  value_blur: function (e) {
    this.setData({
      reason: e.detail.value,
      radioItems: [
        { name: '该时间段暂不出借教室', value: '0', checked: false },
        { name: '剩余可用教室不足', value: '1', checked: false },
        { name: '团体未登记相关信息', value: '2', checked: false }
      ]
    })
    this.checkInfo()
  },

  radioChange: function (e) {
    this.setData({
      reason: this.data.radioItems[e.detail.value].name
    })
    this.checkInfo()
  },

  checkInfo() {
    if (this.data.reason != '') {
      this.setData({
        SubmitDisabled: false
      })
    }
    else {
      this.setData({
        SubmitDisabled: true
      })
    }
  },

  change: function () {
    if (!this.data.loading) {
      this.data.loading = true
      wx.showLoading({
        title: '操作中'
      })
      wx.cloud.callFunction({
        name: 'UpdateUserRelationship',
        data: {
          collection: 'ActivityApplication',
          place: {
            _id: this.data._id
          },
          data: {
            status: this.data.status == 'accept' ? 'finish' : 'obsolete',
          }
        },
        success: res => {
          if (res.result.errMsg == "collection.update:ok") {
            getApp().globalData.changed_todos = {
              _id: this.data._id,
              old_status: this.data.status,
              new_status: this.data.status == 'accept' ? 'finish' : 'obsolete'
            }
            wx.navigateBack({
              delta: 1,
            })
          }
          else {
            wx.showToast({
              title: '操作失败',
              image: '../../../images/error.png'
            })
          }
        },
        fail: err => {
          wx.showToast({
            title: '操作失败',
            image: '../../../images/error.png'
          })
        },
        complete: res => {
          this.data.loading = false
          wx.hideLoading()
        }
      })
    }
  },

  Accept: function () {
    if (!(this.data.AcceptLoading || this.data.RefuseLoading)) {
      this.setData({
        AcceptLoading: true
      })
      wx.cloud.callFunction({
        name: 'UpdateUserRelationship',
        data: {
          collection: 'ActivityApplication',
          place: {
            _id: this.data._id
          },
          data: {
            status: getApp().globalData.post == '教务处' ? 'accept' : 'waiting2',
          }
        },
        success: res => {
          if (res.result.errMsg == "collection.update:ok") {
            getApp().globalData.changed_todos = {
              _id: this.data._id,
              old_status: this.data.status,
              new_status: getApp().globalData.post == '教务处' ? 'accept' : 'waiting2'
            }
            if (getApp().globalData.post == '教务处') {
              wx.cloud.callFunction({
                name: 'MessagePushService',
                data: {
                  method: 'changed',
                  group_id: this.data.group_id,
                  creator: this.data.creator,
                  template_id: 'f6bfX5Ve-DEmv-8xrEzoXedd-v_ea45Pjwa6Xv00_Uk',
                  page_path: 'index',
                  push_data: {
                    phrase1: { value: '审核通过' },
                    time3: {
                      value: '2020年' + this.data.timeS.substring(0, this.data.timeS.indexOf(' ')) + ' ' +
                        section_time[section.indexOf(this.data.timeS.substring(this.data.timeS.indexOf('第') + 1, this.data.timeS.indexOf('节')))]
                    },
                    name4: { value: this.data.person.substring(0, 10) },
                    thing2: { value: this.data.name.substring(0, 20) }
                  }
                },
                success: result => {
                  console.log(result)
                }
              })
              wx.cloud.callFunction({
                name: 'MessagePushService',
                data: {
                  method: 'release',
                  group_id: this.data.group_id,
                  template_id: 'fgAy80rTjWmiBZSGXUhP-kivXym3ZPC2SBZoUs9wuUY',
                  page_path: 'index',
                  push_data: {
                    character_string10: {
                      value:
                        this.data.timeS.substring(0, this.data.timeS.indexOf('月')) + '-' +
                        this.data.timeS.substring(this.data.timeS.indexOf('月') + 1, this.data.timeS.indexOf('日')) + '/' +
                        this.data.timeS.substring(this.data.timeS.indexOf('第') + 1, this.data.timeS.indexOf('节')) +
                        '～' + this.data.timeE.substring(0, this.data.timeE.indexOf('月')) + '-' +
                        this.data.timeE.substring(this.data.timeE.indexOf('月') + 1, this.data.timeE.indexOf('日')) + '/' +
                        this.data.timeE.substring(this.data.timeE.indexOf('第') + 1, this.data.timeE.indexOf('节'))
                    },
                    thing6: { value: this.data.name.substring(0, 20) },
                    thing4: { value: (this.data.school + ' ' + this.data.classroom).substring(0, 20) },
                    thing11: { value: this.data.remarks == '' ? '无' : this.data.remarks.substring(0, 20) }
                  }
                },
                success: result => {
                  console.log(result)
                }
              })
            }
            wx.navigateBack({
              delta: 1,
            })
          }
          else {
            wx.showToast({
              title: '操作失败',
              image: '../../../images/error.png'
            })
          }
        },
        fail: err => {
          wx.showToast({
            title: '操作失败',
            image: '../../../images/error.png'
          })
        },
        complete: res => {
          this.setData({
            AcceptLoading: false
          })
        }
      })
    }
  },

  Refuse: function () {
    if (this.data.showReason) {
      if (!(this.data.AcceptLoading || this.data.RefuseLoading)) {
        this.setData({
          RefuseLoading: true
        })
        wx.cloud.callFunction({
          name: 'UpdateUserRelationship',
          data: {
            collection: 'ActivityApplication',
            place: {
              _id: this.data._id
            },
            data: {
              status: 'reject',
              reason: this.data.reason
            }
          },
          success: res => {
            if (res.result.errMsg == "collection.update:ok") {
              getApp().globalData.changed_todos = {
                _id: this.data._id,
                old_status: this.data.status,
                new_status: 'reject'
              }
              wx.cloud.callFunction({
                name: 'MessagePushService',
                data: {
                  method: 'changed',
                  group_id: this.data.group_id,
                  creator: this.data.creator,
                  template_id: 'BsZI66tKemZBy47JXCycawqtf5xS8PgUo6oDbfajObg',
                  page_path: 'index',
                  push_data: {
                    thing9: { value: this.data.name.substring(0, 20) },
                    phrase5: { value: '未通过审核' },
                    thing11: { value: this.data.reason == '' ? '无' : this.data.reason.substring(0, 20) }
                  }
                },
                success: result => {
                  console.log(result)
                }
              })
              wx.navigateBack({
                delta: 1,
              })
            }
            else {
              wx.showToast({
                title: '操作失败',
                image: '../../../images/error.png'
              })
            }
          },
          fail: err => {
            wx.showToast({
              title: '操作失败',
              image: '../../../images/error.png'
            })
          },
          complete: res => {
            this.setData({
              RefuseLoading: false
            })
          }
        })
      }
    }
    else {
      this.setData({
        showReason: true,
        SubmitDisabled: true
      },
        () => {
          wx.pageScrollTo({
            selector: '#reasons',
            duration: 300
          })
        })
    }
  }
})