import { createApp } from 'vue'
import App from './App.vue'
// 引入 pinia
import { createPinia } from 'pinia'
// 创建 pinia 实例
const pinia = createPinia();
// 引入路由
import router from './router/index'
// 引入element-plus
import ElementPlus from 'element-plus'
// 全局css
import "animate.css";
import 'element-plus/dist/index.css'

// 全局字体
import './assets/font.less'

createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app')


