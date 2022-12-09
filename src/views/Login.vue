<template>
    <Teleport to="body">
        <div class="bg-wrapper">
            <StarryBackground></StarryBackground>
        </div>
    </Teleport>
    <link href="/src/assets/login.css" rel="stylesheet" type="text/css" />
    <LoginForm @callback="jumpHome"></LoginForm>
</template>
<script lang="ts" setup>
import LoginForm from '@/components/LoginForm.vue'
import StarryBackground from '@/components/StarryBackground.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
    document.querySelector('meta[name="theme-color"]')!.setAttribute("content", "#16161e")
})

const router = useRouter()
const jumpHome = () => {
    setTimeout(() =>{
        router.push({ name: 'home' })
    }, 1500)
}
</script>
<style>
.bg-wrapper {
  z-index: -999;
  position: fixed;
  top: 0;
  left: 0;
}
</style>