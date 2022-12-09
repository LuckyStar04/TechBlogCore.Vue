<script lang="ts" setup>
import { Document, Key } from '@element-plus/icons-vue'
import LoginForm from './LoginForm.vue'
import { useUserStore } from '@/stores/UserStore'
const store = useUserStore()

const toggleLogin = () => {
    store.isShowLoginForm = !store.isShowLoginForm
}

const loginSuccess = async () => {
    store.isShowLoginForm = false
    await store.getStatus()
}
const logout = async () => {
    localStorage.removeItem('token')
    await store.getStatus()
}
</script>
<template>
    <Teleport to="body">
        <div class="pos-fixed" v-show="store.isShowLoginForm" @click="toggleLogin">
            <LoginForm @callback="loginSuccess"></LoginForm>
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