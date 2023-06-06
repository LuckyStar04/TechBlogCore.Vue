<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

const props = defineProps<{
    show: boolean,
    picItems?: Array<HTMLElement>,
    current: number,
}>()

const emit = defineEmits(['hide'])

const data = reactive({
    curPic: 0,
})

const goPrev = () => {
    if (data.curPic > 0) {
        data.curPic--
    }
}

const goNext = () => {
    if (!props.picItems) return
    if (data.curPic < props.picItems.length - 1) {
        data.curPic++
    }
}

const touch = reactive({ X: 0, moveX: 0, zoom: 1 })
const mouse = reactive({ X: 0, moveX: 0 })

const width = computed(() => {
    if (!props.picItems) return '0'
    return `${props.picItems.length * 100}vw`
})

const touchIndex = computed(() => {
    return `${touch.moveX}px`
})

const index = computed(() => {
    return `-${data.curPic * 100}vw`
})

const carousel = ref()
const children = ref()

const addTranslate = (i: number) => {
    if (!props.picItems) return
    const from = props.picItems[i] as HTMLImageElement | undefined
    const to = document.querySelector(`#modalimg-${i}`) as HTMLImageElement | null
    if (!from || !to) return

    const fromRect = from.getBoundingClientRect()
    const toRect = to.getBoundingClientRect()
    const scale = fromRect.width / toRect.width
    to.style.transition = '0s'

    let x = 0, y = 0
    let transform = ''
    if (scale == 1) {
        x = fromRect.x - toRect.x
        y = fromRect.y - toRect.y
        transform = `translate(${x}px,${y}px)`
    } else {
        x = fromRect.x - toRect.x + (from.width - to.width) / 2
        y = fromRect.y - toRect.y + (from.height - to.height) / 2
        transform = `translate(${x}px,${y}px) scale(${scale},${scale})`
    }

    to.style.transform = transform
    setTimeout(() => {
        to.style.transition = 'transform .4s cubic-bezier(.2,.91,.65,.98)'
        to.style.transform = 'none'
    }, 10)
}

const removeTranslate = (i: number) => {
    const to = document.querySelector(`#modalimg-${i}`) as HTMLImageElement | null
    if (!to) return
    to.style.removeProperty('transform')
}

watch(() => props.show, () => {
    const body = document.querySelector('body') as HTMLElement
    if (props.show) {
        body.style.overflow = 'hidden'
        data.curPic = props.current
        nextTick(() => addTranslate(props.current))
    } else {
        body.style.overflow = 'auto'
        nextTick(() => removeTranslate(props.current))
    }
})

watch(() => props.current, () => {
    if (props.current < 0 || !props.picItems) {
        data.curPic = 0
    } else if (props.current >= props.picItems.length) {
        data.curPic = props.picItems.length
    } else {
        data.curPic = props.current
    }
})

let isZoom: boolean = false
let zoomObj: HTMLImageElement

const handleTouchStart = (evt: TouchEvent) => {
    children.value.style.transition = '0s'
    if (evt.touches.length == 1) {
        touch.X = evt.changedTouches[0].clientX
        isZoom = false
    } else if (evt.touches.length == 2) {
        isZoom = true
        zoomObj = document.querySelector(`#modalimg-${data.curPic}`) as HTMLImageElement
        touch.zoom = Math.hypot(evt.touches[0].pageX - evt.touches[1].pageX,
                                 evt.touches[0].pageY - evt.touches[1].pageY)
    }
}

const handleTouchEnd = (evt: TouchEvent) => {
    children.value.style.transition = 'transform .4s ease'
    if (isZoom) {
        zoomObj.style.transform = `scale(1,1)`
    } else {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const threshold = vw * 0.2
        if (touch.moveX >= threshold) {
            goPrev()
        } else if (touch.moveX <= -threshold) {
            goNext()
        }
        touch.moveX = 0
    }
}

const handleTouchMove = (evt: TouchEvent) => {
    if (isZoom) {
        const scale = Math.hypot(evt.touches[0].pageX - evt.touches[1].pageX,
                                 evt.touches[0].pageY - evt.touches[1].pageY)
        zoomObj.style.transform = `scale(${scale/touch.zoom},${scale/touch.zoom})`
    } else {
        touch.moveX = (evt.changedTouches[0].clientX - touch.X)
    }
}

onMounted(() => {
    carousel.value.addEventListener('touchstart', handleTouchStart)
    carousel.value.addEventListener('touchend', handleTouchEnd)
    carousel.value.addEventListener('touchcancel', handleTouchEnd)
    carousel.value.addEventListener('touchmove', handleTouchMove)

})

onBeforeUnmount(() => {
    carousel.value.removeEventListener('touchstart', handleTouchStart)
    carousel.value.removeEventListener('touchend', handleTouchEnd)
    carousel.value.removeEventListener('touchcancel', handleTouchEnd)
    carousel.value.removeEventListener('touchmove', handleTouchMove)
})
</script>
<template>
    <Teleport to="body">
        <div class="pos-fixed" :class="{ visible: show, hidden: !show }" @click="$emit('hide')" ref="carousel">
            <div class="btn btn-left" :class="{ disabled: data.curPic <= 0 }" @click.stop="goPrev">
                <el-icon><ArrowLeftBold /></el-icon>
            </div>
            <div class="children" ref="children">
                <div class="child" v-for="item, idx in picItems" :class="{ active: picItems && item === picItems[current] }">
                    <img :id="`modalimg-${idx}`" :src="item.getAttribute('src') ?? ''" />
                    <!-- <p v-if="item.getAttribute('alt')">{{ item.getAttribute('alt') }}</p> -->
                </div>
            </div>
            <div class="btn btn-right" :class="{ disabled: !picItems || data.curPic >= (picItems.length - 1) }" @click.stop="goNext">
                <el-icon><ArrowRightBold /></el-icon>
            </div>
        </div>
    </Teleport>
</template>
<style scoped>
* {
    box-sizing: border-box;
    user-select: none;
}

.pos-fixed {
    --size: 12vmin;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all .4s ease;
}

.pos-fixed.hidden {
    opacity: .4;
    visibility: hidden;
}

.pos-fixed.visible {
    opacity: 1;
    visibility: visible;
}

.children {
    display: inline-flex;
    width: v-bind('width');
    height: 100%;
    transform: translateX(calc(v-bind('index') + v-bind('touchIndex')));
    transition: transform .4s ease;
}

.pos-fixed.hidden .children {
    display: none;
}

.btn {
    position: absolute;
    height: var(--size);
    width: var(--size);
    top: calc(50vh - var(--size) * 0.5);
    border-radius: 50%;
    background-color: rgba(144, 147, 153, 0.7);
    color: white;
    z-index: 1000;
    font-size: calc(var(--size) * 0.5);
    line-height: var(--size);
    text-align: center;
    vertical-align: bottom;
    transition: color .4s ease;
}

.btn.disabled {
    color: rgba(255, 255, 255, 0.3);
    background-color: rgba(144, 147, 153, 0.5);
}

.btn .el-icon {
    transform: translateY(calc(var(--size) * 0.05));
}

.btn-left {
    left: calc(var(--size) *0.25);
}

.btn-right {
    right: calc(var(--size) * 0.25);
}

.child {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.child>img {
    max-width: 92%;
    max-height: 92%;
    background-color: var(--el-bg-color);
    transform: none;
    transition: transform .4s cubic-bezier(.2,.91,.65,.98);
    visibility: visible;
}

.pos-fixed.hidden .child>img {
    display: none;
}

/* .child>p {
    font-size: calc(var(--size) * 0.25);
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 0;
    max-width: 100vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
} */
</style>