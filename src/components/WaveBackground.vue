<template>
    <Teleport to="#teleport">
        <div class="wrapper">
            <div class="header">
                <div class="inner-header">
                    <slot></slot>
                </div>
                <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave"
                            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g class="parallax">
                        <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                        <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
                    </g>
                </svg>
                <!--Waves end-->

            </div>
            <!--Header ends-->

            <!--Content starts-->
            <div class="content flex">
                <p>© LuckyStar 2023.</p>
            </div>
        </div>
    </Teleport>
</template>
<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
}

p {
    font-family: 'Trebuchet MS';
    letter-spacing: 1px;
    font-size: 14px;
    color: #333333;
}

.header {
    flex: 7 0 auto;
    position: relative;
    text-align: center;
    background: linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%);
    color: white;
    display: flex;
    flex-direction: column;
}

.inner-header {
    flex: 65 0 auto;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.flex {
    /*Flexbox for containers*/
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.waves {
    flex: 15 0 auto;
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: -7px;
    /*Fix for safari gap*/
    min-height: 100px;
    max-height: 150px;
}

.content {
    flex: 3 0 auto;
    position: relative;
    text-align: center;
    background-color: white;
}

/* Animation */

.parallax>use {
    animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
}

.parallax>use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
}

.parallax>use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
}

.parallax>use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
}

.parallax>use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
}

@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }

    100% {
        transform: translate3d(85px, 0, 0);
    }
}

@media only screen and (max-width: 768px) {
    .waves {
        flex: 0 0 40px;
        min-height: 40px;
    }

    .content {
        flex: 4 0 auto;
    }
}
</style>