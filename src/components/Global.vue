<script>
//全局变量2019.5.9
const dev = 0 //开发 1,发布 0
var api = '@api_com_v4'
var g_sel_country = '' //选择的地区
var g_mobile = '' //用户手机号码
var g_addr_serach_params = {
  //9级地址查询条件
  level2: '',
  level6: '',
  level7: '',
  search_addr_keyword: '',
}
if (dev == 1) {
  //开发默认值
  api = '@api_com_v4_no_auth'
  //g_mobile = '13808545254' //'15106000707'
  g_mobile = '13505083000' //'15106000707'
}
const g_countys = [
  '鲤城区',
  '丰泽区',
  '洛江区',
  '晋江市',
  '石狮市',
  '南安市',
  '泉港区',
  '惠安县',
  '安溪县',
  '永春县',
  '德化县',
]
export default {
  g_countys,
  g_mobile,
  g_sel_country,
  api,
  g_addr_serach_params,
}
</script>
