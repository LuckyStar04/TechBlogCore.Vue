<template>
    <div class="bg-wrapper">
        <div class="bg-wrapper-1">
            <div class="sun">
                <div class="circle"></div>
                <div class="eyes">
                    <span class="left"></span>
                    <span class="right"></span>
                </div>
                <div class="sunrays">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.bg-wrapper {
    height: 0;
    width: 100%;
    overflow: visible;
}

.bg-wrapper-1 {
    height: 12.5rem;
    margin: 0 auto;
    transform: translateY(-0.5rem);
    overflow: visible;
}

//variables
$size: 56px;
$eyesize: 5px;
$yellow: #FFDD4A;
$blue: #85C7F2;

//mixins
@mixin rotate($deg) {
    -ms-transform: rotate($deg);
    -webkit-transform: rotate($deg);
    transform: rotate($deg);
}

@mixin animate($name, $seconds, $direction, $length) {
    -webkit-animation: $name $seconds $direction $length;
    -moz-animation: $name $seconds $direction $length;
    animation: $name $seconds $direction $length;
}

@mixin eye-shape($height, $width, $radius) {
    height: $height;
    width: $width;
    border-radius: $radius;
}

.show .sun {
    visibility: visible;
    animation: rising 1s 1s ease both;
}

.sun {
    height: $size;
    width: $size;
    position: absolute;
    top: 0;
    right: 25px;
    animation: fall 1s ease both;
    visibility: hidden;
    transition: visibility 1s;

    .sunrays {
        @include animate(spin, 15s, linear, infinite);
        box-shadow: 0px 0px 100px lighten($yellow, 10%);
        height: $size;
        width: $size;
        position: relative;
        z-index: -3;
    }
}

@keyframes rising {
    0% {
        transform: translate3d(0, 15rem, 0);
    }

    100% {
        transform: none;
    }
}

@keyframes fall {
    0% {
        transform: none;
    }

    100% {
        transform: translate3d(0, 15rem, 0);
    }
}

.circle {
    height: $size;
    width: $size;
    z-index: -2;
    background: lighten($yellow, 10%);
    position: absolute;
    border-radius: 50%;
}

.sunrays span {
    background: $yellow;
    width: $size;
    height: $size;
    position: absolute;

    &:first-child {
        @include rotate(30deg);
    }

    &:nth-child(2) {
        @include rotate(60deg);
    }
}

.eyes {
    position: relative;
    top: 20px;
    z-index: -1;

    .left,
    .right {
        background: black;
        position: absolute;
        @include eye-shape($eyesize, $eyesize, 50%);
        @include animate(blink, 2.5s, linear, infinite);
    }

    .left {
        left: 47%;
    }

    .right {
        left: 15%;
    }
}

//animations
@keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}

@-moz-keyframes spin {
    0% {
        -moz-transform: rotate(0deg);
    }

    100% {
        -moz-transform: rotate(360deg);
    }
}

@keyframes blink {
    0% {
        @include eye-shape($eyesize, $eyesize, 50%);
    }

    5% {
        @include eye-shape(1px, $eyesize, 0);
    }

    10% {
        @include eye-shape($eyesize, $eyesize, 50%);
    }
}

@media only screen and (min-width: 1440px) {
    .bg-wrapper-1 {
        width: 960px;
    }
}

@media only screen and (min-width: 1024px) and (max-width: 1440px) {
    .bg-wrapper-1 {
        width: 768px;
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
    .bg-wrapper-1 {
        width: 680px;
    }
}

@media only screen and (max-width: 768px) {
    .bg-wrapper-1 {
        width: 100%;
    }
}
</style>