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
import { useDark as isDark } from '@/components/dark'

</script>
<style scoped>
.pt60 {
    padding-top: 60px;
}

.banner {
    height: 11rem;
    width: 100vw;
}

.banner-img {
    display: flex;
    justify-content: center;
    background: var(--bg-banner-sky-color);
    height: 14.4rem;
    user-select: none;
}

.banner-img>img {
    height: 11rem;
    width: auto;
    transform: translate(0, 2.08rem);
    position: relative;
    z-index: 4;
    filter: brightness(107%) saturate(143%) drop-shadow(1px -1px 1px #fffa) drop-shadow(-1px 1px 1px #000a);
}

html.dark .banner-img>img {
    filter: brightness(88%) saturate(90%) drop-shadow(-1px -1px 5px #fffa) drop-shadow(1px 1px 1px #000a);
}
</style>