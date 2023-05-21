<script lang="ts" setup>
import { Document, Key, Avatar } from '@element-plus/icons-vue'
import LoginForm from './LoginForm.vue'
import LoginInfoForm from './LoginInfoForm.vue'
import { useUserStore } from '@/stores/UserStore'
import { ref } from 'vue'
const store = useUserStore()

const toggleLogin = () => store.isShowLoginForm = !store.isShowLoginForm

const hideLogin = () => store.isShowLoginForm = false

const loginSuccess = async () => {
    store.isShowLoginForm = false
    await store.getStatus()
}
const logout = async () => {
    localStorage.removeItem('token')
    await store.getStatus()
}

const isShowInfo = ref(false)

const toggleShowInfo = () => isShowInfo.value = !isShowInfo.value

const hideShowInfo = () =>isShowInfo.value = false
</script>
<template>
    <Teleport to="body">
        <div class="pos-fixed" :class="{ show: store.isShowLoginForm }" @click="hideLogin">
            <LoginForm :use-dark="true" @onSuccess="loginSuccess" :class="{ fadeInDown: store.isShowLoginForm, fadeInUp: !store.isShowLoginForm }"></LoginForm>
        </div>
        <div class="pos-fixed" :class="{ show: isShowInfo }" @click="hideShowInfo">
            <LoginInfoForm @close="toggleShowInfo" :class="{ fadeInDown: isShowInfo, fadeInUp: !isShowInfo }"></LoginInfoForm>
        </div>
    </Teleport>
    <el-popover :width="180"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 5px 5px;">
        <template #reference>
            <img class="avatar" :src="store.info.avatar" />
        </template>
        <template #default>
            <template v-if="!store.info.email">
                <div class="ul">
                    <div class="li welcome">您尚未登录 ^_^</div>
                    <div class="li">
                        <el-button type="primary" round :icon="Key" @click="toggleLogin">去登录</el-button>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="ul">
                    <div class="li welcome">{{ store.welcome }}{{ store.info.user }}</div>
                    <div class="li cur-p" @click="toggleShowInfo"><el-icon><Document /></el-icon> 个人信息</div>
                    <div class="li cur-p" @click="logout"><el-icon><Avatar /></el-icon> 退出登录</div>
                </div>
            </template>
        </template>
    </el-popover>
</template>
<style scoped>

/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
    -webkit-animation-name: fadeInDown;
    animation-name: fadeInDown;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-timing-function: ease;
    animation-timing-function: ease;
}

@-webkit-keyframes fadeInDown {
    0% {
        opacity: 0;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
    }

    100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
    }
}

@keyframes fadeInDown {
    0% {
        opacity: 0;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
    }

    100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
    }
}

.fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-timing-function: ease;
    animation-timing-function: ease;
}

@-webkit-keyframes fadeInUp {
    100% {
        opacity: 0;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
    }

    0% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
    }
}

@keyframes fadeInUp {
    100% {
        opacity: 0;
        -webkit-transform: translate3d(0, -100%, 0);
        transform: translate3d(0, -100%, 0);
    }

    0% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
    }
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--el-color-primary);
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
    visibility: hidden;
    opacity: 0;
    transition: visibility .6s, opacity .6s;
}

.pos-fixed.show {
    visibility: visible;
    opacity: 1;
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

.li :deep(>.el-icon) {
    transform: translateY(2px) scale(1.3);
}

.welcome {
    color: var(--el-text-color-primary);
}

.cur-p {
    cursor: pointer;
}
</style>