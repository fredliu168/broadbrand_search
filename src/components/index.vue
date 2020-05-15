<template>
  <div>
    <div class="nav">
      <van-nav-bar title="宽带我查查" />
    </div>
    <div>
      <van-tabs v-model="active" @click="onClick_tabs">
        <van-tab title="地址查询">
          <div>
            <van-row>
              <van-col span="9">
                <van-field
                  style="text-align: left;"
                  readonly
                  clickable
                  label-width="40px"
                  label="区县"
                  :value="city"
                  placeholder="选择区县"
                  @click="showPicker = true"
                />
                <van-popup v-model="showPicker" position="bottom">
                  <van-picker
                    show-toolbar
                    :columns="columns"
                    @cancel="showPicker = false"
                    @confirm="onConfirm"
                  />
                </van-popup>
              </van-col>
              <van-col span="14">
                <!-- <van-search v-model="addr" placeholder="请输入搜索地址关键词" @search="onSearch" /> -->
                <van-search
                  placeholder="请输入搜索地址关键词"
                  v-model="addr"
                  show-action
                  shape="round"
                  @search="onSearch"
                >
                  <div slot="action" @click="onSearch">搜索</div>
                </van-search>
              </van-col>
            </van-row>

            <div>
              <van-cell :value="search_result" />
            </div>
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
              <van-cell-group style="text-align: left;">
                <van-cell
                  is-link
                  v-for="item in tableData"
                  @click="rowClick(item)"
                  :key="item.level7"
                  :title="item.level6"
                  :value="item.level7"
                  :label="item.level2 + item.level3 + item.level4 + item.level5"
                />
              </van-cell-group>
            </van-list>
          </div>
        </van-tab>
        <van-tab title="公安门牌扫码查询">
          <van-cell-group style="text-align: left;">
            <!-- <van-switch-cell v-model="checked_qr_or_query" @change="change_qr_query" title="门牌扫码查询/模糊查询" /> -->
          </van-cell-group>
          <div v-if="!checked_qr_or_query">
            <!--扫描公安二维码-->

            <van-radio-group v-model="radio" direction="horizontal">
              <van-row style="padding-top:10px;">
                <van-col span="10" offset="2">
                  <van-radio name="1">门牌覆盖信息查询</van-radio>
                </van-col>
                <van-col span="10" offset="2">
                  <van-radio @click="onClickRadioAddGrid" name="2">覆盖需求上报</van-radio>
                </van-col>
              </van-row>
            </van-radio-group>
            <van-row style="padding-top:20px;">
              <span>扫一扫</span>
            </van-row>
            <van-row>
              <van-button icon="scan" @click="scan_qr" type="primary" />
              <van-row style="padding-top:10px;">
                <van-panel title="覆盖需求上报" v-if="radio==2">
                  <van-cell style="text-align: left;" title="需求地点门牌:" :value="qr_result.addr" />
                  <van-cell
                    style="text-align: left;"
                    title="网格经理:"
                    v-if="managers.length>0"
                    :value="managers[0].username+'('+managers[0].tel+')'"
                  />

                  <van-row v-if="managers.length>0">
                    <van-col span="24">
                      <van-field
                        style="text-align: left;"
                        readonly
                        clickable
                        label-width="140px"
                        label="归属网格(点击选择):"
                        :value="grid_name"
                        placeholder="选择网格"
                        @click="showPickerGrid = true"
                      />
                      <van-popup v-model="showPickerGrid" position="bottom">
                        <van-picker
                          show-toolbar
                          :columns="gridNames"
                          @cancel="showPickerGrid = false"
                          @confirm="onConfirmGridName"
                        />
                      </van-popup>
                    </van-col>
                  </van-row>

                  <van-row v-if="gridNames.length>0">
                    <van-col span="24">
                      <van-field
                        style="text-align: left;"
                        readonly
                        label-width="140px"
                        clickable
                        label="房屋类型(点击选择):"
                        :value="houseType"
                        placeholder="选择类型"
                        @click="showPicker = true"
                      />
                      <van-popup v-model="showPicker" position="bottom">
                        <van-picker
                          show-toolbar
                          :columns="houseTypes"
                          @cancel="showPicker = false"
                          @confirm="onConfirmHouseType"
                        />
                      </van-popup>
                    </van-col>
                  </van-row>
                  <van-row v-if="gridNames.length>0">
                    <van-col span="6">
                      <van-cell style="text-align: left;" title="小区名称:" />
                    </van-col>
                    <van-col span="12">
                      <van-field
                        style="text-align: left;"
                        v-model="areaName"
                        placeholder="请输入小区名称"
                      />
                    </van-col>
                    <van-col span="6">
                      <van-cell style="text-align: left;color:red" :title="checkTip" />
                    </van-col>
                  </van-row>
                  <van-row style="padding-bottom:10px;">
                    <van-button
                      v-if="gridNames.length>0"
                      :disabled="btDisable"
                      @click="ClickUpload"
                      round
                      type="info"
                    >需求上报</van-button>
                  </van-row>
                </van-panel>
                <van-panel title="宽带覆盖信息" v-if="radio==1">
                  <van-cell-group style="text-align: left;">
                    <van-cell title="地址描述" :value="qr_result.addr" />
                    <van-cell title="是否覆盖" v-if="qr_result.box_name === ''" value="否" />
                    <van-cell title="是否覆盖" v-if="qr_result.box_name !== ''" value="是" />
                    <van-cell
                      title="覆盖箱体"
                      v-if="qr_result.box_name !== ''"
                      :value="qr_result.box_name"
                    />
                    <van-cell
                      title="设备名称"
                      v-if="qr_result.devname !== ''"
                      :value="qr_result.devname"
                    />
                    <van-cell
                      title="总端口"
                      v-if="qr_result.total_portnum !== ''"
                      :value="qr_result.total_portnum"
                    />
                    <van-cell
                      title="剩余端口"
                      v-if="qr_result.box_name !== ''"
                      :value="qr_result.port_num"
                    />
                    <van-cell
                      title="社区经理"
                      v-if="
                        qr_result.box_name !== '' &&
                          qr_result.zhuangji_shequjingli !== ''
                      "
                      :value="qr_result.zhuangji_shequjingli"
                    />
                    <van-cell
                      title="手机号码"
                      v-if="
                        qr_result.box_name !== '' &&
                          qr_result.zj_shequjingli_tel !== ''
                      "
                      :value="qr_result.zj_shequjingli_tel"
                    >
                      <a :href="'tel:' + qr_result.zj_shequjingli_tel">
                        {{
                        qr_result.zj_shequjingli_tel
                        }}
                      </a>
                    </van-cell>
                    <van-row type="flex" justify="center" v-if="qr_result.add_longitude !== ''">
                      <van-col>
                        <van-button
                          @click="
                            around_box(
                              qr_result.addr,
                              qr_result.box_name,
                              qr_result.res_id,
                              qr_result.add_longitude,
                              qr_result.add_latitude
                            )
                          "
                          round
                          type="info"
                        >周边资源</van-button>
                      </van-col>
                    </van-row>
                  </van-cell-group>
                </van-panel>
              </van-row>
            </van-row>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import $request from '@/../static/js/ajax-helper.js'
import { Dialog } from 'vant'
import { Toast } from 'vant'
import { Base64 } from 'js-base64'
import { RadioGroup, Radio } from 'vant'
import { Button } from 'vant'
// const wx = require('weixin-js-sdk')
export default {
  data() {
    return {
      url_search_9leveladdr: '/' + this.GLOBAL.api + '/search_9leveladdr',
      url_search_addr:
        '/' + this.GLOBAL.api + '/pkg_broadband_search_queryaddr',
      url_search_qr_query: '/' + this.GLOBAL.api + '/qr_query_addr',
      url_grid_manager: '/' + this.GLOBAL.api + '/getGridManager',
      url_grid_add: '/' + this.GLOBAL.api + '/addGridData',
      url: '/@api_user_info/getUserInfo',
      checked_qr_or_query: false,
      active: 0,
      addr: '',
      addr_police: '',
      city: '',
      showPicker: false,
      columns: this.GLOBAL.g_countys,
      list: [],
      loading: false,
      finished: true,
      tableData: [],
      search_result: '',
      search_result_police: '',
      wx: '',
      qr_result: {
        addr: '', //地址信息
        box_name: '', //覆盖设备
        port_num: '', //剩余端口
        zhuangji_shequjingli: '',
        zj_shequjingli_tel: '',
        res_id: '',
        add_latitude: '',
        add_longitude: ''
      },
      radio: '1',
      houseTypes: ['小区', '普通民宅', '聚类市场', '集团', '沿街商铺', '学校'],
      houseType: '小区',
      areaName: '', //小区名称
      checkTip: '*', //是否必填
      managers: [], //网格经理
      gridNames: [], //网格名称
      grid_name: '',
      showPickerGrid: false,
      btDisable: false,
      systenid: '' //公安门牌ID
    }
  },

  mounted() {
    this.GetUserInfo() //获取用户信息
    var city = sessionStorage.getItem('g_sel_city')

    if (city != null) {
      this.city = city
    }

    var g_search_temp = sessionStorage.getItem('g_search_temp')
    if (
      g_search_temp != null &&
      g_search_temp != '' &&
      g_search_temp != 'undefined'
    ) {
      this.tableData = JSON.parse(g_search_temp)
    }

    //this.active =  parseInt(sessionStorage.getItem("g_tab_active")) ;
    //this.qr_result = JSON.parse(sessionStorage.getItem("g_search_qr_result"));

    var g_search_qr_result = sessionStorage.getItem('g_search_qr_result')
    if (
      g_search_qr_result != null &&
      g_search_qr_result != '' &&
      g_search_qr_result != 'undefined'
    ) {
      this.qr_result = JSON.parse(g_search_qr_result)
    }

    if (this.tableData != null)
      this.search_result = '匹配搜索结果：' + this.tableData.length + '条'
    if (this.tableData_police != null)
      this.search_result_police =
        '匹配搜索结果：' + this.tableData_police.length + '条'

    console.log(window.wx)

    this.getWxApiInfo()

    //this.search_qrcode("4ABBEFA5-52AA-086C-E054-90E2BA54908C");//测试
  },

  methods: {
    onClickRadioAddGrid() {
      var self = this
      this.GridManager()
    },
    GetUserInfo() {
      var vm = this
      $request.get(
        vm.url,
        null,
        function(data) {
          //
          if (data.value.mobile !== undefined) {
            //企业号
            vm.GLOBAL.g_mobile = data.value.mobile //UserId
          } else {
            //app
            vm.GLOBAL.g_mobile = data.value.UserMobile
          }

          console.log(vm.GLOBAL.g_mobile)
        },
        function(error_data) {
          vm.$message.error(error_data.message.substring(0, 120))
        }
      )
    },

    ClickUpload() {
      //需求上报20200509 并在“房屋类型”为“小区、集团、聚类市场、学校”这几类时，“小区名称”字段必填，其他类型选填，必填旁边标注*，选填标注（选填）
      console.log(this.houseType)
      this.AddGridManager()
    },
    AddGridManager() {
      var self = this

      if (self.qr_result.addr == '') {
        self.$message.error('请扫公安门牌')
        return
      }

      if (
        // (self.houseType == '小区' ||
        //   self.houseType == '集团' ||
        //   self.houseType == '聚类市场' ||
        //   self.houseType == '学校') &&
        self.areaName == ''
      ) {
        self.$message.error('请输入小区名称')
        return
      }

      var index = self.gridNames.indexOf(self.grid_name)

      var data_json = {
        os: 4,
        parameters: {
          COUNTY: self.managers[index].county,
          GONGAN_ADDRESS: self.qr_result.addr,
          //GONGAN_ADDRESS: '11',
          GRID_ID: self.managers[index].grid_id,
          GRID_NAME: self.managers[index].grid_name,
          HOUSE_TYPE: self.houseType, //小区类型
          MOBILE: self.managers[index].tel,
          USERNAME: self.managers[index].username,
          XIAOQU_NAME: self.areaName,
          GONGAN_ADDRESS_ID: self.systenid
        }
      }

      console.log(data_json)
      // return
      self.btDisable = true
      $request.post(
        self.url_grid_add,
        data_json,
        function(data) {
          console.log(data)
          self.$message.success('上报成功')
          self.btDisable = false
        },
        function(error_data) {
          console.log(error_data)
          self.$message.error(error_data.message.substring(0, 120))
          self.btDisable = false
        }
      )
    },
    GridManager() {
      //获取网格经理信息
      var self = this
      var data_json = {
        os: 4,
        parameters: {
          tel: self.GLOBAL.g_mobile
        }
      }
      $request.post(
        self.url_grid_manager,
        data_json,
        function(data) {
          console.log(data)
          self.gridNames = []
          self.managers = data.value
          self.managers.forEach(element => {
            self.gridNames.push(element.grid_name)
          })
          if (self.gridNames.length > 0) self.grid_name = self.gridNames[0]
        },
        function(error_data) {
          console.log(error_data)
          // self.$message.error(error_data.message.substring(0, 120))
          self.$message.error('找不到网格，请确认您是否有网格权限')
        }
      )
    },
    onConfirmGridName(value) {
      //选择网格20200511
      this.grid_name = value
      this.showPickerGrid = false
    },
    onConfirmHouseType(value) {
      this.houseType = value
      this.showPicker = false

      // if (
      //   value == '小区' ||
      //   value == '集团' ||
      //   value == '聚类市场' ||
      //   value == '学校'
      // ) {
      //   this.checkTip = '*'
      // } else {
      //   this.checkTip = '（选填）'
      // }
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: rgb(143, 147, 150);color: #fff;font-weight: 500;'
      }
    },
    around_box(addr, box_name, res_id, lon, lat) {
      this.$router.push({
        path:
          '/boxmap/' +
          res_id +
          '/' +
          lat +
          '/' +
          lon +
          '/' +
          encodeURIComponent(box_name) +
          '/' +
          encodeURIComponent(addr)
      })
    },
    onClickLeft() {},

    getWxApiInfo() {
      //获取微信jsapi信息

      var vm = this
      //console.log(window.location.href);
      //vm.$message.error(window.location.href);

      var data_json = {
        site_name: 'broadband_search',
        url: window.location.href
      }
      $request.post(
        '@jsapi_wx',
        data_json,
        function(data) {
          console.log(data)
          window.wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.value.corpid, // 必填，企业微信的corpID
            timestamp: data.value.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.value.nonceStr, // 必填，生成签名的随机串
            signature: data.value.signature, // 必填，签名，见附录1
            jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        },
        function(error_data) {
          console.log(error_data)
          vm.$message.error(error_data.message.substring(0, 120))
          vm.finished = true
        }
      )
    },

    search_qrcode(systenid) {
      //公安扫门牌地址
      setTimeout(() => {
        var vm = this
        var data_json = {
          os: 4,
          parameters: {
            systenid: systenid //'4ABBEFA5-52AA-086C-E054-90E2BA54908C'
          }
        }

        Toast.loading({
          message: '搜索覆盖信息...',
          overlay: true,
          duration: 0,
          forbidClick: true
        })

        $request.post(
          vm.url_search_qr_query,
          data_json,
          function(data) {
            console.log(data)

            if (data.value != '') {
              vm.qr_result.addr =
                data.value.level2 +
                data.value.level3 +
                data.value.level4 +
                data.value.level6 +
                data.value.level7 +
                data.value.level8 +
                data.value.level9
              vm.qr_result.box_name = data.value.box_name
              vm.qr_result.port_num = data.value.port_num
              vm.qr_result.zhuangji_shequjingli =
                data.value.zhuangji_shequjingli

              vm.qr_result.devname = data.value.devname
              vm.qr_result.total_portnum = data.value.total_portnum

              vm.qr_result.add_longitude = data.value.add_longitude
              vm.qr_result.add_latitude = data.value.add_latitude
              vm.qr_result.res_id = data.value.res_id
              vm.qr_result.zj_shequjingli_tel = data.value.zj_shequjingli_tel
              sessionStorage.setItem(
                'g_search_qr_result',
                JSON.stringify(vm.qr_result)
              )
            }

            Toast.clear()

            vm.finished = true
          },
          function(error_data) {
            console.log(error_data)
            vm.$message.error(error_data.message.substring(0, 120))
            vm.finished = true
            Toast.fail(error_data.message.substring(0, 120))
          }
        )

        this.loading = false
      }, 500)
    },
    scan_qr() {
      //扫门牌二维码url_search_qr_query
      // 异步更新数据
      var vm = this
      window.wx.scanQRCode({
        desc: 'scanQRCode desc',
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
          // 回调
          console.log(res)
          //vm.$message.error(res.resultStr);

          Toast.loading({
            message: '搜索门牌中...',
            overlay: true,
            duration: 0,
            forbidClick: true
          })

          $request.get(
            '/@api_qrcode/com/QRCode?url=' + Base64.encode(res.resultStr),
            null,
            function(data) {
              Toast.clear()
              vm.systenid = data.value.num
              vm.search_qrcode(data.value.num)
            },
            function(error_data) {
              console.log(error_data)
              vm.$message.error(error_data.message.substring(0, 120))

              Toast.clear()
            }
          )
        },
        error: function(res) {
          if (res.errMsg.indexOf('function_not_exist') > 0) {
            alert('版本过低请升级')
          }
        }
      })
    },

    change_qr_query() {
      console.log(this.checked_qr_or_query)
      sessionStorage.setItem('g_checked_qr_or_query', this.checked_qr_or_query)
    },

    onConfirm(value) {
      this.city = value
      this.showPicker = false
      sessionStorage.setItem('g_sel_city', this.city)
    },

    onClick_tabs(name, title) {
      console.log(name)
      this.active = name

      sessionStorage.setItem('g_tab_active', name)
    },

    onSearch() {
      console.log(this.city)
      if (this.city == '') {
        Dialog.alert({
          title: '提示',
          message: '请选择区县'
        }).then(() => {
          // on close
        })
        return
      }
      this.finished = false

      this.onLoad()
    },
    onCancel() {},
    rowClick(item) {
      this.GLOBAL.g_addr_serach_params.level2 = item.level2
      this.GLOBAL.g_addr_serach_params.level6 = item.level6
      this.GLOBAL.g_addr_serach_params.level7 = item.level7
      this.$router.push({ path: '/addrinfo' })
    },
    isArray(o) {
      return Object.prototype.toString.call(o) == '[object Array]'
    },
    onLoad() {
      if (this.addr.trim() == '' || this.addr.trim().length < 2) {
        Dialog.alert({
          title: '提示',
          message: '请输入更详细的信息'
        }).then(() => {
          // on close
        })
        return
      }
      this.search_result = '正在搜索中......'
      this.tableData = []

      var keywords_array = this.addr.trim().split(' ')

      console.log(keywords_array)
      var keywords = ''

      keywords_array.forEach(function(e) {
        if (e != '') keywords += '%' + e
      })

      keywords += '%'

      console.log(keywords)

      this.GLOBAL.g_addr_serach_params.search_addr_keyword = keywords

      // 异步更新数据
      setTimeout(() => {
        var vm = this
        var data_json = {
          os: 4,
          parameters: {
            v_country: vm.city,
            v_keyword: keywords, //"%" + vm.addr + "%",
            v_pageno: 1,
            v_perpage: 1000
          }
        }

        console.log(data_json)

        Toast.loading({
          message: '搜索中...',
          overlay: true,
          duration: 0,
          forbidClick: true
        })

        $request.post(
          vm.url_search_addr,
          data_json,
          function(data) {
            console.log(data)
            vm.tableData = data.value.result_data
            vm.search_result = '匹配搜索结果：' + data.value.v_total + '条'
            if (data.value.v_total > 200) {
              vm.$message.error(
                '搜索出的结果数量太多,请输入更精确的地址,减小搜索范围'
              )
              Toast.clear()
            } else if (data.value.result_data.length == 0) {
              //vm.$message.error("当前区县无数据");
              Toast.fail('当前区县无数据,请更改区县或者关键字后查询')
            } else {
              sessionStorage.setItem(
                'g_search_temp',
                JSON.stringify(vm.tableData)
              )
              Toast.clear()
            }

            vm.finished = true
          },
          function(error_data) {
            console.log(error_data)
            vm.$message.error(error_data.message.substring(0, 120))
            vm.finished = true
            Toast.fail(error_data.message.substring(0, 120))
          }
        )

        this.loading = false
      }, 500)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .el-table__header {
  background-color: rgb(0, 115, 202);
  color: #fff;
  font-weight: 500;
} */
.van-nav-bar {
  background-color: rgb(50, 134, 202);
}

.van-nav-bar__title {
  color: white;
}
.van-row {
  background-color: white;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
