<template>
  <div>
    <div class="nav">
      <van-nav-bar title="周边资源" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
    <van-row style="height:300px;width:100%;">
      <van-col span="24">
        <div id="map" style="position: fixed;height:250px;top:45px;"></div>
      </van-col>
    </van-row>
    <van-row>
      <van-cell-group>
        <van-cell style="text-align: left;" title="精确覆盖箱体" :label="addr" />
      </van-cell-group>
    </van-row>
    <van-row>
      <van-collapse style="text-align: left;" v-model="activeNames" accordion>
        <van-collapse-item :title="box_name" :name="box_name" icon="location-o">
          <van-cell-group v-for="(item_dev, dev_index) in cur_devs" :key="dev_index">
            <van-cell :value="item_dev.devname" />

            <van-cell
              title="剩余端口/总端口:"
              v-if="item_dev.total_portnum !== ''"
              :value="item_dev.port_num+'/'+item_dev.total_portnum"
            />
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </van-row>

    <van-row type="flex" justify="left">
      <van-cell style="text-align: left;" title="周边箱体(100米范围)"></van-cell>
    </van-row>
    <van-row>
      <van-list :finished="finished" finished-text="没有更多了">
        <van-collapse
          style="text-align: left;"
          @change="change($event)"
          v-model="activeNames"
          accordion
        >
          <van-collapse-item
            icon="location-o"
            v-for="(item, index) in list_boxs"
            v-if="item.box_name !== box_name"
            :key="index"
            :title="
              item.box_name + '(' + Math.round(item.distance * 10) / 10 + '米)'
            "
            :name="item.box_num"
          >
            <van-cell-group v-for="(item_dev, dev_index) in list_devs" :key="dev_index">
              <van-cell :value="item_dev.devname" />
              <van-cell
                title="剩余端口/总端口:"
                v-if="item_dev.total_portnum !== ''"
                :value="item_dev.port_num+'/'+item_dev.total_portnum"
              />
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>
      </van-list>
    </van-row>
  </div>
</template>

<script>
import $request from '@/../static/js/ajax-helper.js'
import coordtransform from 'coordtransform'
export default {
  data() {
    return {
      url_query_box:
        '/' + this.GLOBAL.api + '/pkg_broadband_search_get_distance_box',
      url_query_dev: '/' + this.GLOBAL.api + '/getBoxDevNameByID',
      list_boxs: [],
      list_devs: [],
      cur_devs: [],
      finished: false,
      activeNames: '',
      menuHeight: 0,
      bottomHeight: 2,
      bottomCellHeight: 500,
      topCellHeight: 45,
      icon_gray: L.icon({
        iconUrl: '@/../static/images/gray.png',
        iconSize: [18, 12],
        iconAnchor: [9, 6]
      }),
      icon_box: L.icon({
        iconUrl: '@/../static/images/mass1.png',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      }),
      icon_box_gl: L.icon({
        iconUrl: '@/../static/images/mass0.png',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      }),
      icon_marker: L.icon({
        iconUrl: '@/../static/images/marker.png',
        iconSize: [50, 80]
      }),
      icon_marker2: L.icon({
        iconUrl: '@/../static/images/marker2.png',
        iconSize: [50, 80]
      }),
      icon_blue: L.icon({
        iconUrl: '@/../static/images/blue.png',
        iconSize: [18, 12],
        iconAnchor: [9, 6]
      }),
      icon_blue2: L.icon({
        iconUrl: '@/../static/images/blue2.png',
        iconSize: [18, 12],
        iconAnchor: [9, 6]
      }),
      icon_yellow: L.icon({
        iconUrl: '@/../static/images/yellow.png',
        iconSize: [18, 12],
        iconAnchor: [9, 6]
      }),
      icon_dp: L.icon({
        iconUrl: '@/../static/images/dp.png',
        iconSize: [18, 19],
        iconAnchor: [9, 9]
      }),
      icon_fp: L.icon({
        iconUrl: '@/../static/images/fp.png',
        iconSize: [19, 19],
        iconAnchor: [9, 9]
      }),
      icon_jz: L.icon({
        iconUrl: '@/../static/images/jz3.png',
        iconSize: [19, 19],
        iconAnchor: [9, 9]
      }),
      marker: null,
      marker2: null,
      circle: null,
      latlng: null,
      boxCiLayer: null,
      markers: [],
      lat: 24.908853,
      lng: 118.589421,
      box_name: '',
      addr: ''
    }
  },
  mounted() {
    let self = this
    this.lat = this.$route.params.lat
    this.lng = this.$route.params.lng
    var res_id = this.$route.params.res_id
    this.box_name = decodeURIComponent(this.$route.params.box_name)
    this.addr = decodeURIComponent(this.$route.params.addr)

    self.currentboxs(res_id)
    self.initMap()
    self.loadData()
  },
  methods: {
    currentboxs(box_num) {
      //当前箱体信息
      var vm = this
      var data_json = {
        os: 4,
        parameters: {
          boxid: box_num
        }
      }
      $request.post(vm.url_query_dev, data_json, function(data) {
        vm.cur_devs = data.value
      })
    },

    onClickLeft() {
      //this.$router.push({ path: '/' })
      this.$router.go(-1)
    },
    onAccuratePositionProgress(e) {
      console.log(e.accuracy)
      console.log(e.latlng)
    },
    onAccuratePositionFound(e) {
      console.log(e.accuracy)
      console.log(e.latlng)
      let self = this
      let itemLatlng = coordtransform.wgs84togcj02(e.latlng.lng, e.latlng.lat)
      self.latlng = L.latLng(itemLatlng[1], itemLatlng[0])
      self.initLatlng()
      self.overlayShow = false
    },
    onAccuratePositionError(e) {
      console.log(e.message)
      let self = this
      self.latlng = L.latLng(self.lat, self.lng)
      self.initLatlng()
      self.$toast('获取定位信息失败！')
      self.overlayShow = false
    },
    initLatlng() {
      let self = this
      self.marker = L.marker(self.latlng, {
        // draggable: true,
        icon: self.icon_marker
      })
      // self.circle = L.circle(self.latlng, { radius: self.sliderVal })
      // self.circle.on('click', self.circleclick)
      // self.getData(self.latlng)
      // self.marker.addTo(self.map)
      // self.map.setZoomAndCenter(this.latlng, 18)
    },

    initMap() {
      let self = this
      this.map = this.$map.createMap('map', { zoom: 18 })

      this.map.on('zoomend  ', function() {
        let zoom = self.map.getZoom()
        self.zoom = zoom
      })
      // this.map.on('accuratepositionprogress', this.onAccuratePositionProgress)
      // this.map.on('accuratepositionfound', this.onAccuratePositionFound)
      // this.map.on('accuratepositionerror', this.onAccuratePositionError)

      this.map.findAccuratePosition({
        maxWait: 5000, // defaults to 10000
        desiredAccuracy: 30 // defaults to 20
      })

      // var lat = 24.897717890809623,
      //   lon = 118.55265801611338

      self.latlng = L.latLng([self.lat, self.lng])
      //this.initLatlng2(this.latlng)

      self.marker2 = L.marker(self.latlng, {
        icon: self.icon_marker2
      })
      self.marker2.addTo(self.map)

      // this.circle.setLatLng(this.latlng);
      // this.marker.setLatLng(this.latlng);
      this.map.panTo(this.latlng, { noMoveStart: true, animate: false })
    },

    change(event) {
      // console.log(this.activeNames);

      if (event != '') {
        console.log(event)
        this.rowClick(event)
      }
    },
    rowClick(box_num) {
      //url_query_dev
      var vm = this
      var data_json = {
        os: 4,
        parameters: {
          boxid: box_num
        }
      }

      $request.post(vm.url_query_dev, data_json, function(data) {
        console.log(data)
        vm.list_devs = data.value
      })
    },
    loadData() {
      //加载数据self.lat, self.lng
      var vm = this
      var data_json = {
        os: 4,
        parameters: {
          lat: vm.lat,
          lon: vm.lng,
          v_in_pagenow: '1',
          v_in_pagesize: '100'
        }
      }

      $request.post(vm.url_query_box, data_json, function(data) {
        console.log(data)
        vm.list_boxs = data.value.cur_out
        vm.finished = true
        vm.addMarker(vm.list_boxs)
      })
    },
    addMarker(data) {
      let self = this
      data.forEach(function(item) {
        let marker

        let latlng = L.latLng(item.latitude, item.longitude)
        let distance = latlng.distanceTo(self.latlng)
        item.distance = Math.round(item.distance * 10) / 10

        marker = L.marker(latlng, { icon: self.icon_box_gl })
        marker.bindPopup(item.box_name + '(' + item.distance + '米)')
        marker.on('click', function(e) {
          self.showAddressList = true
          self.addressLatLng = latlng
        })

        marker.data = item
        self.markers.push(marker)
      })
      //self.dataList = this.markers
      //self.dataList.sort(self.sortDistance)
      self.layerGroup = L.layerGroup(this.markers).addTo(self.map)
    }
  }
}
</script>

<style scoped>
.van-nav-bar {
  position: fixed;
  width: 100%;
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
#boxs {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 900;
}

#map {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 900;
}

#top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* z-index: 998; */
}

#bottomDiv {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  /* z-index: 998; */
}

#bottomCell {
  position: fixed;
  left: 0;
  right: 0;
  /* z-index: 997; */
}

#topCell {
  position: fixed;
  left: 0;
  right: 0;
  /* z-index: 997; */
}
</style>
