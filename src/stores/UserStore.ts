import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { UserInfo } from '@/types'
import req from '@/utils/request'
import nologinpng from '@/assets/nologin.png'
import adminpng from '@/assets/user.png'
import userpng from '@/assets/panda.png'

export const useUserStore = defineStore('user', () => {
  const welcome = ref('')
  const isShowLoginForm = ref(false)
  const info: UserInfo = reactive({
    user: '',
    email: '',
    role: '',
    avatar: nologinpng,
  })
  let timer: number = 0
  const getWelcome = () => {
    let h = new Date().getHours()
    let w = ''
    if (h > 5 && h <= 12) {
      w = '上午好，'
    } else if (h > 12 && h <= 19) {
      w = '下午好，'
    } else if (h > 19 && h <= 23) {
      w = '晚上好，'
    } else {
      w = '夜深了，'
    }
    welcome.value = w
    timer = setTimeout(
      getWelcome, (60 - new Date().getMinutes()) * 60000)
    getStatus()
  }
  getWelcome()
  timer = setTimeout(
    getWelcome, (60 - new Date().getMinutes()) * 60000
  )
  async function getStatus() {
    try {
      let response = await req.request({
        url: 'auth/status', method: 'get'
      })
      if (response.status == 200) {
        info.user = response.data.user
        info.email = response.data.email
        info.role = response.data.role
        if (info.role === 'Admin') {
          info.avatar = adminpng
        } else if (info.role === 'CommonUser') {
          info.avatar = userpng
        } else {
          info.avatar = nologinpng
        }
      } else {
        info.user = ''
        info.email = ''
        info.role = ''
        info.avatar = nologinpng
      }
    } catch (e) {
      info.user = ''
      info.email = ''
      info.role = ''
      info.avatar = nologinpng
    }
  }
  return { info, welcome, getStatus, isShowLoginForm }
})
