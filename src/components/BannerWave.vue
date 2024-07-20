<template>
  <div class="banner pt60">
    <div class="banner-fill"></div>
    <svg class="banner-svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="gentle-wave"
          d="M-112 3C-82 3 -54 21 -24 21C6 21 34 3 64 3C94 3 122 21 152 21C182 21 210 3 240 3V-41H-112V3Z" />
      </defs>
      <g class="parallax">
        <use xlink:href="#gentle-wave" x="0" y="31" fill-opacity="0.3" />
        <use xlink:href="#gentle-wave" x="0" y="29" fill-opacity="0.5" />
        <use xlink:href="#gentle-wave" x="0" y="27" fill-opacity="0.7"/>
        <use xlink:href="#gentle-wave" x="0" y="24" />
      </g>
    </svg>
  </div>
</template>
<style scoped>
.pt60 {
  padding-top: 60px;
}

.banner {
  height: 11rem;
  width: 100vw;
}

.banner-fill {
  background-color: var(--bg-sky-color);
  width: 100vw;
  height: 11rem;
}

.banner-svg {
  width: 100vw;
  height: 7rem;
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
  fill: var(--bg-sky-color);
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
</style>