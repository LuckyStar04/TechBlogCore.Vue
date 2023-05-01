<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import ChatGPTForm from './ChatGPTForm.vue'
import OpenAI from '@/icons/OpenAI.vue'

const form = ref<HTMLElement|null>(null)

const data = reactive({
    showForm: false,
    prev_x: -1,
    prev_y: -1,
})

const open = async () => {
    data.showForm = true
    await nextTick()
    setTimeout(() => form.value!.style.transition = 'none', 500)
}

const close = () => {
    form.value!.style.width = ''
    form.value!.style.height = ''
    data.showForm = false
    form.value!.style.transition = 'width .4s ease, height .4s ease'
}
</script>
<template>
    <div class="form-wrapper" ref="form" :class="{ show: data.showForm }">
        <div class="inside-wrapper">
            <ChatGPTForm v-show="data.showForm" @close="close"></ChatGPTForm>
            <div v-if="!data.showForm" @click="open" class="openai">
                <el-icon size="2.8rem" color="var(--el-text-color-primary)">
                    <OpenAI />
                </el-icon>
            </div>
        </div>
    </div>
</template>
<style scoped>
.form-wrapper {
    position: fixed;
    right: 1.1rem;
    bottom: 1.1rem;
    width: 3.6rem;
    height: 3.6rem;
    background-color: var(--bg-color-chat-primary);
    border-radius: 1rem;
    z-index: 998;
    overflow: hidden;
    box-shadow: var(--content-shadow-high-rev);
    transition: width .4s ease, height .4s ease;
    transform: rotateZ(180deg);
}

.form-wrapper.show {
    resize: both;
    width: 32rem;
    height: 50rem;
    max-width: 91vw;
    max-height: 91vh;
}

.inside-wrapper {
    width: 100%;
    height: 100%;
    transform: rotateZ(180deg);
}

.openai {
    width: 3.6rem;
    height: 3.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.openai>.el-icon {
    animation: roll .5s ease-out forwards;
}

.openai>.el-icon:hover {
    animation: roll2 .5s ease-out forwards;
}

@keyframes roll {
    25% {
        transform: rotate(30deg) scale(.9);
    }

    50% {
        transform: rotate(0) scale(1);
    }

    75% {
        transform: rotate(-30deg) scale(1);
    }

    100% {
        transform: rotate(0) scale(1);
    }
}

@keyframes roll2 {
    25% {
        transform: rotate(30deg) scale(1.1);
    }

    50% {
        transform: rotate(0) scale(1);
    }

    75% {
        transform: rotate(-30deg) scale(1);
    }

    100% {
        transform: rotate(0) scale(1);
    }
}

@media only screen and (max-width: 768px) {
    .form-wrapper.show {
        width: 91vw;
        height: 91vh;
    }
}
</style>