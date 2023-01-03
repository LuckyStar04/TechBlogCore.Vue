<script lang="ts" setup>
import WaveBackground from '@/components/WaveBackground.vue'
</script>
<template>
    <Teleport to="#teleport">
        <WaveBackground>
            <div class="inner-header">
                <div class="flex">
                    <div class="logo"><img src="@/assets/logo-white.png" /></div>
                    <h1 class="title">BlogCore.Vue</h1>
                </div>
                <div class="navigations">
                    <RouterLink class="underlineHover" :to="{ name: 'login' }">登&nbsp;&nbsp;&nbsp;录</RouterLink>
                    <RouterLink class="underlineHover" :to="{ name: 'articles' }">文&nbsp;&nbsp;&nbsp;章</RouterLink>
                    <RouterLink class="underlineHover" :to="{ name: 'archived' }">归&nbsp;&nbsp;&nbsp;档</RouterLink>
                    <a href="https://github.com/LuckyStar04/TechBlogCore.Vue" target="_blank">Github</a>
                </div>
            </div>
        </WaveBackground>
    </Teleport>
</template>
<style scoped>
p {
    font-family: 'Trebuchet MS';
    letter-spacing: 1px;
    font-size: 14px;
    color: #333333;
}

.logo {
    width: 120px;
    height: 120px;
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
    font-weight: 600;
    letter-spacing: 2px;
    font-size: 96px;
}

.inner-header {
    height: 65vh;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: header-anime 1.5s ease;
}

.flex {
    /*Flexbox for containers*/
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.navigations {
    width: 720px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

.navigations>a {
    color: white;
    text-decoration: none;
    font-family: 'Trebuchet MS', '微软雅黑', Arial, Helvetica, sans-serif;
    font-size: 24px;
    transition: all .3s;
}

.navigations>a:hover {
    text-shadow: 0 0 4px lightgray;
    transform: scale(1.1);
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
    .logo {
        width: 48px;
        height: 48px;
        padding-right: 4px;
    }

    .title {
        font-weight: 600;
        letter-spacing: 2px;
        font-size: 38.4px;
    }

    .navigations {
        width: 296px;
    }

    .navigations>a {
        font-size: 19px;
    }
}
</style>