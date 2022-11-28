<template lang="pug">
.stars-wrapper
  - for (var s = 0; s < 3; ++s)
    svg.stars(width="100%", height="100%", preserveAspectRatio="none")
      - for (var i = 0; i < 200; ++i)
        - cx = Math.round(Math.random() * 10000) / 100 + '%';
        - cy = Math.round(Math.random() * 10000) / 100 + '%';
        - r = Math.round((Math.random() + 0.5) * 10) / 10;
        circle.star(cx=cx, cy=cy, r=r)
  svg.extras(width="100%", height="100%", preserveAspectRatio="none")
    defs
      radialGradient#comet-gradient(, cx="0", cy=".5", r="0.5")
        stop(offset="0%", stop-color="rgba(255,255,255,.8)")
        stop(offset="100%", stop-color="rgba(255,255,255,0)")
    g(transform="rotate(-135)")
      ellipse.comet.comet-a(
        fill="url(#comet-gradient)",
        cx="0",
        cy="0",
        rx="150",
        ry="2"
      )
    g(transform="rotate(20)")
      ellipse.comet.comet-b(
        fill="url(#comet-gradient)",
        cx="100%",
        cy="0",
        rx="150",
        ry="2"
      )
    g(transform="rotate(300)")
      ellipse.comet.comet-c(
        fill="url(#comet-gradient)",
        cx="40%",
        cy="100%",
        rx="150",
        ry="2"
      )
</template>
<style lang="scss">
:root {
	--twinkle-duration: 4s;
}

.stars-wrapper {
	position: relative;
	pointer-events: none;
	width: 100vw;
	height: 100vh;
	background: linear-gradient(#16161d, #1f1f3a, #3b2f4a);
	overflow: hidden;
}

.stars {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	animation: twinkle var(--twinkle-duration) ease-in-out infinite;

	&:nth-child(2) {
		animation-delay: calc(var(--twinkle-duration) * -0.33);
	}
	&:nth-child(3) {
		animation-delay: calc(var(--twinkle-duration) * -0.66);
	}

	@keyframes twinkle {
		25% {
			opacity: 0;
		}
	}
}

.star {
	fill: white;

	&:nth-child(3n) {
		opacity: 0.8;
	}
	&:nth-child(7n) {
		opacity: 0.6;
	}
	&:nth-child(13n) {
		opacity: 0.4;
	}
	&:nth-child(19n) {
		opacity: 0.2;
	}
}

.comet {
	transform-origin: center center;
	animation: comet 10s linear infinite;

	@keyframes comet {
		0%,
		40% {
			transform: translateX(0);
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		60%,
		100% {
			transform: translateX(-100vmax);
			opacity: 0;
		}
	}
}

.comet-b {
	animation-delay: -3.3s;
}

.comet-c {
	animation-delay: -5s;
}

</style>