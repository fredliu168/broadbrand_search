// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import $ from "jquery";
import router from "./router";
import { Button } from "vant";
import { Tab, Tabs } from "vant";
import { NavBar } from "vant";
import { Field } from "vant";
import { Picker } from "vant";
import { Popup } from "vant";
import { Search } from "vant";
import { List } from "vant";
import { Cell, CellGroup } from "vant";
import { Panel } from "vant";
import { Row, Col } from "vant";
import { Collapse, CollapseItem } from "vant";
import { Switch } from "vant";
import { SwitchCell } from "vant";
import { Icon } from "vant";
import { Dialog } from "vant";

import global_ from "@/components/Global"; //引用文件
Vue.prototype.GLOBAL = global_; //挂载到Vue实例上面

Vue.use(Icon);
import "vant/lib/icon/local.css";
import "vant/lib/button/style";
import "vant/lib/index.css";
import Utils from "./utils";
import map from "./utils/src/map";

import { Overlay } from "vant";
import { Toast } from "vant";

import { Checkbox, CheckboxGroup } from "vant";
import { RadioGroup, Radio } from "vant";

Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);

Vue.use(Toast);

Vue.use(Overlay);
Vue.use(Dialog);
Vue.use(SwitchCell);
Vue.use(Switch);

Vue.use(Collapse).use(CollapseItem);
Vue.use(Row).use(Col);
Vue.use(Panel);
Vue.use(Cell).use(CellGroup);
Vue.use(List);
Vue.use(Search);
Vue.use(Popup);

Vue.use(Picker);
Vue.use(Field);
Vue.use(NavBar);
Vue.use(Button);
Vue.use(Tab).use(Tabs);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$utils = Utils;
Vue.prototype.$map = map;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>",
  render: h => h(App)
});
