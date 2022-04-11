import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import ElementUI from "element-ui";
import vcolorpicker from 'vcolorpicker'
import "./assets/icon/iconfont.css";
import $ from 'jquery';
import '../src/utils/jqueryRotate'

Vue.use(ElementUI);
Vue.use(vcolorpicker)
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.$ = $;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

