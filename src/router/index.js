import Vue from "vue";
import Router from "vue-router";
import index from "@/components/index";
import addrinfo from "@/components/addrinfo";
import boxmap from "@/components/boxmap";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: index
    },
    {
      path: "/addrinfo",
      name: "addrinfo",
      component: addrinfo
    },
    {
      path: "/boxmap/:res_id/:lat/:lng/:box_name/:addr",
      name: "boxmap",
      component: boxmap
    }
  ]
});
