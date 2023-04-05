<template>
    <div class="banner pt60">
        <div class="bg-wrapper">
            <div class="bg-wrapper-1">
                <div class="night">
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                    <div class="shooting_star"></div>
                </div>
            </div>
        </div>
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

.bg-wrapper {
    height: 0;
    width: 100%;
    overflow: visible;
}

.bg-wrapper-1 {
    height: 12.5rem;
    width: 100%;
    transform: translateY(-0.5rem);
    overflow: hidden;
}

.night {
    height: 12.5rem;
    width: 100%;
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
<style lang="scss">
$shooting-time: 3000ms;

.night {
    position: relative;
    width: 100%;
    height: 11rem;
    transform: rotateZ(45deg);
    // animation: sky 200000ms linear infinite;
}

.shooting_star {
    position: absolute;
    left: 50%;
    top: 50%;
    // width: 100px;
    height: 2px;
    background: linear-gradient(-45deg, rgba(255, 255, 255, 1), rgba(0, 0, 255, 0));
    border-radius: 999px;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 1));
    animation:
        tail $shooting-time ease-in-out infinite,
        shooting $shooting-time ease-in-out infinite;

    &::before {
        content: '';
        position: absolute;
        top: calc(50% - 1px);
        right: 0;
        // width: 30px;
        height: 2px;
        background: linear-gradient(-45deg, rgba(0, 0, 255, 0), rgba(255, 255, 255, 1), rgba(0, 0, 255, 0));
        transform: translateX(50%) rotateZ(45deg);
        border-radius: 100%;
        animation: shining $shooting-time ease-in-out infinite;
    }

    &::after {
        // CodePen Error
        // @extend .shooting_star::before;

        content: '';
        position: absolute;
        top: calc(50% - 1px);
        right: 0;
        // width: 30px;
        height: 2px;
        background: linear-gradient(-45deg, rgba(0, 0, 255, 0), rgba(255, 255, 255, 1), rgba(0, 0, 255, 0));
        transform: translateX(50%) rotateZ(45deg);
        border-radius: 100%;
        animation: shining $shooting-time ease-in-out infinite;
        transform: translateX(50%) rotateZ(-45deg);
    }

    @for $i from 1 through 20 {
        &:nth-child(#{$i}) {
            $delay: random(9999)+0ms;
            top: calc(50% - #{random(400) - 200px});
            left: calc(50% - #{random(300) + 0px});
            animation-delay: $delay;
            // opacity: random(50) / 100 + 0.5;

            &::before,
            &::after {
                animation-delay: $delay;
            }
        }
    }
}

@keyframes tail {
    0% {
        width: 0;
    }

    30% {
        width: 100px;
    }

    100% {
        width: 0;
    }
}

@keyframes shining {
    0% {
        width: 0;
    }

    50% {
        width: 30px;
    }

    100% {
        width: 0;
    }
}

@keyframes shooting {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(300px);
    }
}

@keyframes sky {
    0% {
        transform: rotate(45deg);
    }

    100% {
        transform: rotate(45 + 360deg);
    }
}
</style>