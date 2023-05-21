<script lang="ts" setup>
import { useUserStore } from '@/stores/UserStore'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import req from '@/utils/request'

const store = useUserStore()
const emit = defineEmits(['close'])
const formRef = ref<FormInstance>()

const data = reactive({
    isLoading: false,
    isChangePswd: false,
    old: '',
    new1: '',
    new2: '',
})

const validateNew1 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入新密码'))
    } else {
        callback()
    }
}
const validateNew2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入新密码'))
    } else if (value !== data.new1) {
        callback(new Error("两次密码不一致！"))
    } else {
        callback()
    }
}

const rules = reactive<FormRules>({
    old: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    new1: [{ required: true, validator: validateNew1, trigger: 'blur' }],
    new2: [{ required: true, validator: validateNew2, trigger: 'blur' }],
})

const submitPassword = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        if (!valid) {
            if (fields) {
                for (let key in fields) {
                    ElMessage.error(fields[key][0].message)
                }
            }
            return false
        }

        data.isLoading = true
        try {
            let response = await req.request({
                url: 'auth/passwd', method: 'post', data: { oldPassword: data.old, newPassword: data.new1 }
            })
            if (response.status == 200) {
                data.isLoading = false
                close()
                ElMessage.success('修改密码成功。')
            }
        } catch (e: any) {
            data.isLoading = false
            ElMessage.error(`失败：${e.response.data.msg}`)
        }
    })
}

const close = () => {
    reset()
    emit('close')
}

const reset = () => {
    data.isChangePswd = false
    formRef.value?.resetFields()
}
</script>
<template>
    <div class="logininfo-wrapper" v-loading.fullscreen="data.isLoading" @click="close">
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
                        <el-button type="primary" @click.stop="data.isChangePswd = true">修改密码</el-button>
                        <el-button class="close-btn" @click.stop="close">关闭</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div v-else class="form" @click.stop>
            <div class="form-title">
                <h3>修改密码</h3>
            </div>
            <div class="form-body">
                <el-form :model="data" :rules="rules" label-width="82px" ref="formRef">
                    <el-form-item label="旧密码" prop="old">
                        <el-input v-model="data.old" key="old" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="新密码" prop="new1">
                        <el-input v-model="data.new1" key="new1" type="password" show-password />
                    </el-form-item>
                    <el-form-item label="再次输入" prop="new2">
                        <el-input v-model="data.new2" key="new2" type="password" show-password />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="submitPassword(formRef)">保存修改</el-button>
                        <el-button class="close-btn" @click.stop="reset">取消</el-button>
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
    background-color: var(--bg-color-chat-primary);
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
    background-color: var(--bg-color-secondary);
    padding: 1rem 2rem 0;
    overflow: hidden;
}
</style>