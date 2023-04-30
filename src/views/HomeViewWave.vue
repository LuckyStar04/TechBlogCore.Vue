<script lang="ts" setup>
import WaveBackground from '@/components/WaveBackground.vue'
import { onBeforeMount } from 'vue'
import OpenAI from '@/icons/OpenAI.vue'

onBeforeMount(() => {
    document.querySelector('meta[name="theme-color"]')!.setAttribute("content", "#188dbf")
})
</script>
<template>
    <Teleport to="#teleport">
        <WaveBackground>
            <div class="inner-header">
                <div class="inner-wrapper">
                    <div class="flex">
                        <div class="logo"><img src="@/assets/logo-white-star.png" /></div>
                        <h1 class="title">Hello,<br />I'm Star.</h1>
                    </div>
                    <p class="intro">Web Developer,<br />major focus on back-end.</p>
                    <div class="navigations">
                        <a class="github" href="https://github.com/LuckyStar04/" target="_blank"><font-awesome-icon
                                icon="fa-brands fa-github" /> Github</a>
                        <RouterLink :to="{ name: 'articles' }"><font-awesome-icon icon="fa-solid fa-book" /> Blog
                        </RouterLink>
                        <RouterLink :to="{ name: 'archived' }"><font-awesome-icon icon="fa-solid fa-box" /> Archived
                        </RouterLink>
                        <RouterLink :to="{ name: 'chat' }"><el-icon><OpenAI/></el-icon> ChatGPT
                        </RouterLink>
                        <RouterLink :to="{ name: 'login' }"><font-awesome-icon icon="fa-solid fa-unlock-keyhole" /> Login
                        </RouterLink>
                    </div>
                </div>
            </div>
        </WaveBackground>
    </Teleport>
</template>
<style scoped>
* {
    user-select: none;
}

p {
    font-family: 'Trebuchet MS';
    letter-spacing: 1px;
    font-size: 14px;
    color: #333333;
}

.logo {
    width: 132px;
    height: 132px;
    padding-right: 10px;
    display: inline-block;
    vertical-align: middle;
    animation: logo-anime .9s cubic-bezier(.46, .14, 0, 1);
}

.logo>img {
    width: 100%;
    transition: transform .9s ease;
}

.logo:hover>img {
    transform: rotateY(180deg);
}

@keyframes logo-anime {
    0% {
        transform: rotateY(-130deg);
    }

    100% {
        transform: rotateY(0deg);
    }
}

@keyframes header-anime {
    from {
        transform: scale(.78);
    }

    to {
        transform: scale(1);
    }
}

.title {
    font-family: 'Trebuchet MS';
    font-weight: 700;
    letter-spacing: 2px;
    font-size: 64px;
    text-align: left;
    padding: 0 30px 0 30px;
    margin: 0;
}

.inner-header {
    height: 65vh;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: header-anime 1.5s ease;
}

.inner-wrapper {
    max-width: 70vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
}

.flex {
    /*Flexbox for containers*/
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.intro {
    color: white;
    text-align: left;
    font-size: 18px;
}

.navigations {
    width: 100%;
    display: flex;
    /* justify-content: space-between; */
    align-items: baseline;
    flex-wrap: wrap;
    margin-left: -8px;
}

.navigations>a {
    color: white;
    background-color: #337ecc;
    padding: 6px 9px;
    margin: 0 0 5px 6px;
    border-radius: 4px;
    text-decoration: none;
    font-family: 'Trebuchet MS', '微软雅黑', Arial, Helvetica, sans-serif;
    font-size: 18px;
    transition: color .3s, background-color .3s;
}

.navigations>a.github {
    background-color: #ecf5ff;
    color: #409eff;
}

.navigations>a>.el-icon {
    transform: translateY(2px);
}

.navigations>a:hover {
    background-color: #ecf5ff;
    color: #409eff;
}

.navigations>a.github:hover {
    background-color: #213d5b;
}

.underlineHover:after {
    display: block;
    left: 0;
    bottom: -10px;
    width: 0;
    height: 2px;
    background-color: #fff;
    content: "";
    transition: width 0.2s;
}

.underlineHover:hover:after {
    width: 100%;
}

@media only screen and (max-width: 768px) {
    .inner-wrapper {
        max-width: 100%;
    }

    .logo {
        width: 86px;
        height: 86px;
        padding-right: 0px;
    }

    .title {
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 38.4px;
    }

    .navigations {
        max-width: 100%;
    }

    .navigations>a {
        font-size: 15px;
        padding: 3px 5px;
        /* margin-right: 4px; */
    }
}
</style>