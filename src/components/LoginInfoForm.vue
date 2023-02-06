<script lang="ts" setup>
import { useUserStore } from '@/stores/UserStore'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import req from '@/utils/request'

const store = useUserStore()
const emit = defineEmits(['close'])
const data = reactive({
    isLoading: false,
    isChangePswd: false,
    oldPassword: '',
    newPassword1: '',
    newPassword2: '',
})

const changePassword = async () => {
    if (!data.oldPassword) {
        ElMessage.error('请输入旧密码')
        return
    } else if (!data.newPassword1) {
        ElMessage.error('请输入新密码')
        return
    } else if (!data.newPassword2) {
        ElMessage.error('请再次输入新密码')
        return
    } else if (data.newPassword1 !== data.newPassword2) {
        ElMessage.error('两次输入的密码不一致')
        return
    }
    data.isLoading = true
    try {
        let response = await req.request({
            url: 'auth/passwd', method: 'post', data: { oldPassword: data.oldPassword, newPassword: data.newPassword1 }
        })
        if (response.status == 200) {
            data.isLoading = false
            data.oldPassword = data.newPassword1 = data.newPassword2 = ''
            data.isChangePswd = false
            ElMessage.success('修改密码成功。')
        }
    } catch (e: any) {
        data.isLoading = false
        ElMessage.error(`失败：${e.response.data.msg}`)
    }
}
</script>
<template>
    <div class="logininfo-wrapper fadeInDown" v-loading.fullscreen="data.isLoading">
        <div v-if="!data.isChangePswd" class="form" @click.stop>
            <div class="form-title">
                <h3>个人信息</h3>
            </div>
            <div class="form-body">
                <el-form label-width="60px">
                    <el-form-item label="用户名">
                        <el-input v-model="store.info.user" key="user" readonly />
                    </el-form-item>
                    <el-form-item label="Email">
                        <el-input v-model="store.info.email" key="email" readonly />
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-input v-model="store.info.role" key="role" readonly />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="data.isChangePswd=true">修改密码</el-button>
                        <el-button class="close-btn" @click.stop="emit('close')">关闭</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-else class="form" @click.stop>
            <div class="form-title">
                <h3>修改密码</h3>
            </div>
            <div class="form-body">
                <el-form label-width="70px">
                    <el-form-item label="旧密码">
                        <el-input v-model="data.oldPassword" key="old" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="data.newPassword1" key="new1" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="再次输入">
                        <el-input v-model="data.newPassword2" key="new2" type="password" show-password />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="changePassword">保存</el-button>
                        <el-button class="close-btn" @click.stop="data.isChangePswd=false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<style scoped>
.logininfo-wrapper {
    font-family: '黑体', '微软雅黑', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    padding: 20px;
}

.form {
    background-color: var(--el-bg-color);
    border-radius: 10px;
    box-shadow: var(--el-box-shadow-dark);
    overflow: hidden;
}

.form-title {
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 0 2rem;
}

.form-title>h3 {
    font-size: 1.3rem;
    line-height: .8rem;
}

.form-body {
    background-color: var(--el-bg-color-page);
    padding: 1rem 2rem 0;
    overflow: hidden;
}

.fadeInDown {
    -webkit-animation-name: fadeInDown;
    animation-name: fadeInDown;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
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
</style>