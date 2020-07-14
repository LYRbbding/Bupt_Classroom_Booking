// miniprogram/pages/Me/MyGroups/CreateGroup/Me_Groups_create.js

Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    radioItems: [
      { name: '班级', value: '0', checked: false },
      { name: '社团', value: '1', checked: false },
      { name: '学生组织', value: '2', checked: false }
    ],
    textarea_count: 0,
    formData: {

    },
    rules: [{
      name: 'radio',
      rules: { required: true, message: '*团体类型必填' },
    }, {
      name: 'name',
      rules: { required: true, message: '*团体名称必填' },
    }],
    profile_photo: '/images/group.png',
    available: false,
    unavailable: false,
    namechecking: false,
    namechecked: false,
    showDialog: false,
    buttons: [
      {
        type: 'default',
        disabled: false,
        loading: false,
        className: '',
        text: '取消',
        value: 0
      },
      {
        type: 'primary',
        disabled: true,
        loading: false,
        className: '',
        text: '确定',
        value: 1
      }
    ],
    qq_items: [
      { name: 'group', value: 'QQ群', checked: 'true' },
      { name: 'qq', value: '个人QQ' },
    ],
    qq_type: 'group',
    alert: ' '
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.data.description = ''
  },

  radioChange: function (e) {
    console.log(e)
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      [`formData.radio`]: e.detail.value
    });
  },

  name_focus(e) {
    this.setData({
      available: false,
      unavailable: false,
      namechecking: false,
      namechecked: false,
    })
  },
  name_input(e) {
    this.setData({
      [`formData.name`]: e.detail.value,
    })
  },
  name_blur(e) {
    this.setData({
      [`formData.name`]: e.detail.value,
      available: false,
      unavailable: false,
      namechecking: e.detail.value != '' ? true : false
    })
    var that = this
    if (e.detail.value != '') {
      const db = wx.cloud.database()
      db.collection('Groups').where({
        group_name: e.detail.value
      }).count().then(res => {
        if (res.total != 0) {
          that.setData({ unavailable: true })
        }
        else {
          that.setData({ available: true })
        }
        that.setData({
          namechecked: true,
          namechecking: false
        })
      }).catch(err => {
        that.setData({
          namechecking: false
        })
        wx.showToast({
          title: '网络异常',
          image: '../../../../images/error.png'
        })
      })
    }
  },

  textarea_input(e) {
    this.setData({
      textarea_count: e.detail.value.length,
      description: e.detail.value
    })
  },
  textarea_blur(e) {
    this.setData({
      description: e.detail.value
    })
  },

  photo(e) {
    this.setData({
      showDialog: true,
      preview_photo: ''
    })
  },
  qqradioChange(e) {
    this.setData({ qq_type: e.detail.value })
    this.setData({
      exist: false,
      unexist: false,
      photochecking: this.data.profile != '' ? true : false,
      alert: ' '
    })
    var that = this
    if (this.data.qq_type == 'qq') {
      var url = 'https://q2.qlogo.cn/headimg_dl?dst_uin=' + this.data.profile + '&spec=0'
    }
    else {
      var url = 'https://p.qlogo.cn/gh/' + this.data.profile + '/' + this.data.profile + '/0'
    }
    if (this.data.profile != '') {
      this.checkExist(url)
    }
  },
  photoDialog(e) {
    if (e.detail.index == 1) {
      if (this.data.qq_type == 'qq') {
        this.setData({ profile_photo: 'https://q2.qlogo.cn/headimg_dl?dst_uin=' + this.data.profile + '&spec=0' })
      }
      else {
        this.setData({ profile_photo: 'https://p.qlogo.cn/gh/' + this.data.profile + '/' + this.data.profile + '/0' })
      }
    }
    this.setData({ profile: '', showDialog: false })
  },
  profile_photo_focus(e) {
    this.setData({
      [`buttons[1].disabled`]: true,
      exist: false,
      unexist: false,
      photochecking: false,
      alert: ' '
    })
  },
  profile_photo_input(e) {
    this.setData({ profile: e.detail.value })
  },
  profile_photo_blur(e) {
    this.setData({
      profile: e.detail.value,
      exist: false,
      unexist: false,
      photochecking: e.detail.value != '' ? true : false
    })
    if (this.data.qq_type == 'qq') {
      var url = 'https://q2.qlogo.cn/headimg_dl?dst_uin=' + this.data.profile + '&spec=0'
    }
    else {
      var url = 'https://p.qlogo.cn/gh/' + this.data.profile + '/' + this.data.profile + '/0'
    }
    if (e.detail.value != '') {
      this.checkExist(url)
    }
  },
  checkExist: function (url) {
    var that = this
    wx.request({
      url: url,
      success: function (res) {
        if (res.header['X-Info'].indexOf('notexist') != -1) {
          that.setData({
            unexist: true,
            alert: '*输入错误，请检查后重新输入'
          })
        }
        else {
          that.setData({
            exist: true,
            preview_photo: url,
            [`buttons[1].disabled`]: false,
          })
        }
        that.setData({
          photochecking: false,
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '失败',
          image: '../../../../images/error.png'
        })
        that.setData({
          photochecking: false,
        })
      }
    })
  },

  GoBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  CreateGroup: function () {
    if (!this.data.SaveLoading) {
      this.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            this.setData({
              error: errors[firstError[0]].message
            })
          }
        }
        if (valid && !this.data.namechecked) {
          valid = false
        }
        /*if (valid && this.data.unavailable) {
          this.setData({
            error: '*团体名称不可用'
          })
          valid = false
        }*/
        if (valid && !this.data.description.length) {
          this.setData({
            error: '*团体简介必填'
          })
          valid = false
        }
        if (valid) {
          this.setData({
            error: '',
            SaveLoading: true
          })
          var data = {
            group_description: this.data.description,
            group_image: this.data.profile_photo,
            group_name: this.data.formData.name,
            group_type: this.data.formData.radio == 0 ? 'classes' : 'associations',
            privacy: '00',
            verified_members: [],
            manage_admins: [],
            manage_teacher: []
          }
          if (this.data.formData.radio != 0) {
            data.subtype = this.data.formData.radio == 1 ? '社团' : '学生组织'
          }
          var that = this
          wx.cloud.callFunction({
            name: 'SearchGroupsMembers',
            data: {
              id: 'create',
              method: 'create',
              data: data
            },
            success: function (res) {
              if (res.result.available != undefined) {
                that.setData({
                  error: '*团体名称不可用'
                })
              }
              else if (res.result.result._id != undefined) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  success: function (result) {
                    getApp().globalData.newgroup = true
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1500)
                  }
                })
              }
              else {
                wx.showToast({
                  title: '失败',
                  image: '../../../../images/error.png'
                })
              }
              console.log(res)
              that.setData({ SaveLoading: false })
            },
            fail: function (err) {
              wx.showToast({
                title: '失败',
                image: '../../../../images/error.png'
              })
              that.setData({ SaveLoading: false })
            }
          })
        }
      })
    }
  }

})