import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/reset.css'
import MyHttpServer from './plugins/http.js'
import MyBread from './components/myBread/myBread.vue'
//全局自定义组件
Vue.component(MyBread.name,MyBread)
Vue.use(MyHttpServer)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
