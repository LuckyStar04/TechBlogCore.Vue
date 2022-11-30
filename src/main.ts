import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "/src/assets/marked.css"
import router from './router/index.js'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, { locale: zhCn })

app.mount('#app')
