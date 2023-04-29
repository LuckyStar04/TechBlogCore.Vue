<template>
    <div class="bg-wrapper">
        <div class="bg-wrapper-1">
            <div class="moon">
                <div class="craters"></div>
                <div class="eye-left"></div>
                <div class="eye-right"></div>
            </div>
            <div class="stars">
                <div class="top"></div>
                <div class="left"></div>
                <div class="right"></div>
                <div class="bottom"></div>
            </div>
        </div>
    </div>
</template>
<style lang="sass" scoped>
.bg-wrapper
    height: 0
    width: 100%
    overflow: visible


.bg-wrapper-1
    height: 12.5rem
    margin: 0 auto
    transform: translateY(-0.5rem)
    overflow: visible

/* COLORS */
$l-blue: #0B0F2B
$d-blue: #090D23
$black: #333
$l-grey: #EAEAEA
$d-grey: #9E9E9E
$grey: #BFBFBF
$yellow: #EFE894

/* MIXINS */
@mixin pseudo ($position: absolute, $display: block, $content: '')
    position: $position
    display: $display
    content: ''

@mixin size($height, $width)
    height: $height
    width: $width

@mixin cross($property, $val)
    -webkit-#{$property}: $val
    -moz-#{$property}: $val
    -ms-#{$property}: $val
    #{$property}: $val


*
    box-sizing: border-box

%craters
    @include pseudo
    background: $grey
    box-shadow: inset 2px 0 $d-grey
    border-radius: 50%


@keyframes rising
    0%
        transform: translateY(15rem)
        opacity: 0
    50%
        opacity: .8
    100%
        transform: translateY(0)
        opacity: 1

@keyframes fall
    0%
        transform: translateY(0)
        opacity: 1
    50%
        opacity: .3
    100%
        transform: translateY(15rem)
        opacity: 0

.show .moon
    visibility: visible
    animation: rising 1s .6s ease both

.show .stars
    visibility: visible
.moon
    position: absolute
    top: 0
    right: 25px
    @include size(75px,75px)
    background: $l-grey
    border-radius: 50%
    box-shadow: inset -15px 0 6px $grey, 0 0 8px $l-grey
    animation: floating 5s linear infinite 0s, fall 1s ease both
    visibility: hidden
    transition: visibility 1s
    z-index: 10

    .craters
        position: absolute
        top: 20%
        left: 20%
        @include size(20%,20%)
        background: $grey
        border-radius: 50%
        box-shadow: inset -1px 0 1px $d-grey
        opacity: 0.4
        &::before
            @extend %craters
            top: -8px
            right: -25px
            @include size(15px,15px)
            box-shadow: inset -1px 0 1px $d-grey
        &::after
            @extend %craters
            top: 30px
            left: 30px
            @include size(10px,10px)
            box-shadow: inset -1px 0 1px $d-grey
        
%eyes
    position: absolute
    bottom: 30%
    @include size(15%,9%)
    background: $black
    border-radius: 50%
    animation: blink 4s linear infinite 0s

%inner-eye
    @include pseudo
    top: 1px
    right: 2px
    @include size(4px,2px)
    background: $l-grey
    border-radius: 50%

.eye-left
    @extend %eyes
    left: 10%
    &::before
        @extend %inner-eye

.eye-right
    @extend %eyes
    bottom: 25%
    left: 30%
    &::before
        @extend %inner-eye
    
%stars
    background: $yellow
    border-radius: 50%
    box-shadow: 0 0 5px 1px $yellow
    animation: glow 5s linear infinite

.stars
    position: absolute
    top: 0
    right: -4rem
    visibility: hidden
    @include size(150px,225px)

    .top
        position: absolute
        top: 0
        left: 10%
        @include size(3px,3px)
        @extend %stars
        box-shadow: 0 0 5px $yellow
        &::before
            @include pseudo
            top: 10px
            left: 150px
            @extend %stars
            @include size(4px,4px)
        &::after
            @include pseudo
            top: 2px
            left: 90px
            @extend %stars
            @include size(3px,3px)
        
    .left
        position: absolute
        top: 20%
        left: 15%
        @include size(4px,4px)
        @extend %stars
        box-shadow: 0 0 5px $yellow
        &::before
            @include pseudo
            top: 53px
            left: -12px
            @extend %stars
            @include size(3px,3px)
        &::after
            @include pseudo
            top: -10px
            left: 40px
            @extend %stars
            @include size(3px,3px)
        
    .bottom
        position: absolute
        bottom: 20%
        right: 28%
        @include size(3px,3px)
        @extend %stars
        box-shadow: 0 0 5px $yellow
        &::before
            @include pseudo
            @include size(4px,4px)
            @extend %stars
            bottom: 35px
            right: -10px
        &::after
            @include pseudo
            @include size(3px,3px)
            @extend %stars
            top: 10px
            right: 80px
    .right
        position: absolute
        bottom: 25%
        right: 10%
        @include size(5px,5px)
        @extend %stars
    
@keyframes blink
    5%,10%
        height: 1px
    10%
        height: 15%
    
@keyframes floating
    0%
        @include cross(transform, translateY(0px))
    50%
        @include cross(transform, translateY(2px) translateX(1px))
        box-shadow: inset -20px 0 20px $grey, 0 0 8px $l-grey
    100%
        @include cross(transform, translateY(0px))

@keyframes glow
    0%
        opacity: 1
    50%
        opacity: 0.6
    100%
        opacity: 1

.watchme
    position: absolute
    bottom: 5%
    right: 5%
    text-align: center
    span
        background: #fff
    p
        color: #fff
        font-family: 'Open Sans', sans-serif
        margin: 0
    
    .fa
        vertical-align: middle
        width: 40px
        color: #ff0000
        font-size: 3em

@media only screen and (min-width: 1440px)
    .bg-wrapper-1
        width: 960px

@media only screen and (min-width: 1024px) and (max-width: 1440px)
    .bg-wrapper-1
        width: 768px

@media only screen and (min-width: 768px) and (max-width: 1024px)
    .bg-wrapper-1
        width: 680px

@media only screen and (max-width: 768px)
    .bg-wrapper-1
        width: 100%
</style>