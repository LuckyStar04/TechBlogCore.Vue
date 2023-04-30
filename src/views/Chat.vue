<script lang="ts" setup>
import ChatGPTForm from '@/components/ChatGPTForm.vue'
</script>
<template>
    <ChatGPTForm class="form" />
</template>
<style scoped>
.form {
    height: calc(100vh - 120px);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: var(--el-box-shadow);
    background-color: var(--el-bg-color);
    margin: 1rem;
}

.bg {
    width: 100%;
    height: 100vh;
    background-color: var(--el-bg-color);
    z-index: -20;
}
</style>