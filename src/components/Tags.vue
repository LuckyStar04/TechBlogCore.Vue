<script lang="ts" setup>
import type { TagModel } from '@/types';
import { reactive } from 'vue';
import req from '@/utils/request'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/stores/ArticleStore'

const props = defineProps({
    showShadow: {
        Type: Boolean,
        required: false,
        default: true,
    }
})

const route = useRoute()
//const colors = ['primary', 'success', 'info', 'warning', 'danger']

const hoverBg = reactive({
    X: '100px',
    Y: '0px',
    Width: '0px',
    Height: '0px',
})

const moveHoverBg = (to: HTMLElement) => {
    if (to.classList.contains('el-button--success')) {
        hoverBg.X = `${to.offsetLeft}px`
        hoverBg.Y = `${to.offsetTop}px`
        hoverBg.Width = `${to.clientWidth}px`
        hoverBg.Height = `${to.clientHeight}px`
    } else {
        hoverBg.X = `${to.offsetLeft - 7}px`
        hoverBg.Y = `${to.offsetTop - 7}px`
        hoverBg.Width = `${to.clientWidth + 14}px`
        hoverBg.Height = `${to.clientHeight + 14}px`
    }
}

const hideHoverBg = (e: MouseEvent) => {
    hoverBg.X = `${e.offsetX}px`
    hoverBg.Y = `${e.offsetY}px`
    hoverBg.Width = '0px'
    hoverBg.Height = '0px'
}

const onHover = (e: MouseEvent) => {
    const to = e.target as HTMLElement
    moveHoverBg(to)
    if (!to.classList.contains('el-button--success')) to.classList.add('c-green')
}

const onLeave = (e: MouseEvent) => {
    const to = e.target as HTMLElement
    to.classList.remove('c-green')
}

const data = reactive({
    tags: [] as Array<TagModel>,
})
const articleStore = useArticleStore()

const fetchData = async () => {
    let response = await req.request({
        url: 'tags', method: 'get', params: { size: 30 }
    })
    if (response.status == 200) {
        data.tags = response.data
    }
}
fetchData()
</script>
<template>
    <div class="wrapper" :class="{ noshadow : !props.showShadow }">
        <div class="tag-title"><h2>文章标签<span>Tags</span></h2></div>
        <div class="tags" @mouseleave="hideHoverBg($event)">
            <template v-for="(tag, index) in data.tags">
                <RouterLink :to="{ name: 'articles', query: { tag: tag.name } }">
                    <el-button v-if="(articleStore.store.tags.includes(tag.name))" type="success" @mouseenter="onHover($event)" @mouseleave="onLeave($event)" round>{{ tag.name }}({{ tag.count }})</el-button>
                    <el-button v-else type="info" @mouseenter="onHover($event)" @mouseleave="onLeave($event)" link>{{ tag.name }}({{ tag.count }})</el-button>
                </RouterLink>
            </template>
        </div>
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
    border-radius: 6px;
    background-color: var(--bg-color-primary);
}

.wrapper.noshadow {
    box-shadow: none !important;
}

.tags {
    padding: 1rem;
}
.tag-title {
    margin: 0 1rem;
    padding-top: 0.1px;
    border-bottom: 1px solid var(--el-border-color-light);
}
.tag-title>h2 {
    line-height: 2rem;
    font-weight: 400;
    color: var(--el-text-color-primary);
}
.tag-title>h2>span {
    color: var(--el-text-color-secondary);
    margin-left: .6rem;
    font-size: 0.8em;
}
.tags {
    margin-left: -.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    position: relative;
}

.tags>a {
    margin: 0 0 .5rem .5rem;
    z-index: 2;
}

h1, h2, h3 {
    color: var(--el-text-color-regular);
}

.tags::before {
    content: " ";
    position: absolute;
    z-index: 1;
    top: v-bind('hoverBg.Y');
    left: v-bind('hoverBg.X');
    width: v-bind('hoverBg.Width');
    height: v-bind('hoverBg.Height');
    display: block;
    border-radius: 16px;
    background-color: rgba(var(--el-color-info-rgb), .11);
    transition: all .3s cubic-bezier(.12,1.01,.66,1.09);
}

.el-button.c-green {
    color: rgba(var(--el-color-success-rgb), .95);
}
</style>