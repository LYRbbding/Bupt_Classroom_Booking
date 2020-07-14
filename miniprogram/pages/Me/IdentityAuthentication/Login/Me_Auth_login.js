// miniprogram/pages/Me/IdentityAuthentication/Login/Me_Auth_login.js
Page({

  //页面的初始数据
  data: {
    //对话框数据
    navigationbar_show: false,
    dialogShow: false,
    showCheckNetworkDialog: false,
    showWrongValueDialog: false,
    showWrongCaptchaDialog: false,
    showCaptchaHintDialog: false,
    showLoginFailDialog: false,
    OneButton: [{
      text: '我知道了'
    }],
    error: '',
    err_status: false,
    info: '',
    inf_status: false,
    //用户输入信息区
    showCaptcha: true, //true==隐藏,false==显示
    captcha_file: "../../../../images/Me/blank.jpg",
    username: '',
    password: '',
    captcha: '',
    //页面自适应
    marginT: 10,
    weui_h: "weui-article__h1",
    //按钮功能区
    count: 0,
    LoginDisabled: true,
    AuthLoading: false
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    /*************************
     * 判断页面大小情况，自适应显示
     *************************/
    if (wx.getSystemInfoSync().windowHeight > 700) {
      this.setData({
        marginT: 15,
      })
    } else if (wx.getSystemInfoSync().windowHeight < 600) {
      this.setData({
        marginT: 5,
        weui_h: "weui-article__h2"
      })
    }
  },

  /*************************
   * 对话框区
   * 关闭提示对话框
   *************************/
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showCheckNetworkDialog: false,
      showWrongValueDialog: false,
      showWrongCaptchaDialog: false,
      showCaptchaHintDialog: false,
      showLoginFailDialog: false,
    })
  },

  /*************************
   * 输入区
   * 获取用户输入值
   *************************/
  username: function (e) { //用户名
    this.setData({
      username: e.detail.value
    })
    this.checkLogin()
  },
  password: function (e) { //密码
    this.setData({
      password: e.detail.value
    })
    this.checkLogin()
  },
  captcha: function (e) { //验证码
    this.setData({
      captcha: e.detail.value
    })
    this.checkLogin()
  },
  checkLogin: function () {
    if (this.data.username == '' || this.data.password == '' || (this.data.showCaptcha == false && this.data.captcha == '')) {
      this.setData({
        LoginDisabled: true
      })
    } else {
      this.setData({
        LoginDisabled: false
      })
    }
  },

  /*************************
   * 按钮区
   * 按钮功能实现
   *************************/
  GoToAuth: function () {
    if (!this.data.AuthLoading) {
      this.setData({
        AuthLoading: true
      })
      this.Login(true);
    }
  },
  GoBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  ResetInput: function () {
    this.setData({
      username: '',
      password: '',
      captcha: '',
      LoginDisabled: true
    })
  },

  /*************************
   * 功能区
   * 登录功能实现
   *************************/
  Login: function (status) {
    if (status) {
      var url = 'https://auth.bupt.edu.cn/authserver/login?service=https%3A%2F%2Fauth.bupt.edu.cn%2Fauthserver%2Fservices%2Fj_acegi_cas_attributeEdit_security_check'
      var method = 'POST'
      var header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cookie': wx.getStorageSync("Cookie")
      }
      if (this.data.captcha_file == "../../../../images/Me/blank.jpg") {
        var data = {
          'username': this.data.username,
          'password': this.data.password,
          'lt': wx.getStorageSync('lt'),
          'execution': wx.getStorageSync('execution'),
          '_eventId': 'submit',
          'submit': '登录'
        }
      } else {
        var data = {
          'username': this.data.username,
          'password': this.data.password,
          'captchaResponse': this.data.captcha,
          'lt': wx.getStorageSync('lt'),
          'execution': wx.getStorageSync('execution'),
          '_eventId': 'submit',
          'submit': '登录'
        }
      }
    } else {
      var url = 'https://auth.bupt.edu.cn/authserver/userAttributesEdit.do'
      var method = 'GET'
      var header = {
        'cookie': wx.getStorageSync("Cookie")
      }
      var data = ''
    }
    var that = this;
    wx.request({
      url: url,
      method: method,
      header: header,
      data: data,
      success: function (res) {
        console.log("Login……")
        console.log(res)
        /*************************
         * 功能区-登陆失败
         * cookies传递失败
         *************************/
        if (res.cookies != '') {
          that.InitLoginPage(true);
        }
        /*************************
         * 功能区-登陆失败
         * 常见错误
         *************************/
        else if (res.data.indexOf("为了保证您的账号安全，请输入验证码") != -1 || res.data.indexOf("Please enter captcha.") != -1) {
          console.log("Please enter captcha.")
          that.setData({
            AuthLoading: false,
            info: '为了保证您的账号安全，请输入验证码',
            inf_status: true
            //showCaptchaHintDialog: true
          })
        } else if (res.data.indexOf("验证码错误，请重新输入") != -1 || res.data.indexOf("invalid captcha.") != -1) {
          console.log("Invalid captcha.")
          that.setData({
            AuthLoading: false,
            error: '验证码错误，请重新输入',
            err_status: true
            //showWrongCaptchaDialog: true
          })
        } else if (res.data.indexOf("您提供的用户名或者密码有误") != -1 || res.data.indexOf("The username or password you provided cannot be determined to be authentic.") != -1) {
          console.log("The username or password you provided cannot be determined to be authentic.")
          that.setData({
            AuthLoading: false,
            error: '您提供的用户名或者密码有误',
            err_status: true
            //showWrongValueDialog: true
          })
        }
        /*************************
         * 功能区-登陆成功
         * 获取用户信息
         *************************/
        else if (status && res.data.length < 10000) {
          try {
            var lt = res.data.substring(res.data.indexOf("<input type=\"hidden\" name=\"lt\" value=\"") + 38);
            var execution = res.data.substring(res.data.indexOf("<input type=\"hidden\" name=\"execution\" value=\"") + 45);
            wx.setStorageSync('lt', lt.substring(0, lt.indexOf("\" />")));
            wx.setStorageSync('execution', execution.substring(0, execution.indexOf("\" />")));
            that.Login(false)
          } catch (e) {
            that.setData({
              AuthLoading: false,
              showCheckNetworkDialog: true
            })
          }
        }
        /*************************
         * 功能区-登陆失败
         * 非常见错误
         *************************/
        else if (status == false && res.data.length < 10000) {
          console.log("loginfail")
          that.setData({
            AuthLoading: false,
            showLoginFailDialog: true
          })
        }
        /*************************
         * 功能区-登陆成功
         * 用户信息储存
         *************************/
        else {
          wx.removeStorageSync('uid')
          wx.removeStorageSync('realname')
          try {
            var realname = res.data.substring(res.data.indexOf("<div class=\"login_info\">"))
            realname = realname.substring(realname.indexOf("<span>"))
            realname = realname.substring(realname.indexOf("        "))
            realname = realname.substring(0, realname.indexOf("</span>"))
            realname = realname.replace(/\n/g, "")
            realname = realname.replace(/\r/g, "")
            wx.setStorageSync('realname', realname.replace(/ /g, ""))
          } catch (e) {
            that.setData({
              AuthLoading: false,
              showCheckNetworkDialog: true
            })
          }
          wx.setStorageSync('uid', that.data.username)
          that.setData({
            AuthLoading: false
          })
          wx.navigateTo({
            url: '../Authorize/Me_Auth_auth'
          })
          that.LogOut();
        }
        /*************************
         * 功能区-获取验证码
         * 清空验证码
         *************************/
        that.setData({
          captcha_file: "../../../../images/Me/blank.jpg"
        })
        /*************************
         * 功能区-loading
         * 关闭loading显示
         *************************/
        that.setData({
          AuthLoading: false
        })
        /*************************
         * 功能区-获取验证码
         * 获取新验证码
         *************************/
        if (res.data.indexOf("captcha.html") != -1) {
          that.GetCaptcha();
        } else {
          that.setData({
            showCaptcha: true
          })
        }
      },
      fail: function (res) {
        that.setData({
          AuthLoading: false,
          showCheckNetworkDialog: true
        })
        console.log("请求失败", res)
      }
    })
  },

  /*************************
   * 功能区
   * 获取验证码
   *************************/
  GetCaptcha: function () {
    var that = this;
    var header = {
      'cookie': wx.getStorageSync("Cookie")
    }
    wx.downloadFile({
      url: 'https://auth.bupt.edu.cn/authserver/captcha.html',
      header: header,
      success: function (e) {
        that.setData({
          captcha_file: e.tempFilePath,
          showCaptcha: false
        })
      },
      fail: function (e) {
        that.setData({
          AuthLoading: false,
          showCheckNetworkDialog: true
        })
      }
    })
  },

  /*************************
   * 功能区
   * 获取用户信息后登出
   *************************/
  LogOut: function () {
    var that = this
    wx.request({
      url: 'https://auth.bupt.edu.cn/authserver/logout?service=/authserver/login',
      method: 'GET',
      header: {
        'cookie': wx.getStorageSync("Cookie")
      },
      success: function (res) {
        console.log("LogOut……")
        console.log(res)
        that.InitLoginPage(false);
      }
    })
  },

  /*************************
   * 功能区
   * 刷新Cookies
   *************************/
  InitLoginPage: function (AutoRefreshStatus) {
    wx.removeStorageSync("Cookie")
    wx.removeStorageSync("lt")
    wx.removeStorageSync("execution")
    var that = this
    wx.request({
      url: 'https://auth.bupt.edu.cn/authserver/login?service=https%3A%2F%2Fauth.bupt.edu.cn%2Fauthserver%2Fservices%2Fj_acegi_cas_attributeEdit_security_check',
      method: 'GET',
      success: function (res) {
        console.log("Refresh……")
        that.setData({
          count: that.data.count + 1
        })
        console.log(res)
        if (res.header['Set-Cookie'] == '' && that.data.count <= 5) {
          that.InitLoginPage(true);
        } else if (that.data.count > 5) {
          that.setData({
            AuthLoading: false,
            showCheckNetworkDialog: true
          })
        } else {
          wx.setStorageSync('Cookie', res.header['Set-Cookie'].substring(0, res.header['Set-Cookie'].indexOf("; Path=\/")));
          try {
            var lt = res.data.substring(res.data.indexOf("<input type=\"hidden\" name=\"lt\" value=\"") + 38);
            var execution = res.data.substring(res.data.indexOf("<input type=\"hidden\" name=\"execution\" value=\"") + 45);
            wx.setStorageSync('lt', lt.substring(0, lt.indexOf("\" />")));
            wx.setStorageSync('execution', execution.substring(0, execution.indexOf("\" />")));
          } catch (e) {
            that.setData({
              AuthLoading: false,
              showCheckNetworkDialog: true
            })
          }
          if (AutoRefreshStatus) {
            that.Login(true);
          }
        }
      },
      fail: function (res) {
        that.setData({
          AuthLoading: false,
          showCheckNetworkDialog: true
        })
        console.log("请求失败", res)
      }
    })
  },


})