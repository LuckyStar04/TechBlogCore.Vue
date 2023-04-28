<script lang="ts" setup>
import { reactive } from 'vue'
import ChatGPTForm from './ChatGPTForm.vue'
import OpenAI from '@/icons/OpenAI.vue'
import { Close } from '@element-plus/icons-vue'

const data = reactive({
    showForm: false,
})
</script>
<template>
    <div class="form-wrapper" :class="{ show: data.showForm }">
        <ChatGPTForm v-show="data.showForm"></ChatGPTForm>
        <div v-show="!data.showForm" @click="data.showForm = true" class="openai">
            <el-icon size="2.4rem" color="var(--el-text-color-primary)"><OpenAI/></el-icon>
        </div>
        <el-icon v-if="data.showForm" class="close-icon" @click="data.showForm = false"><Close /></el-icon>
    </div>
</template>
<style scoped>
.form-wrapper {
    position: fixed;
    right: 3rem;
    bottom: 3rem;
    width: 3rem;
    height: 3rem;
    transition: width .5s ease, height .5s ease;
    background-color: var(--el-bg-color);
    border-radius: 1rem;
    z-index: 998;
    box-shadow: var(--el-box-shadow-light);
    overflow: hidden;
}

.openai {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.openai>.el-icon {
    /* transform: rotate(0deg); */
    /* transition: transform .6s ease; */
    animation: roll .5s ease-out forwards;
}

.openai>.el-icon:hover {
    /* transform: rotate(-180deg); */
    animation: roll2 .5s ease-out forwards;
}

@keyframes roll {
    25% { transform: rotate(30deg) scale(.9); }
    50% { transform: rotate(0) scale(1); }
    75% { transform: rotate(-30deg) scale(1); }
    100% { transform: rotate(0) scale(1); }
}

@keyframes roll2 {
    25% { transform: rotate(30deg) scale(1.1); }
    50% { transform: rotate(0) scale(1); }
    75% { transform: rotate(-30deg) scale(1); }
    100% { transform: rotate(0) scale(1); }
}

.form-wrapper.show {
    width: 20rem;
    height: 35rem;
}

.close-icon {
    position: absolute;
    top: 1.4rem;
    right: 1rem;
    cursor: pointer;
}
</style>