<template>
    <div class="banner pt60">
        <BannerBgMoon :class="{ show: isDark }" />
        <BannerBgSun :class="{ show: !isDark }" />
        <BannerBgStar v-if="isDark"/>
        <div class="banner-img">
            <img :src="bannerpng" alt="Little Prince" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import bannerpng from '@/assets/little_prince.png'
import BannerBgStar from './BannerBgStar.vue'
import BannerBgSun from './BannerBgSun.vue'
import BannerBgMoon from './BannerBgMoon.vue'
import { useDark } from '@vueuse/core'

const isDark = useDark()
</script>
<style scoped>
.pt60 {
    padding-top: 60px;
}

.banner {
    height: 11rem;
    overflow: visible;
}

.banner-img {
    display: flex;
    justify-content: center;
    background: var(--bg-banner-sky-color);
    height: 14.4rem;
}

.banner-img>img {
    height: 11rem;
    width: auto;
    transform: translate(0, 2.08rem);
    position: relative;
    z-index: 4;
}
</style>