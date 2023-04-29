<template>
    <div class="bg-wrapper">
        <div class="bg-wrapper-1">
            <div class="sun">
                <div class="circle"></div>
                <div class="eyes">
                    <span class="left"></span>
                    <span class="right"></span>
                </div>
                <div class="sunshine">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="sunrays">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div class="cloud"></div>
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

.show .cloud {
    animation: cloud-show .6s .9s ease both, floating 7s 1.6s ease infinite;
}

.show .sun .sunshine {
    visibility: visible;
}

@keyframes cloud-show {
    0% {
        opacity: 0;
        -webkit-transform: translateX(100%);
        transform: translateX(100%);
    }

    100% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
    }
}

@keyframes cloud-hide {
    0% {
        opacity: 1;
        -webkit-transform: none;
        transform: none;
    }

    100% {
        opacity: 0;
        -webkit-transform: translateX(100%);
        transform: translateX(100%);
    }
}

@keyframes floating {

    0%,
    100% {
        -webkit-transform: none;
        transform: none;
    }

    50% {
        -webkit-transform: translateX(20px);
        transform: translateX(20px);
    }
}

.cloud {
    position: absolute;
    top: 50px;
    right: 1px;
    width: 60px;
    height: 20px;
    background: linear-gradient(top, #f2f9fe 5%, #d6f0fd 100%);
    background: -webkit-linear-gradient(top, #f2f9fe 5%, #d6f0fd 100%);
    background: -moz-linear-gradient(top, #f2f9fe 5%, #d6f0fd 100%);
    background: -ms-linear-gradient(top, #f2f9fe 5%, #d6f0fd 100%);
    background: -o-linear-gradient(top, #f2f9fe 5%, #d6f0fd 100%);
    border-radius: 17px;
    box-shadow: 7px 7px 17px 3px rgba(0, 0, 0, 0.32);
    animation: cloud-hide .6s ease forwards;
}

.cloud::after,
.cloud::before {
    content: "";
    position: relative;
    display: inline-block;
    background: inherit;
    border-radius: inherit;
}

.cloud::after {
    width: 17px;
    height: 17px;
    top: -22px;
    left: -18px;
}

.cloud::before {
    width: 31px;
    height: 31px;
    top: -12px;
    left: 22px;
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
    animation: rising 1s .6s ease both;
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

    .sunshine {
        height: $size;
        width: $size;
        position: relative;
        z-index: -4;
        visibility: hidden;
    }

    .sunrays {
        @include animate(spin, 15s, linear, infinite);
        height: $size;
        width: $size;
        top: -100%;
        position: relative;
        z-index: -3;
    }
}

@keyframes rising {
    0% {
        transform: translateY(15rem);
        opacity: 0;
    }

    50% {
        opacity: .8;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fall {
    0% {
        transform: translateY(0);
        opacity: 1;
    }

    50% {
        opacity: .3;
    }

    100% {
        transform: translateY(15rem);
        opacity: 0;
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

.sunshine span {
    border-radius: 50%;
    position: absolute;

    &:nth-child(1) {
        height: $size * 2;
        width: $size * 2;
        background-color: transparentize(lighten($yellow, 10%), .66);
        top: -50%;
        left: -50%;
    }

    &:nth-child(2) {
        height: $size * 3.2;
        width: $size * 3.2;
        background: linear-gradient(to right, transparentize(lighten($yellow, 15%), .72), transparentize(lighten($yellow, 15%), .86));
        top: -110%;
        left: -110%;
    }

    &:nth-child(3) {
        height: $size * 5;
        width: $size * 5;
        background: linear-gradient(to right, transparentize(lighten($yellow, 20%), .8) 70%, transparentize(lighten($yellow, 20%), 1));
        top: -200%;
        left: -200%;
    }

    &:nth-child(4) {
        height: $size * 7.8;
        width: $size * 7.8;
        background: linear-gradient(to right, transparentize(lighten($yellow, 30%), .9) 55%, transparentize(lighten($yellow, 30%), 1));
        top: -340%;
        left: -340%;
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