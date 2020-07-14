// 云函数入口文件
const cloud = require('wx-server-sdk')

var rp = require('request-promise');

cloud.init({
  env: 'bupt-classroom-booking' //cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  var access_token = await db.collection('System').doc('3e3d5be2-0c0a-4692-9fc6-092b3e5dcd25').get()
  .then(res => {return res.data.Access_token})
  var openid = []
  if(event.method == 'waiting'){
    openid = await db.collection('Groups').doc(event.group_id).get()
    .then(res => {return res.data.manage_teacher})
  }
  else if(event.method == 'changed'){
    openid = [event.creator]
  }
  else{
    openid = await db.collection('Groups').doc(event.group_id).get()
    .then(res => {
      return res.data.members
    })
  }
  const template_id = event.template_id
  const page_path = event.page_path
  const push_data = event.push_data
  var promise_fun = []
  for (var i=0;i<openid.length;i++){
    var options = {
      method: 'POST',
      uri: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + access_token,
      body: {
        touser: openid[i],
        template_id: template_id,
        page: page_path,
        data: push_data,
        miniprogram_state: 'developer'
      },
      json: true
    }
    const t = rp(options)
    promise_fun.push(t)
  }
  return Promise.all(promise_fun).then(result => {return result})
    
  /*var ttt = await rp(options)*/
  
  /*return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }*/
}