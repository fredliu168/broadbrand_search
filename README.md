# broadbrand_search

> A Vue.js project

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

select t1._ ,t2.zhuangji_shequjingli,t2.zj_shequjingli_tel from (
select stand_add_name,level2,level3,level4,level6,level7,level8,level9,xiaoqu_id,systenid,box_name,a.res_id,port_num from
(
select _ from TAB_ADDRESS_LINK t left join TAB_ADD_BOX_LINK b on t.segm_id = b.addr_segm_id
)a left join

(select 箱体 id as res_id,sum（端口数-端口占用数）as port_num from TAB_EQUIPMENT_KC group by 箱体 id) p on a.res_id = p.res_id

) t1 left join TAB_XIAOQU_QZ_ALL t2 on t1.xiaoqu_id = t2.xiaoqu_bianma where t1.xiaoqu_id ='000102140000003487154160'

按顺序完成以下优化： 1.扫码模式确认是否正确关联社区经理信息。 2.大幅提升查询效率（原则上在 2 秒内完成查询），且只展示符合模糊搜索条件的数据。可以考虑使用 Oracle 的全文索引（如有需要，请贻鑫配合支撑），如果用内存数据库，请荣烈配合。省公司的资源预判模块，查询是非常快的。建议基础数据获取后，其他去重、汇聚等计算都在内存进行。 3.搜索出来的结果，前面用绿圆圈绿勾表示已安装（请柯超确认是否有相关数据可以判断，不全也没关系）、用绿色打勾代表已覆盖且有剩余端口、用橙色打勾代表已覆盖但无剩余端口，用红色打叉代表未未覆盖。相关标识的意义，要在页面上方进行说明。 4.可以点击箱体名称，查看箱体在精确地图上的位置（请柯超提供页面给佰艺调用）。 5.扫码模块， 显示该门牌的 3 个月内扫码历史（以知道是否近期曾经来营销过）。 6.解决信息安全隐患（请荣烈配合支撑）。

可能要优化的部分（待继续走访一线调研确认后再开发）： 1.扫码模块，可以点击查看门牌所属小区的覆盖情况。也是分级显示，类似前面第 3 点的功能。方便行销人员更有目标地进行敲门。 2.在扫码模块上报快补需求（请柯超和江江确认上报模式和后继处理流程），可以单门牌上报（需填写用户号码），也可以连片上报（需和一线确认方式，蓬壶的网格长是建议可以连续扫描多个门牌，一次性上报）。

使用用户取数:

```sql
--数据库logcollect

SELECT
    accessid,
    flag,
    accesstime,
    os,
    parameters,
    appid,
    result,
    error,
    ipaddress,
    logid,
    excute_tm,
    header
FROM
    commdataaccess_log_v2 t where accessid = 'pkg_broadband_search_queryaddr' where t.accesstime >= to_date('2020-03-01','yyyy-mm-dd hh24:mi:ss')


SELECT
    distinct(Flag)
FROM
    commdataaccess_log_v2 where accessid = 'pkg_broadband_search_queryaddr'

--访问统计
SELECT
    distinct(Flag)
FROM
    commdataaccess_log_v2 t where accessid = 'pkg_broadband_search_queryaddr' and t.accesstime >= to_date('2020-03-30 00:00:00','yyyy-mm-dd hh24:mi:ss')

 SELECT
    count(*)
FROM
    commdataaccess_log_v2 t where accessid = 'qr_query_addr' and t.accesstime >= to_date('2020-03-23 00:00:00','yyyy-mm-dd hh24:mi:ss')



SELECT
    count(*)
FROM
    commdataaccess_log_v2 t where accessid = 'pkg_broadband_search_queryaddr' and t.accesstime >= to_date('2020-03-31 00:00:00','yyyy-mm-dd hh24:mi:ss')

```

```sql
-- 设备端口查下物化视图
select x.stand_add_name,x.add_name,x.systenid,x.level2,x.level3,x.level4, x.level6, x.level7, x.level8,x.level9,x.segm_id,x.res_id,x.box_name,x.xiaoqu_id, devname,total_portnum, x.port_num,zhuangji_shequjingli, zj_shequjingli_tel from
(
select b.stand_add_name,b.add_name, b.systenid, b.level2,b.level3,b.level4, b.level6, b.level7, b.level8,b.level9,b.segm_id,b.res_id,b.box_name,xiaoqu_id,设备名称 as devname,端口数 as total_portnum,sum(e.端口数-e.端口占用数) as port_num
from (
select * from (select *  from TAB_ADDRESS_LINK t left join qraddress.addressinfo_shake q on t.systenid = q.add_id where add_id = 'BFC4BA10-9388-0050-E043-0A8229060050' ) a
left join TAB_ADD_BOX_LINK b on a.segm_id = b.addr_segm_id  ) b
left join TAB_EQUIPMENT_KC e on b.res_id = e.箱体id
group by b.stand_add_name,b.add_name,b.systenid,b.level2,b.level3,b.level4, b.level6, b.level7, b.level8,b.level9,b.segm_id,b.res_id,b.box_name,xiaoqu_id,e.端口数,e.设备名称 ) x left join TAB_XIAOQU_QZ_ALL t on x.xiaoqu_id = t.xiaoqu_bianma
group by x.stand_add_name,x.add_name,x.systenid, x.level2,x.level3,x.level4, x.level6, x.level7, x.level8,x.level9,x.segm_id,x.res_id,x.box_name,x.xiaoqu_id,devname, x.total_portnum, x.port_num,zhuangji_shequjingli, zj_shequjingli_tel


xiaoqu_id = 501100000227898


 e.端口数 as total_portnum,

 x.total_portnum,

 select *  from TAB_ADDRESS_LINK t left join qraddress.addressinfo_shake q on t.systenid = q.add_id where add_id = 'BFC4BA10-9388-0050-E043-0A8229060050'


select * from TAB_EQUIPMENT_KC e where e.箱体id = '000104140000000041288474'


 select b.stand_add_name,b.add_name, b.systenid, b.level2,b.level3,b.level4, b.level6, b.level7, b.level8,b.level9,b.segm_id,b.res_id,b.box_name,xiaoqu_id,e.设备名称,e.端口数,sum(e.端口数-e.端口占用数) as port_num
from (
select * from (select *  from TAB_ADDRESS_LINK t left join qraddress.addressinfo_shake q on t.systenid = q.add_id where add_id = 'BFC4BA10-9388-0050-E043-0A8229060050' ) a
left join TAB_ADD_BOX_LINK b on a.segm_id = b.addr_segm_id  ) b
left join TAB_EQUIPMENT_KC e on b.res_id = e.箱体id
group by b.stand_add_name,b.add_name,b.systenid,b.level2,b.level3,b.level4, b.level6, b.level7, b.level8,b.level9,b.segm_id,b.res_id,b.box_name,xiaoqu_id,e.端口数,e.设备名称

```

手动刷新物化视图：
EXEC DBMS_MVIEW.REFRESH('V_M_PORT_JINGLI_ADDRESS_LINK3','C');

修改物化视图刷新时间

alter materialized view V_M_PORT_JINGLI_ADDRESS_LINK3 refresh force on demand start with sysdate next to_date(concat(to_char(sysdate+1,'dd-mm-yyyy'),' 01:00:00'),'dd-mm-yyyy hh24:mi:ss');

alter materialized view V_M_QR_ADDRESS_LINK2 refresh force on demand start with sysdate next to_date(concat(to_char(sysdate+1,'dd-mm-yyyy'),' 03:00:00'),'dd-mm-yyyy hh24:mi:ss');
