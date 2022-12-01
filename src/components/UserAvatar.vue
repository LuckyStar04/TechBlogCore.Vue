<script lang="ts" setup>
import { reactive } from '@vue/reactivity';
import { Document, Key } from '@element-plus/icons-vue'
import LoginForm from './LoginForm.vue'
import req from '@/utils/request'
import type { UserInfo } from '@/types'
import { computed, onBeforeUnmount } from 'vue'
import nologinpng from '@/assets/nologin.png'
import adminpng from '@/assets/user.png'
import userpng from '@/assets/panda.png'
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
    data.welcome = w
    timer = setTimeout(
        getWelcome, (60 - new Date().getMinutes()) * 60000)
}
timer = setTimeout(
    getWelcome, (60 - new Date().getMinutes()) * 60000)

onBeforeUnmount(() => {
    clearTimeout(timer)
})

const data = reactive({
    info: {
        user: '',
        email: '',
        role: ''
    } as UserInfo,
    welcome: '',
    showLoginForm: false,
    avatar: '',
})
getWelcome()

const welcome = computed(() => {
    return data.welcome + data.info.user
})

const toggleLogin = () => {
    data.showLoginForm = !data.showLoginForm
}

const getStatus = async () => {
    try {
        let response = await req.request({
            url: 'auth/status', method: 'get'
        })
        if (response.status == 200) {
            data.info.user = response.data.user
            data.info.email = response.data.email
            data.info.role = response.data.role
            if (data.info.role === 'Admin') {
                data.avatar = adminpng
            } else if (data.info.role === 'CommonUser') {
                data.avatar = userpng
            } else {
                data.avatar = nologinpng
            }
        } else {
            data.info.user = ''
            data.info.email = ''
            data.info.role = ''
            data.avatar = nologinpng
        }
    } catch (e) {
        data.info.user = ''
        data.info.email = ''
        data.info.role = ''
        data.avatar = nologinpng
    }
}
getStatus()
const loginSuccess = async () => {
    data.showLoginForm = false
    await getStatus()
}
const logout = async () => {
    localStorage.removeItem('token')
    await getStatus()
}
</script>
<template>
    <Teleport to="body">
        <div class="pos-fixed" v-show="data.showLoginForm" @click="toggleLogin">
            <LoginForm @callback="loginSuccess"></LoginForm>
        </div>
    </Teleport>
    <el-popover :width="180"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 5px 5px;">
        <template #reference>
            <img class="avatar" :src="data.avatar" />
        </template>
        <template #default>
            <template v-if="!data.info.email">
                <div class="ul">
                    <div class="li welcome">您尚未登录 ^_^</div>
                    <div class="li">
                        <el-button type="primary" round :icon="Key" @click="toggleLogin">去登录</el-button>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="ul">
                    <div class="li welcome">{{ welcome }}</div>
                    <div class="li cur-p"><el-icon>
                            <Document />
                        </el-icon> 个人信息</div>
                    <div class="li cur-p" @click="logout"><el-icon>
                            <Key />
                        </el-icon> 退出登录</div>
                </div>
            </template>
        </template>
    </el-popover>
</template>
<style scoped>
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--el-border-color);
}

.pos-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
}

.ul {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
}

.li {
    padding: .4rem 0;
    color: var(--el-text-color-secondary);
    font-family: var(--el-font-family);
}

.welcome {
    color: var(--el-text-color-primary);
}

.cur-p {
    cursor: pointer;
}
</style>