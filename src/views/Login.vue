<script lang="ts" setup>
import LoginForm from '@/components/LoginForm.vue'
import WaveBackground from '@/components/WaveBackground.vue'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

onBeforeMount(() => {
    let classes = document.querySelector('body')!.classList
    classes.remove('not-found')
    classes.add('fixed')
    document.querySelector('meta[name="theme-color"]')!.setAttribute("content", "#188dbf")
})

const router = useRouter()
const jumpHome = () => {
    setTimeout(() =>{
        router.push({ name: 'home' })
    }, 1500)
}
</script>
<template>
    <Teleport to="#teleport">
        <WaveBackground><div style="height:65vh;"></div></WaveBackground>
    </Teleport>
    <LoginForm @callback="jumpHome"></LoginForm>
</template>