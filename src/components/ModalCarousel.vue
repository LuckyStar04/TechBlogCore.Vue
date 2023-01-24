<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
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

const width = computed(() => {
    if (!props.picItems) return '0'
    return `${props.picItems.length * 100}vw`
})

const index = computed(() => {
    return `-${data.curPic * 100}vw`
})

watch(() => props.show, () => {
    const body = document.querySelector('body') as HTMLElement
    if (props.show) {
        body.style.overflow = 'hidden'
        data.curPic = props.current
    } else {
        body.style.overflow = 'auto'
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

const carousel = ref()
const start = reactive({
    X: 0,
})

const handleStart = (evt: TouchEvent) => {
    start.X = evt.changedTouches[0].clientX
}

const handleEnd = (evt: TouchEvent) => {
    if (evt.changedTouches[0].clientX > start.X) goPrev()
    else if (evt.changedTouches[0].clientX < start.X) goNext()
}

onMounted(() => {
    carousel.value.addEventListener('touchstart', handleStart)
    carousel.value.addEventListener('touchend', handleEnd)
    carousel.value.addEventListener('touchcancel', handleEnd)
})

onBeforeUnmount(() => {
    carousel.value.removeEventListener('touchstart', handleStart)
    carousel.value.removeEventListener('touchend', handleEnd)
    carousel.value.removeEventListener('touchcancel', handleEnd)
})
</script>
<template>
    <Teleport to="body">
        <div class="pos-fixed" :class="{ visible: show, hidden: !show }" @click="$emit('hide')" ref="carousel">
            <div class="btn btn-left" :class="{ disabled: data.curPic <= 0 }" @click.stop="goPrev"><el-icon><ArrowLeftBold /></el-icon></div>
            <div class="children">
                <div class="child" v-for="item in picItems" :class="{ active: picItems && item === picItems[current] }"><img :src="item.getAttribute('src')??''" /><p v-if="item.getAttribute('alt')">{{ item.getAttribute('alt') }}</p></div>
            </div>
            <div class="btn btn-right" :class="{ disabled: !picItems || data.curPic >= (picItems.length - 1) }" @click.stop="goNext"><el-icon><ArrowRightBold /></el-icon></div>
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
    visibility: hidden;
    opacity: 0;
    transition: all .4s ease;
}

.pos-fixed.visible {
    visibility: visible;
    opacity: 1;
}

.children {
    display: inline-flex;
    width: v-bind('width');
    height: 100%;
    transform: translateX(v-bind('index'));
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
}

.pos-fixed.hidden .child>img {
    display: none;
}

.child>p {
    font-size: calc(var(--size) * 0.25);
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 0;
    max-width: 100vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>