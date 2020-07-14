// miniprogram/pages/Me/IdentityAuthentication/Initialization/Me_Auth_init.js
Page({

  //页面的初始数据
  data: {
    navigationbar_show: false,
    navigationbar_show: false,
    dialogShow: false,
    showOneButtonDialog: false,
    oneButton: [{
      text: '确定'
    }],
    AuthLoading: false
  },

  GoToAuth: function () {
    if (!this.data.AuthLoading) {
      this.setData({
        AuthLoading: true
      })
      this.InitLoginPage(0);
    }
  },

  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },

  InitLoginPage: function (count) {
    wx.removeStorageSync("Cookie")
    wx.removeStorageSync("lt")
    wx.removeStorageSync("execution")
    var that = this
    wx.request({
      url: 'https://auth.bupt.edu.cn/authserver/login?service=https%3A%2F%2Fauth.bupt.edu.cn%2Fauthserver%2Fservices%2Fj_acegi_cas_attributeEdit_security_check',
      method: 'GET',
      success: function (res) {
        count++
        console.log(res)
        if (res.header['Set-Cookie'] == '' && count <= 5) {
          that.InitLoginPage(count);
        } else if (count > 5) {
          that.setData({
            showOneButtonDialog: true,
            AuthLoading: false
          })
        } else {
          wx.setStorageSync('Cookie', res.header['Set-Cookie'].substring(0, res.header['Set-Cookie'].indexOf("; Path=\/")));
          console.log(wx.getStorageSync('Cookie'))
          try {
            var lt = res.data.substring(res.data.indexOf("<input type=\"hidden\" name=\"lt\" value=\"") + 38);
            var execution = res.data.substring(res.data.indexOf("<input type=\"hidden\" name=\"execution\" value=\"") + 45);
            wx.setStorageSync('lt', lt.substring(0, lt.indexOf("\" />")));
            wx.setStorageSync('execution', execution.substring(0, execution.indexOf("\" />")));
          } catch (e) {
            that.setData({
              showOneButtonDialog: true,
              AuthLoading: false
            })
          }
          console.log(wx.getStorageSync('lt'))
          console.log(wx.getStorageSync('execution'))
          that.setData({
            AuthLoading: false
          })
          wx.navigateTo({
            url: '../Login/Me_Auth_login',
          })
        }
      },
      fail: function (res) {
        that.setData({
          showOneButtonDialog: true,
          AuthLoading: false
        })
        console.log("请求失败", res)
      }
    })
  },

  GoBack: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})