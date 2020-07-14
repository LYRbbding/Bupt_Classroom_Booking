// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: 'bupt-classroom-booking' }
)
const _=db.command

const MAX_LIMIT = 100

exports.main = async (event, context) => {
  var result=await db.collection('ClassroomInfo').where({
    campus: '沙河校区',
    capacity: _.gt(20).and(_.lt(70)),
    type: '多媒体教室'
  })
    .get({
      success: function (res) {
        // res.data 是包含以上定义的两条记录的数组

        //return res.data
      }
      
    })
  
for (var i = 0; i < result.length; i++) {
  classroom_list.push(result[i].classroom)
}

var campus = '沙河校区'   //校区
var classroom = ['N103', 'N105']  //教室
var date_min = 1        //星期起始，范围1(周一)-7(周日)
var date_max = 7        //星期终止，范围1(周一)-7(周日)
var section_min = 1     //节次起始，范围1-14
var section_max = 14    //节次终止，范围1-14
var page_limit = 100    //云函数取100，小程序端取20
var start = 0           //已经查找过的记录数量
var query_result = []   //储存查询结果的数组
const weeks = ['01', '02', '03']  //查询的星期范围
var week_str = weeks[0]   //星期范围的正则表达式字符串及其拼接
for (var i = 1; i < weeks.length; i++) {
  week_str = week_str + '|' + weeks[i]
}
var count = 0           //当前页面返回值数量
do {
  var result_temp = await db.collection('Curriculum').where({
    campus: campus,
    classroom: _.in(classroom),
    week_search: db.RegExp({
      regexp: week_str
    }),
    date_search: _.and(_.lte(date_max), _.gte(date_min)),//_.or表示或者关系，_.lte表示小于等于，_.gte表示大于等于
    section_search: _.and(_.lte(section_max), _.gte(section_min))
  }).skip(start).get().then(res => { return res.data })
  count = result_temp.length  //更新当前页面记录数量
  start = start + page_limit  //更新已经查询的记录数量
  query_result = query_result.concat(result_temp) //查询结果数组拼合
} while (count >= page_limit)   //查询终止条件
return query_result     //显示查询结果

}