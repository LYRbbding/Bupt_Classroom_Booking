// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'bupt-classroom-booking'//cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  return await db.collection(event.collection).where(event.place).update({
    data: event.data
  }).then(res => {return res})
  .catch(err => {return err})
}