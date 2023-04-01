<template>
    <div class="banner pt60">
        <div class="banner-img">
            <img :src="bannerpng" alt="Little Prince" />
        </div>
        <div class="banner-overflow"></div>
    </div>
</template>
<script lang="ts" setup>
import bannerpng from '@/assets/little_prince.png'


</script>
<style scoped>
.pt60 {
    padding-top: 60px;
}

.banner {
    height: 11rem;
    background: var(--bg-sky-color);
    overflow: visible;
}

.banner-img {
    display: flex;
    justify-content: center;
}

.banner-img>img {
    height: 11rem;
    width: auto;
    transform: translate(0, 2.08rem);
}

.banner-overflow {
    width: 100%;
    height: 3rem;
    background: var(--bg-sky-color);
}
</style>