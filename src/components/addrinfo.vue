<template>
  <div>
    <div class="nav">
      <van-nav-bar
        title="宽带覆盖查询"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </div>
    <div>
      <van-search
        placeholder="请输入房间号、梯号搜索"
        v-model="room_no"
        shape="round"
        show-action
        @search="onSearch"
      >
        <!-- v-on:input="onSearch" -->
        <div slot="action" @click="onSearch">搜索</div>
      </van-search>
      <van-cell :value="addr" />

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
      >
        <van-collapse
          style="text-align: left;"
          @change="change($event)"
          v-model="activeNames"
          accordion
        >
          <van-collapse-item
            v-for="(item, index) in room_list"
            @click="rowClick(item)"
            :key="item.leve9"
            :title="item.level8 + ' ' + item.level9"
            :name="index"
          >
            <van-cell-group>
              <van-cell title="公安门牌" :value="item.add_name" />
              <van-cell
                title="是否覆盖"
                v-if="item.box_name === ''"
                value="否"
              />
              <van-cell
                title="是否覆盖"
                v-if="item.box_name !== ''"
                value="是"
              />
              <van-cell
                title="覆盖箱体"
                v-if="item.box_name !== ''"
                :value="item.box_name"
              />
              <van-cell
                title="设备名称"
                v-if="item.devname !== ''"
                :value="item.devname"
              />
              <van-cell
                title="总端口"
                v-if="item.total_portnum !== ''"
                :value="item.total_portnum"
              />
              <van-cell
                title="剩余端口"
                v-if="item.box_name !== ''"
                :value="item.port_num"
              />
              <van-cell
                title="社区经理"
                v-if="item.box_name !== '' && item.zhuangji_shequjingli !== ''"
                :value="item.zhuangji_shequjingli"
              />
              <van-cell
                title="手机号码"
                v-if="item.box_name !== '' && item.zj_shequjingli_tel !== ''"
                :value="item.zj_shequjingli_tel"
              >
                <a :href="'tel:' + item.zj_shequjingli_tel">
                  {{ item.zj_shequjingli_tel }}
                </a>
              </van-cell>
              <van-row
                type="flex"
                justify="center"
                v-if="item.add_longitude !== ''"
              >
                <van-col>
                  <van-button
                    @click="
                      around_box(
                        item.box_name,
                        item.res_id,
                        item.add_longitude,
                        item.add_latitude,
                        item.add_name
                      )
                    "
                    round
                    type="info"
                    >周边资源</van-button
                  >
                </van-col>
              </van-row>
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>
      </van-list>
    </div>
  </div>
</template>

<script>
import $request from "@/../static/js/ajax-helper.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      url_query_room:
        "/" + this.GLOBAL.api + "/pkg_broadband_search_queryroom3",
      activeNames: 0,
      collapse_len: 0,
      list: [],
      loading: false,
      finished: false,
      room_no: "",
      detail: [],
      room_list: [],
      show: false,
      addr: ""
    };
  },
  mounted() {
    this.onLoad(this.GLOBAL.g_addr_serach_params.search_addr_keyword);
  },
  methods: {
    around_box(box_name, res_id, lon, lat, addr) {
      this.$router.push({
        path:
          "/boxmap/" +
          res_id +
          "/" +
          lat +
          "/" +
          lon +
          "/" +
          encodeURIComponent(box_name) +
          "/" +
          encodeURIComponent(addr)
      });
    },
    onSearch() {
      //this.list = [];
      this.finished = false;
      //this.onLoad();
      console.log(this.room_no.trim());
      //this.Query(this.room_no.trim());
      var keywords_array = this.room_no.trim().split(" ");
      console.log(keywords_array);
      var keywords = "";
      keywords_array.forEach(function(e) {
        if (e != "") keywords += "%" + e;
      });
      keywords += "%";

      this.onLoad(keywords);
    },
    onClickLeft() {
      this.$router.push({ path: "/" });
    },
    rowClick(item) {
      // this.show = true;
      console.log("rowClick");
      console.log(item);
    },
    change(event) {
      console.log("change");
      console.log(this.activeNames);
      if (event != "") console.log(event);
      var door = event;
      this.detail = {
        port: 4,
        dev: "QLT0401-5680T_" + door
      };
    },
    isArray(o) {
      return Object.prototype.toString.call(o) == "[object Array]";
    },

    Query(query) {
      console.log(query);
      // var vm = this;
      // this.room_list = [];
      // if (query !== "") {
      //   vm.finished = true;
      //   setTimeout(() => {
      //     vm.finished = false;
      //     vm.room_list = vm.list.filter(item => {
      //       return (
      //         item.level8.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
      //         item.level9.toLowerCase().indexOf(query.toLowerCase()) > -1
      //       );
      //     });
      //     //console.log(vm.room_list);
      //    vm.activeNames = 0

      //    vm.finished = true;

      //   }, 200);
      // } else {
      //   vm.list.filter(item => {
      //     vm.room_list.push(item);
      //   });
      // }
    },

    onLoad(addr_keyword) {
      // 异步更新数据 vm.GLOBAL.g_addr_serach_params.search_addr_keyword
      setTimeout(() => {
        var vm = this;
        var data_json = {
          os: 4,
          parameters: {
            v_country: vm.GLOBAL.g_addr_serach_params.level2,
            v_level6: vm.GLOBAL.g_addr_serach_params.level6,
            v_level7: vm.GLOBAL.g_addr_serach_params.level7,
            v_keyword: addr_keyword
          }
        };

        console.log(data_json);

        Toast.loading({
          message: "搜索中...",
          overlay: true,
          duration: 0,
          forbidClick: true
        });

        $request.post(
          vm.url_query_room,
          data_json,
          function(data) {
            console.log(data);

            vm.room_list = data.value.result_data;

            if (vm.room_list.length > 0)
              vm.addr =
                vm.room_list[0].level2 +
                vm.room_list[0].level3 +
                vm.room_list[0].level4 +
                vm.room_list[0].level6 +
                vm.room_list[0].level7 +
                "(" +
                data.value.v_total +
                "条数据)";
            else
              vm.addr =
                vm.GLOBAL.g_addr_serach_params.level2 +
                vm.GLOBAL.g_addr_serach_params.level6 +
                vm.GLOBAL.g_addr_serach_params.level7 +
                "(" +
                data.value.v_total +
                "条数据)";

            if (data.value.v_total > 200) {
              vm.$message.error(
                "搜索出的结果数量太多,请输入更精确的地址,减小搜索范围"
              );
              vm.addr =
                vm.GLOBAL.g_addr_serach_params.level2 +
                vm.GLOBAL.g_addr_serach_params.level6 +
                vm.GLOBAL.g_addr_serach_params.level7 +
                "(" +
                data.value.v_total +
                "条数据,请输入更精确的地址,减小搜索范围)";
              vm.finished = true;
            }

            // if (vm.isArray(data.value)) {

            // } else {
            //   vm.list = [];
            //   vm.list.push(data.value);
            //   //print(vm.list);
            // }

            //vm.Query('');
            vm.activeNames = 0;

            Toast.clear();

            vm.finished = true;
          },
          function(error_data) {
            console.log(error_data);
            Toast.clear();
            vm.$message.error(error_data.message.substring(0, 120));

            vm.finished = true;
          }
        );

        this.loading = false;
      }, 500);
    }
  }
};
</script>

<style scoped>
.van-nav-bar {
  background-color: rgb(50, 134, 202);
}

.van-nav-bar__title {
  color: white;
}
.van-nav-bar__text {
  color: white;
}

.van-nav-bar .van-icon {
  color: white;
}
</style>
