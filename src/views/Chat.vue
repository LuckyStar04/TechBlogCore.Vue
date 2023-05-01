<script lang="ts" setup>
import ChatGPTForm from '@/components/ChatGPTForm.vue'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const documentHeight = () => {
    document.documentElement
            .style.setProperty('--doc-height', `${window.innerHeight}px`)
}

onMounted(() => {
    window.addEventListener('resize', documentHeight)
    documentHeight()
})

onUnmounted(() => {
    window.removeEventListener('resize', documentHeight)
})
</script>
<template>
    <ChatGPTForm class="form" @close="router.back()" />
</template>
<style scoped>
.form {
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: var(--el-box-shadow);
    background-color: var(--bg-color-chat-primary);
    margin: 0;
    height: 100vh;
    height: var(--doc-height);
}
</style>