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
import { useRouter } from 'vue-router'

const router = useRouter()
const jumpHome = () => {
    router.push({ name: 'home' })
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