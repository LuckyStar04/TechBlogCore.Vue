<script lang="ts" setup>
import req from '@/utils/request'
import { nextTick, onMounted, onUnmounted, reactive, watch } from 'vue'
import type { ArticleList } from '@/types'
import { useRoute, useRouter, type RouteRecordName } from 'vue-router'
import { parseDateTime } from '@/utils/dates'
import markdownToTxt from 'markdown-to-txt'
import { Plus, Calendar, TakeawayBox } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/UserStore'
import { useArticleStore } from '@/stores/ArticleStore'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const data = reactive({
    articles: [] as Array<ArticleList>,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    pageNumber: 1,
    isLoading: true,
})

const fetchData = async () => {
    if (route.name != 'articles') return
    articleStore.store.category = route.query.category ? route.query.category as string : ''
    articleStore.store.tags = route.query.tag ? [route.query.tag as string] : []
    data.isLoading = true
    if (route.query.page && route.query.page != '1') {
        data.pageNumber = parseInt(route.query.page.toString())
    }
    let response = await req.request({
        url: 'articles', method: 'get', params: { tag: route.query.tag, category: route.query.category, keyword: route.query.keyword, pageSize: data.pageSize, pageNumber: route.query.page ?? 1 }
    })
    if (response.status == 200) {
        data.articles = response.data
        let a = JSON.parse(response.headers['x-pagination'] as string)
        data.totalCount = a.totalCount
        data.currentPage = a.currentPage
        data.totalPages = a.totalPages
        data.isLoading = false
        nextTick(() => {
            handleScroll()
        })
    }
}

const changePage = () => {
    if (!route.query.page && data.pageNumber == 1) return
    router.replace({ name: route.name as RouteRecordName | undefined, query: { ...route.query, page: data.pageNumber } })
}

watch(() => route.query, fetchData)

const handleScroll = () => {
    // const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const pageBottom = window.innerHeight// + scrollTop
    document.querySelectorAll('.article.visible').forEach(function (e) {
        let element = e as HTMLElement
        if (element.getBoundingClientRect().top >= pageBottom) {
            element.classList.remove('visible')
            for (let i = 0; i < element.classList.length; i++) {
                let className = element.classList[i]
                if (className.startsWith('delay-'))
                    element.classList.remove(className)
            }
            element.classList.add('hidden')
        }
    })
    let i = 1
    document.querySelectorAll('.article.hidden').forEach(function (e) {
        let element = e as HTMLElement
        if (element.getBoundingClientRect().top < pageBottom) {
            element.classList.remove('hidden')
            element.classList.add('visible')
            element.classList.add('delay-' + i)
            i++
        }
    })
}

let timer : number|null = null
const wrapScroll = () => {
    if (timer !== null) {
        clearTimeout(timer)
    }
    timer = setTimeout(handleScroll, 20)
}

watch(() => userStore.info.user, () => {
    nextTick(() => {
        handleScroll()
    })
})

let key = 1

onMounted(() => {
    fetchData()
    window.addEventListener("scroll", wrapScroll, false)
    window.addEventListener("resize", handleScroll, false)
})

onUnmounted(() => {
    window.removeEventListener("scroll", wrapScroll, false)
    window.removeEventListener("resize", handleScroll, false)
})

// const onMouseEnter = (e: MouseEvent) => {
//     let ele: HTMLElement = e.target as HTMLElement
//     if (ele.classList.contains('wrapper')) {
//         ele.classList.add('hovered')
//     }
// }

// const onMouseLeave = (e: MouseEvent) => {
//     let ele: HTMLElement = e.target as HTMLElement
//     if (ele.classList.contains('wrapper')) {
//         ele.classList.remove('hovered')
//     }
// }
</script>

<template>
    <div v-loading="data.isLoading" class="wrapper">
        <div class="article-title">
            <h2 v-if="route.query.tag" class="color-success fw-600"># 标签：{{ route.query.tag }}</h2>
            <h2 v-else-if="route.query.category" class="color-primary fw-600"># 文章分类：{{ route.query.category }}</h2>
            <h2 v-else-if="route.query.keyword" class="color-purple fw-600"># 关键字搜索：{{ route.query.keyword }}</h2>
            <h2 v-else>文章列表<span>Blog Articles</span></h2>
            <RouterLink v-if="userStore.info.role == 'Admin'" :to="{ name: 'createArticle' }"><el-button type="primary"
                    plain :icon="Plus">创建文章</el-button></RouterLink>
        </div>
        <div class="articles">
            <div v-for="article in data.articles" class="article hidden" :key="key++">
                <RouterLink class="article-link" :to="{ name: 'articleDetail', params: { id: article.id } }">{{ article.title }}</RouterLink>
                <br />
                <div class="article-meta">
                    <span class="create-time"><el-icon><Calendar /></el-icon> {{ parseDateTime(article.createTime, true) }}</span>
                    <router-link class="category" :to="{ name: 'articles', query: { category: article.category } }"><el-icon><TakeawayBox /></el-icon> {{ article.category }}</router-link>
                </div>
                <p class="content">{{ markdownToTxt(article.content) }}</p>
            </div>
            <el-pagination style="margin-top:10px;" layout="total, prev, pager, next" :total="data.totalCount"
                v-model:currentPage="data.pageNumber" @update:current-page="changePage" />
        </div>
    </div>
</template>
<style scoped>
* {
    font-family: 'Trebuchet MS';
}

.wrapper {
    border-radius: 12px;
    background-color: var(--bg-color-primary);
}

.article-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    margin: 0 1rem;
}

.article-title>h2 {
    display: inline-block;
    line-height: 2rem;
    overflow-wrap: normal;
    overflow: hidden;
    white-space: pre-line;
    text-overflow: ellipsis;
    font-weight: 400;
    color: var(--el-text-color-primary);
}

.article-title>h2.fw-600 {
    font-weight: 600;
}

.article-title>h2>span {
    color: var(--el-text-color-secondary);
    margin-left: .6rem;
    font-size: 0.8em;
}

a {
    text-decoration: none;
}

h1,
h2,
h3 {
    color: var(--el-text-color-regular);
}

.article-title>h2.color-success {
    color: var(--el-color-success);
}

.article-title>h2.color-primary {
    color: var(--el-color-primary);
}

.article-title>h2.color-purple {
    color: #626aef;
}

.articles {
    padding: 0 1rem 1rem;
}

.article-title {
    border-bottom: 1px solid var(--el-border-color-light);
}

.article {
    /* border-bottom: 1px solid var(--el-border-color-light); */
    margin: 1.6rem 0 3rem;
    opacity: 0;
}

.article.visible {
    animation-name: showUp;
    animation-duration: 1.8s;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(.15, 1.05, .02, .99);
}

@keyframes showUp {
    0% {
        transform: translateY(300px);
        opacity: 0;
    }

    100% {
        transform: none;
        opacity: 1;
    }
}

.delay-1 {
    animation-delay: 100ms;
}

.delay-2 {
    animation-delay: 200ms;
}

.delay-3 {
    animation-delay: 300ms;
}

.delay-4 {
    animation-delay: 400ms;
}

.delay-5 {
    animation-delay: 500ms;
}

.delay-6 {
    animation-delay: 600ms;
}

.delay-7 {
    animation-delay: 700ms;
}

.delay-8 {
    animation-delay: 800ms;
}

.delay-9 {
    animation-delay: 900ms;
}

.delay-10 {
    animation-delay: 1000ms;
}

.article a {
    text-decoration: none;
    color: var(--el-text-color-primary);
}

.article a.article-link {
    display: inline-block;
    font-size: 1.6rem;
    transform: translate(0px);
    transition: all .3s ease;
}

.article a.article-link:hover {
    color: var(--el-text-color-regular);
    transform: translate(4px, 0px);
    /* text-shadow: -4px 0 3px var(--el-color-primary-light-8); */
    text-shadow: -4px 0 3px var(--el-color-info-light-7);
}

.create-time {
    color: var(--el-text-color-regular);
}

.create-time .el-icon {
    position: relative;
    top: 2px;
}

.category {
    margin-left: 1rem;
}

.category .el-icon {
    position: relative;
    top: 2px;
}

.article-meta {
    font-size: 1rem;
    margin: .16rem 0 1rem;
}

.content {
    margin: 1rem 0 1.5rem;
    color: var(--el-text-color-secondary);
    line-height: 1.3rem;
    max-height: 3.9rem;
    overflow: hidden;
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
    .article-link {
        font-size: 1.6rem;
    }
}

@media only screen and (max-width: 768px) {
    .article-title {
        min-height: 1rem;
    }
    .article-title>h2 {
        font-size: 1.35rem;
    }

    .article-link {
        font-size: 1.5rem;
    }
}
</style>