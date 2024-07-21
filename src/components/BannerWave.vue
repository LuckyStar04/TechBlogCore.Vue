<template>
  <div class="banner">
    <div class="banner-content">
      <div class="banner-fill"></div>
      <svg class="banner-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill-opacity="0.7" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill-opacity="0.5" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill-opacity="0.3" />
          <use xlink:href="#gentle-wave" x="48" y="7" />
        </g>
      </svg>
    </div>
  </div>
</template>
<style scoped>
.pt60 {
  padding-top: 60px;
}

.banner {
  height: 16rem;
  width: 100vw;
}

.banner-content {
  width: 100vw;
  height: 22rem;
  background: linear-gradient(to right, var(--bg-sky-color-dark), var(--bg-sky-color));
}

.banner-fill {
  width: 100vw;
  height: 16rem;
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
  fill: var(--bg-color-secondary);
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