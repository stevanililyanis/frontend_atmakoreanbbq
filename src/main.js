import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueRouterUserRoles from "vue-router-user-roles";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://127.0.0.1:8000/api';


Vue.config.productionTip = false
Vue.use(VueRouterUserRoles, { router });

let authenticate;

if(localStorage.getItem('isLogedin')==null ||localStorage.getItem('isLogedin')==0){
    authenticate = Promise.resolve({role:"unauthenticated", isLogedin:false});
}else{
    authenticate = Promise.resolve({role:localStorage.getItem('roleId'), isLogedin:true});
}

authenticate.then(user=>{
  Vue.prototype.$user.set(user);
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})


