<script lang="ts" setup>
import LoginForm from '@/components/LoginForm.vue'
import WaveBackground from '@/components/WaveBackground.vue'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

onBeforeMount(() => {
    document.title = "登录 - Star's Blog"
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
    <LoginForm :use-dark="false" @onSuccess="jumpHome" class="fadeInDown"></LoginForm>
</template>
<style scoped>
.fadeInDown {
    -webkit-animation-name: fadeInDown;
    animation-name: fadeInDown;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-timing-function: ease;
    animation-timing-function: ease;
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