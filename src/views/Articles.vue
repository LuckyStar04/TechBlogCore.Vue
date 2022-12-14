<script lang="ts" setup>
import req from '@/utils/request'
import { nextTick, onMounted, onUnmounted, reactive, watch } from 'vue'
import type { ArticleList } from '@/types'
import { useRoute, useRouter, type RouteRecordName } from 'vue-router'
import { parseDateTime } from '@/utils/dates'
import markdownToTxt from 'markdown-to-txt'
import { Plus } from '@element-plus/icons-vue'
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
    data.isLoading = true
    if (route.query.page && route.query.page != '1') {
        data.pageNumber = parseInt(route.query.page.toString())
    }
    let response = await req.request({
        url: 'articles', method: 'get', params: { tag: route.query.tag, category: route.query.category, keyword: route.query.keyword, pageSize: data.pageSize, pageNumber: route.query.page??1 }
    })
    if (response.status == 200) {
        data.articles = response.data
        let a = JSON.parse(response.headers['x-pagination'] as string)
        data.totalCount = a.totalCount
        data.currentPage = a.currentPage
        data.totalPages = a.totalPages
        data.isLoading = false
        articleStore.store.category = route.query.category ? route.query.category as string : ''
        articleStore.store.tags = route.query.tag ? [ route.query.tag as string ] : []
        nextTick(() => {
            handleScroll()
        })
    }
}

const changePage = () => {
    if (!route.query.page && data.pageNumber == 1) return
    router.replace({ name: route.name as RouteRecordName|undefined, query: { ...route.query, page: data.pageNumber }})
}

watch(() => route.query, fetchData)

const handleScroll = () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const pageBottom = scrollTop + window.innerHeight
    document.querySelectorAll('.article.visible').forEach(function (e) {
        let element = e as HTMLElement
        if (element.offsetTop >= pageBottom) {
            element.classList.remove('visible')
            element.classList.add('hidden')
        }
    })
    let i = 1
    document.querySelectorAll('.article.hidden').forEach(function (e) {
        let element = e as HTMLElement
        if (element.offsetTop < pageBottom) {
            element.classList.remove('hidden')
            element.classList.add('visible')
            element.classList.add('delay-' + i)
            i++
        }
    })
}

let key = 1

onMounted(() => {
    fetchData()
    window.addEventListener("scroll", handleScroll, false)
})

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll, false)
})
</script>

<template>
    <div v-loading.fullscreen.lock="data.isLoading" class="wrapper">
        <div class="article-title">
            <h2 v-if="route.query.tag" class="color-success"># ?????????{{ route.query.tag }}</h2>
            <h2 v-else-if="route.query.category" class="color-primary"># ???????????????{{ route.query.category }}</h2>
            <h2 v-else-if="route.query.keyword" class="color-purple"># ??????????????????{{ route.query.keyword }}</h2>
            <h2 v-else>????????????</h2>
            <RouterLink v-if="userStore.info.role == 'Admin'" :to="{ name: 'createArticle' }"><el-button type="primary"
                    plain :icon="Plus">????????????</el-button></RouterLink>
        </div>
        <div class="articles">
            <div v-for="article in data.articles" class="article hidden" :key="key++">
                <RouterLink :to="{ name: 'articleDetail', params: { id: article.id } }">{{ article.title }}</RouterLink>
                <br />
                <span class="create-time">{{ parseDateTime(article.createTime, true) }}</span> | <router-link
                    class="category" :to="{ name: 'articles', query: { category: article.category } }">
                    {{ article.category }}</router-link>
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

.article-title {
    min-height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
}

.article-title>h2 {
    display: inline-block;
    /* line-height: 0; */
    margin: 0;
    overflow-wrap: normal;
    overflow: hidden;
    white-space: pre-line;
    text-overflow: ellipsis;
}

a {
    text-decoration: none;
}

h1,
h2,
h3 {
    color: var(--el-text-color-regular);
}

.color-success {
    color: var(--el-color-success);
}

.color-primary {
    color: var(--el-color-primary);
}

.color-purple {
    color: #626aef;
}

.article-title,
.articles {
    padding: 1rem;
}

.article-title {
    border-bottom: 1px solid var(--el-border-color-light);
}

.article {
    border-bottom: 1px solid var(--el-border-color-light);
    margin-top: .6rem;
    opacity: 0;
}

.article.visible {
    animation-name: showUp;
    animation-duration: 1.8s;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(.15,1.05,.02,.99);
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

.article>a {
    text-decoration: none;
    font-size: 2rem;
    color: var(--el-text-color-regular);
}

.article>a:hover {
    color: var(--el-text-color-secondary);
}

.create-time {
    font-size: .9rem;
    color: var(--el-text-color-regular);
}

.content {
    margin: 1.5rem 0;
    color: var(--el-text-color-secondary);
}

.category {
    font-size: 1.02rem !important;
    cursor: pointer;
}

.wrapper {
    margin: .5rem;
}
</style>