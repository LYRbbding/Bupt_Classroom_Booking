// miniprogram/pages/Me/Settings/Subscription/Me_Settings_subscription.js
Page({

  //页面的初始数据
  data: {
    PCmode: false,
    updateVersion: false,
    navigationbar_show: false,
    error: '',
    error_status: false,
    success: '',
    success_status: false,
    status: 'unknown'
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    if (getApp().globalData.systemPlatform.indexOf('macOS') != -1 || getApp().globalData.systemPlatform.indexOf('Windows') != -1 || getApp().globalData.systemPlatform.indexOf('win') != -1) {
      this.setData({
        PCmode: true
      })
    }
    else if (compareVersion(wx.getSystemInfoSync().SDKVersion, '2.10.1') < 0) {
      this.setData({
        updateVersion: true
      })
    }
    else {
      this.data.identity = getApp().globalData.identity
      var tmplIds = []
      if (this.data.identity == 'student') {
        tmplIds = ['f6bfX5Ve-DEmv-8xrEzoXedd-v_ea45Pjwa6Xv00_Uk', 'fgAy80rTjWmiBZSGXUhP-kivXym3ZPC2SBZoUs9wuUY', 'BsZI66tKemZBy47JXCycawqtf5xS8PgUo6oDbfajObg']
      }
      else {
        tmplIds = ['f6bfX5Ve-DEmv-8xrEzoXedd-v_ea45Pjwa6Xv00_Uk', 'fgAy80rTjWmiBZSGXUhP-kivXym3ZPC2SBZoUs9wuUY', '1ZBtx0qkvbDahDprSqL93sQhW-_iBQTuoLyAiSE0cp0']
      }
      this.data.tmplIds = tmplIds
      wx.getSetting({
        withSubscriptions: true,
        success: result => {
          if (result.subscriptionsSetting[tmplIds[0]] == 'reject' && result.subscriptionsSetting[tmplIds[1]] == 'reject' & result.subscriptionsSetting[tmplIds[2]] == 'reject') {
            this.setData({
              status: 'reject'
            })
          }
          else if (result.subscriptionsSetting[tmplIds[0]] == 'reject' || result.subscriptionsSetting[tmplIds[1]] == 'reject' || result.subscriptionsSetting[tmplIds[2]] == 'reject') {
            this.setData({
              status: 'partial'
            })
          }
          else {
            this.setData({
              status: 'accept'
            })
          }
        }
      })
    }
    function compareVersion(v1, v2) {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)

      while (v1.length < len) {
        v1.push('0')
      }
      while (v2.length < len) {
        v2.push('0')
      }

      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }

      return 0
    }
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    if (!(this.data.PCmode || this.data.updateVersion)) {
      var tmplIds = this.data.tmplIds
      wx.getSetting({
        withSubscriptions: true,
        success: result => {
          if (result.subscriptionsSetting[tmplIds[0]] == 'reject' && result.subscriptionsSetting[tmplIds[1]] == 'reject' & result.subscriptionsSetting[tmplIds[2]] == 'reject') {
            this.setData({
              status: 'reject'
            })
          }
          else if (result.subscriptionsSetting[tmplIds[0]] == 'reject' || result.subscriptionsSetting[tmplIds[1]] == 'reject' || result.subscriptionsSetting[tmplIds[2]] == 'reject') {
            this.setData({
              status: 'partial'
            })
          }
          else {
            this.setData({
              status: 'accept'
            })
          }
        }
      })
    }
  },

  auth: function () {
    var tmplIds = this.data.tmplIds
    if (this.data.identity != undefined) {
      wx.requestSubscribeMessage({
        tmplIds: tmplIds,
        success: res => {
          wx.getSetting({
            withSubscriptions: true,
            success: result => {
              if (result.subscriptionsSetting[tmplIds[0]] == 'reject' && result.subscriptionsSetting[tmplIds[1]] == 'reject' & result.subscriptionsSetting[tmplIds[2]] == 'reject') {
                this.setData({
                  error: '授权失败，请勾选全部项并保持选择',
                  error_status: true,
                  status: 'reject'
                })
              }
              else if (result.subscriptionsSetting[tmplIds[0]] == 'reject' || result.subscriptionsSetting[tmplIds[1]] == 'reject' || result.subscriptionsSetting[tmplIds[2]] == 'reject') {
                this.setData({
                  error: '授权失败，请勾选全部项并保持选择',
                  error_status: true,
                  status: 'partial'
                })
              }
              else {
                this.setData({
                  success: '授权成功',
                  success_status: true,
                  status: 'accept'
                })
              }
            }
          })
        },
        fail: err => {
          this.setData({
            error: '授权失败，请开启“接收消息订阅”',
            error_status: true
          })
        }
      })
    }
  }
})