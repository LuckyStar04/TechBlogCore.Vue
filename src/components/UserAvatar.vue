<script lang="ts" setup>
import { reactive } from '@vue/reactivity';
import { Key } from '@element-plus/icons-vue'
import LoginForm from './LoginForm.vue';

const data = reactive({
    user: '',
    email: '',
    role: '',
    showLoginForm: false
})

const toggleLogin = () => {
    data.showLoginForm = !data.showLoginForm
}
</script>
<template>
    <Teleport to="body">
        <div class="pos-fixed" v-show="data.showLoginForm" @click="toggleLogin">
            <LoginForm></LoginForm>
        </div>
    </Teleport>
    <el-popover :width="160"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 10px;">
        <template #reference>
            <img class="avatar" src="/src/assets/nologin.png" />
        </template>
        <template #default>
            <template v-if="!data.email">
                <p>您尚未登录，</p>
                <el-button type="primary" round :icon="Key" @click="toggleLogin">去登录</el-button>
            </template>
        </template>
    </el-popover>
</template>
<style scoped>
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid white;
    outline: 1px solid var(--el-border-color);
}

.pos-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2099;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>