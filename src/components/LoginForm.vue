<template>
    <div class="loginform-wrapper" :class="{ dark: useDark }" v-loading.fullscreen="data.isLoading">
        <div id="formContent" @click.stop>
            <template v-if="data.login">
                <h2 class="active"> 登&nbsp;&nbsp;录 </h2>
                <h2 class="inactive underlineHover" @click="data.login = false">注&nbsp;&nbsp;册 </h2>

                <div class=" logo fadeIn first">
                    <img src="@/assets/logo.svg" id="icon" alt="favicon" />
                </div>

                <form method="post">
                    <input type="text" id="login" class="fadeIn second" name="username" v-model="data.username"
                        placeholder="请输入用户名" autocomplete="off" maxlength="50">
                    <input type="password" id="password" class="fadeIn third" name="password" v-model="data.password"
                        placeholder="请输入密码" maxlength="50">
                    <input type="submit" class="fadeIn fourth" value="立即登录" @click.prevent="login">
                </form>
            </template>
            <template v-else>
                <h2 class="inactive underlineHover" @click="data.login = true"> 登&nbsp;&nbsp;录 </h2>
                <h2 class="active">注&nbsp;&nbsp;册 </h2>

                <div class=" logo fadeIn first">
                    <img src="@/assets/logo.svg" id="icon" alt="favicon" />
                </div>

                <form>
                    <input type="text" id="email" class="fadeIn second" name="email" v-model="data.email"
                        placeholder="输入注册邮箱" autocomplete="off" maxlength="50">
                    <input type="text" id="login" class="fadeIn second" name="username" v-model="data.username"
                        placeholder="输入用户名" autocomplete="off" maxlength="50">
                    <input type="password" id="password" class="fadeIn third" name="password" v-model="data.password"
                        placeholder="输入注册密码" maxlength="50">
                    <input type="password" id="password2" class="fadeIn third" name="password2" v-model="data.password2"
                        placeholder="再次输入密码" maxlength="50">
                    <input type="submit" class="fadeIn fourth" value="立即注册" @click.prevent="register">
                </form>
            </template>

            <div id="formFooter">
                <a class="underlineHover" href="#">忘记密码 ?</a>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from '@vue/reactivity'
import { ElMessage, ElMessageBox } from 'element-plus'
import req from '@/utils/request'

const props = defineProps({
    useDark: {
        type: Boolean,
        default: false,
        required: true,
    }
})
const emit = defineEmits(['onSuccess'])

const data = reactive({
    login: true,
    username: '',
    password: '',
    password2: '',
    email: '',
    isLoading: false,
})

const login = async () => {
    if (data.username.trim().length == 0) {
        ElMessageBox.alert('请输入用户名', '登录错误', { confirmButtonText: '好的' })
        return
    } else if (!data.password) {
        ElMessageBox.alert('请输入密码', '登录错误', { confirmButtonText: '好的' })
        return
    }
    data.isLoading = true
    try {
        let response = await req.request({
            url: 'auth/login', method: 'post', data: { username: data.username, password: data.password }
        })
        if (response.status == 200) {
            localStorage.setItem('token', 'Bearer ' + response.data.data)
            data.isLoading = false
            data.username = ''
            data.password = ''
            data.password2 = ''
            data.email = ''
            ElMessage({ message: '登录成功', type: 'success', duration: 1500, onClose: () => emit('onSuccess') })
        }
    }
    catch (e: any) {
        data.isLoading = false
        ElMessage({ message: `登录失败：${e.response.data.msg}`, type: 'error' })
    }
}

const register = async () => {
    if (data.email.trim().length == 0) {
        ElMessageBox.alert('请输入邮箱', '错误', { confirmButtonText: '好的' })
        return
    }else if (data.username.trim().length == 0) {
        ElMessageBox.alert('请输入用户名', '错误', { confirmButtonText: '好的' })
        return
    } else if (!data.password) {
        ElMessageBox.alert('请输入密码', '错误', { confirmButtonText: '好的' })
        return
    } else if (data.password != data.password2) {
        ElMessageBox.alert('两次输入的密码不一致', '错误', { confirmButtonText: '好的' })
        return
    }
    data.isLoading = true
    try {
        let response = await req.request({
            url: 'auth/register', method: 'post', data: { email: data.email, username: data.username, password: data.password }
        })
        if (response.status == 200) {
            localStorage.setItem('token', 'Bearer ' + response.data.data)
            data.isLoading = false
            ElMessage({ message: '注册成功', type: 'success', duration: 4000 })
            emit('onSuccess')
        }
    }
    catch (e: any) {
        data.isLoading = false
        ElMessage({ message: `注册失败：${e.response.data.msg}`, type: 'error' })
    }
}
</script>
<style scoped>
/* BASIC */

/* html {
  background-color: #56baed;
} */

.loginform-wrapper {
    font-family: '黑体', '微软雅黑', 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    padding: 20px;
}

.loginform-wrapper.dark #formContent {
    background-color: var(--bg-color-login-primary);
    box-shadow: var(--login-shadow);
}

.loginform-wrapper.dark #formFooter {
    background-color: var(--bg-color-secondary);
    border-top: 1px solid var(--border-color-secondary);
}

input {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}

a {
    color: #92badd;
    display: inline-block;
    text-decoration: none;
    font-weight: 400;
}

h2 {
    text-align: center;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    display: inline-block;
    margin: 40px 8px 10px 8px;
    color: #cccccc;
}



/* STRUCTURE */

.logo {
    width: 10rem;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo,
#icon {
    margin: auto;
}

#formContent {
    -webkit-border-radius: 10px 10px 10px 10px;
    border-radius: 10px 10px 10px 10px;
    background: #fff;
    padding: 30px;
    width: 90%;
    max-width: 450px;
    position: relative;
    padding: 0px;
    -webkit-box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
    text-align: center;
}

#formFooter {
    background-color: #f6f6f6;
    border-top: 1px solid #dce8f1;
    padding: 25px;
    text-align: center;
    -webkit-border-radius: 0 0 10px 10px;
    border-radius: 0 0 10px 10px;
}



/* TABS */

h2.inactive {
    color: #cccccc;
}

h2.active {
    color: #0d0d0d;
    border-bottom: 2px solid #5fbae9;
}

.loginform-wrapper.dark h2.active {
    color: var(--el-text-color-primary);
}

.loginform-wrapper.dark h2.inactive {
    color: var(--el-text-color-placeholder);
}



/* FORM TYPOGRAPHY*/

input[type=button],
input[type=submit],
input[type=reset] {
    background-color: #56baed;
    border: none;
    color: white;
    width: 84%;
    padding: 15px 80px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: .4rem;
    -webkit-box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
    box-shadow: 0 10px 30px 0 rgba(95, 186, 233, 0.4);
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
    margin: 5px 20px 40px 20px;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
}

input[type=button]:hover,
input[type=submit]:hover,
input[type=reset]:hover {
    background-color: #39ace7;
}

input[type=button]:active,
input[type=submit]:active,
input[type=reset]:active {
    -moz-transform: scale(0.95);
    -webkit-transform: scale(0.95);
    -o-transform: scale(0.95);
    -ms-transform: scale(0.95);
    transform: scale(0.95);
}

input[type=text],
input[type=password] {
    background-color: #f6f6f6;
    border: none;
    color: #0d0d0d;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 5px;
    width: 85%;
    border: 2px solid #f6f6f6;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    -webkit-border-radius: 5px 5px 5px 5px;
    border-radius: 5px 5px 5px 5px;
}

.loginform-wrapper.dark input[type=text],
.loginform-wrapper.dark input[type=password] {
    background-color: var(--bg-color-secondary);
    border: 2px solid var(--bg-color-secondary);
    color: var(--el-text-color-primary);
}

.loginform-wrapper.dark input[type=text]:focus,
.loginform-wrapper.dark input[type=password]:focus {
    border-bottom: 2px solid #5fbae9;
}

input[type=text]:focus,
input[type=password]:focus {
    background-color: #fff;
    border-bottom: 2px solid #5fbae9;
}

input[type=text]:placeholder,
input[type=password]:placeholder {
    color: #cccccc;
}



/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@-moz-keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.fadeIn {
    opacity: 0;
    -webkit-animation: fadeIn ease-in 1;
    -moz-animation: fadeIn ease-in 1;
    animation: fadeIn ease-in 1;

    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    animation-fill-mode: forwards;

    -webkit-animation-duration: 1s;
    -moz-animation-duration: 1s;
    animation-duration: 1s;
}

.fadeIn.first {
    -webkit-animation-delay: 0.05s;
    -moz-animation-delay: 0.05s;
    animation-delay: 0.05s;
}

.fadeIn.second {
    -webkit-animation-delay: 0.15s;
    -moz-animation-delay: 0.15s;
    animation-delay: 0.15s;
}

.fadeIn.third {
    -webkit-animation-delay: 0.25s;
    -moz-animation-delay: 0.25s;
    animation-delay: 0.25s;
}

.fadeIn.fourth {
    -webkit-animation-delay: .35s;
    -moz-animation-delay: .35s;
    animation-delay: .35s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
    display: block;
    left: 0;
    bottom: -10px;
    width: 0;
    height: 2px;
    background-color: #56baed;
    content: "";
    transition: width 0.2s;
}

.underlineHover:hover {
    color: #0d0d0d;
}

.loginform-wrapper.dark .underlineHover:hover {
    color: var(--el-text-color-primary);
}

.underlineHover:hover:after {
    width: 100%;
}



/* OTHERS */

*:focus {
    outline: none;
}

#icon {
    width: 60%;
}

* {
    box-sizing: border-box;
}
</style>