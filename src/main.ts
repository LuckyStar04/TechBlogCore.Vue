import { createApp } from 'vue'
import App from './App.vue'
//import ElementPlus from 'element-plus'
//import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "@/assets/marked.css"
import router from './router/index.js'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFaceSmile, faKeyboard } from '@fortawesome/free-regular-svg-icons'
import { faListUl, faAngleDown, faBars, faBox, faBook, faUnlockKeyhole, faXmark, faKeyboard as fsKeyboard } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const app = createApp(App)

library.add(faFaceSmile, faListUl, faAngleDown, faBars, faGithub, faBox, faBook, faUnlockKeyhole, faKeyboard, fsKeyboard, faXmark)

const pinia = createPinia()
app.use(pinia)
app.use(router)
//app.use(ElementPlus, { locale: zhCn })
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
