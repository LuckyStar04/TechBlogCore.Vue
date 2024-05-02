<script lang="ts" setup>
import type { CategoryModel } from '@/types';
import { nextTick, onMounted, onUnmounted, reactive, watch, ref } from 'vue';
import req from '@/utils/request'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/ArticleStore'

const props = defineProps({
    showShadow: {
        Type: Boolean,
        required: false,
        default: true,
    }
})
const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const data = reactive({
    categories: [] as Array<CategoryModel>,
    isLoading: true,
})

const categories = ref()
const bg = reactive({
    X: '100px',
    Y: '0px',
    Width: '0px',
    Height: '0px',
})
const hoverBg = reactive({
    X: '100px',
    Y: '0px',
    Width: '0px',
    Height: '0px',
})

const initBg = () => {
    let e = categories.value.querySelector('.active') as HTMLElement | null
    if (!e) {
        hideBg()
        return
    }
    bg.X = `${e.offsetLeft}px`
    bg.Y = `${e.offsetTop}px`
    bg.Width = `${e.clientWidth}px`
    bg.Height = `${e.clientHeight}px`
}

const moveBg = (to?: HTMLElement, category?: string) => {
    if (!to) {
        if (!category) {
            hideBg()
            return
        }
        const id = data.categories.find(c => c.name === articleStore.store.category)?.id
        if (!id) {
            hideBg()
            return
        }
        to = document.querySelector(`#ca-${id}`) as HTMLElement
    }
    bg.X = `${to.offsetLeft}px`
    bg.Y = `${to.offsetTop}px`
    bg.Width = `${to.clientWidth}px`
    bg.Height = `${to.clientHeight}px`
}

const hideBg = () => {
    bg.X = `${categories.value?.clientWidth ?? 0 / 2}px`
    bg.Y = `0px`
    bg.Width = '0px'
    bg.Height = '0px'
}

const moveHoverBg = (to: HTMLElement) => {
    hoverBg.X = `${to.offsetLeft}px`
    hoverBg.Y = `${to.offsetTop}px`
    hoverBg.Width = `${to.clientWidth}px`
    hoverBg.Height = `${to.clientHeight}px`
}

const hideHoverBg = (e: MouseEvent) => {
    hoverBg.X = `${e.offsetX}px`
    hoverBg.Y = `${e.offsetY}px`
    hoverBg.Width = '0px'
    hoverBg.Height = '0px'
}

const fetchData = async () => {
    data.isLoading = true
    let response = await req.request({
        url: 'categories', method: 'get', params: { size: 30 }
    })
    if (response.status == 200) {
        data.categories = response.data
        data.isLoading = false
        nextTick(() => {
            initBg()
        })
    }
}

const handleResize = () => {
    bg.Width = `${(categories.value as HTMLElement).firstElementChild?.clientWidth ?? 0}px`
}

const onHover = (e: MouseEvent) => {
    const to = e.target as HTMLElement
    moveHoverBg(to)
    to.classList.add('c-blue')
}

const onLeave = (e: MouseEvent) => {
    const to = e.target as HTMLElement
    to.classList.remove('c-blue')
}

onMounted(() => {
    fetchData()
    window.addEventListener('resize', handleResize, false)
})
onUnmounted(() => {
    window.removeEventListener('resize', handleResize, false)
})

const jumpCategory = (category: string, e: MouseEvent) => {
    moveBg(e.target as HTMLElement)
    router.push({ name: 'articles', query: { category: category } })
}

watch(() => articleStore.store.category, function () {
    moveBg(undefined, articleStore.store.category)
})
</script>
<template>
    <div class="wrapper" :class="{ noshadow: !props.showShadow }">
        <div class="category-title">
            <h2>文章分类<span>Categories</span></h2>
        </div>
        <ul class="categories" v-if="data.isLoading">
            <el-skeleton animated />
        </ul>
        <ul v-else class="categories" ref="categories" @mouseleave="hideHoverBg($event)">
            <li v-for="category in data.categories" @click="jumpCategory(category.name, $event)"
                @mouseenter="onHover($event)" @mouseleave="onLeave($event)"
                :class="(articleStore.store.category == category.name ? 'active' : '')" :id="`ca-${category.id}`">
                {{ category.name }} ({{ category.count }})
            </li>
        </ul>
    </div>
</template>
<style scoped>
* {
    font-family: 'Trebuchet MS';
}

a {
    text-decoration: none !important;
}

.wrapper {
    border-radius: 7px;
    background-color: var(--bg-color-primary);
}

.wrapper.noshadow {
    box-shadow: none !important;
}

.categories {
    padding: 1rem;
}

.categories {
    margin: 0;
    position: relative;
}

.categories::before {
    content: " ";
    position: absolute;
    z-index: 1;
    top: v-bind('hoverBg.Y');
    left: v-bind('hoverBg.X');
    width: v-bind('hoverBg.Width');
    height: v-bind('hoverBg.Height');
    display: block;
    border-radius: .5rem;
    background-color: rgba(var(--el-color-info-rgb), .11);
    transition: all .3s cubic-bezier(.12, 1.01, .66, 1.09);
}

.categories::after {
    content: " ";
    position: absolute;
    z-index: 2;
    top: v-bind('bg.Y');
    left: v-bind('bg.X');
    width: v-bind('bg.Width');
    height: v-bind('bg.Height');
    display: block;
    border-radius: .5rem;
    background-color: rgba(var(--el-color-primary-rgb), .2);
    transition: all .3s cubic-bezier(.12, 1.01, .66, 1.09);
}

.c-blue {
    color: rgba(var(--el-color-primary-rgb), .95);
    transform: translate(4px, -2px);
    text-shadow: 0 2px 6px var(--el-color-info);
}

.category-title {
    margin: 0 1rem;
    padding-top: 0.1px;
    border-bottom: 1px solid var(--el-border-color-light);
}

.category-title>h2 {
    font-family: initial;
    line-height: 2rem;
    font-weight: 200;
    color: var(--el-text-color-primary);
    white-space: nowrap;
}

.category-title>h2>span {
    font-family: initial;
    color: var(--el-text-color-secondary);
    margin-left: .6rem;
    font-size: 0.8em;
}

h1,
h2,
h3 {
    color: var(--el-text-color-regular);
}

li {
    list-style-type: none;
    font-size: 1rem;
    line-height: 2.4rem;
    padding-left: .8rem;
    cursor: pointer;
    color: var(--el-color-info);
    border-radius: 8px;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    z-index: 3;
    transition: all .3s;
}

li.active {
    font-weight: 700;
    color: var(--el-color-primary);
    /* transition: color .25s; */
    /* background-color: rgba(var(--el-color-primary-rgb), .1); */
}
</style>