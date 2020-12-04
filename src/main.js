import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import './components/bpmn/assets/css/vue-bmpn.css'


Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  render: h => h(App),
}).$mount('#app')
