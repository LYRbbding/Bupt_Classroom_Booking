// 云函数入口文件
const cloud = require('wx-server-sdk')

var rp = require('request-promise');

cloud.init({
  env: 'bupt-classroom-booking'//cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var access_token = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxaf7021ac309798aa&secret=9ee8096e1c28deeb69e53a9f47642057')
  access_token = JSON.parse(access_token).access_token
  if (typeof (access_token) !== 'undefined'){
    return await db.collection('System').where({
      _id: '3e3d5be2-0c0a-4692-9fc6-092b3e5dcd25'
    }).update({
      data: {
        Access_token: access_token,
        Timestamp: Date.now(),
        RefreshTime: Date()
      }
    }).then(function (res){
      return (access_token)
    })
  }
}