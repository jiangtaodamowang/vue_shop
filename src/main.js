import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/reset.css'
import MyHttpServer from './plugins/http.js'
import MyBread from './components/myBread/myBread.vue'
import TreeTable from 'vue-table-with-tree-grid'
//全局自定义组件
Vue.component(MyBread.name, MyBread)
Vue.component('tree-table', TreeTable)
Vue.use(MyHttpServer)
Vue.config.productionTip = false

// 日期处理类库
import moment from 'moment'
Vue.filter('fmdate', v => {
  return moment(v).format('YYYY-MM-DD')
})

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//  注册富文本编辑器为全局引用
Vue.use(VueQuillEditor /* { default global options } */)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
