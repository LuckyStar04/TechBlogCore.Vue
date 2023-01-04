<script lang="ts" setup>
import req from '@/utils/request'
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import type { ArticleList, GroupedArticleList } from '@/types'
import { useArticleStore } from '@/stores/ArticleStore'

const articleStore = useArticleStore()

const data = reactive({
    articles: [] as Array<ArticleList>,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    pageNumber: 1,
    isLoading: true,
    groupedArticles: [] as Array<GroupedArticleList>,
})

let i = 0

const groupArticle = (articles: Array<ArticleList>) => {
    let g = [] as Array<GroupedArticleList>
    let p = -1
    for (let i = 0; i < articles.length; i++) {
        let articleYear = new Date(articles[i].createTime).getFullYear()
        if (g.length == 0 || g[p].year != articleYear) {
            g.push({ year: articleYear, articles: [articles[i]] })
            p++
        } else {
            g[p].articles.push(articles[i])
        }
    }
    return g
}

const fetchData = async () => {
    data.isLoading = true
    articleStore.store.category = ''
    articleStore.store.tags = []
    let response = await req.request({
        url: 'articles', method: 'get', params: { pageSize: data.pageSize, pageNumber: data.pageNumber }
    })
    if (response.status == 200) {
        i = 0 - data.articles.length
        data.articles = [...data.articles, ...response.data]
        let a = JSON.parse(response.headers['x-pagination'] as string)
        data.totalCount = a.totalCount
        data.currentPage = a.currentPage
        data.totalPages = a.totalPages
        data.isLoading = false
        data.groupedArticles = groupArticle(data.articles)
    }
}

watch(() => [data.pageNumber, data.pageSize], fetchData)

const handleScroll = () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const pageBottom = scrollTop + window.innerHeight
    const dividerBottom = document.querySelector('#divider-btm') as HTMLElement
    console.log(dividerBottom.offsetTop, pageBottom)
    if (dividerBottom.offsetTop < pageBottom && data.pageNumber < data.totalPages && !data.isLoading) {
        data.pageNumber++
    }
}

onMounted(() => {
    fetchData()
    window.addEventListener("scroll", handleScroll, false)
})

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll, false)
})

</script>

<template>
    <div v-loading.fullscreen="data.isLoading" class="wrapper">
        <div class="article-title">
            <h2>文章归档</h2>
        </div>
        <transition name="expand-top">
        <el-timeline v-show="data.groupedArticles.length > 0">
            <el-timeline-item v-for="group in data.groupedArticles" :key="group.year" :timestamp="group.year.toString()"
                type="primary" :hollow="true" size="large" placement="top">
                <div class="articles">
                    <div class="article" v-for="article in group.articles" :style="{ 'animation-delay': (i++ * 70 + 250) + 'ms' }">
                        <RouterLink :to="{ name: 'articleDetail', params: { id: article.id } }">{{ article.title }}
                        </RouterLink>
                    </div>
                </div>
            </el-timeline-item>
        </el-timeline>
        </transition>
        <el-divider id="divider-btm" v-if="data.pageNumber < data.totalPages">加载中…</el-divider>
        <el-divider id="divider-btm" v-else>已经到底啦</el-divider>
    </div>
</template>
<style scoped>
* {
    font-family: 'Trebuchet MS';
}

.expand-top-enter-active,
.expand-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: all 700ms cubic-bezier(.23,1.06,.7,.94);
  transform-origin: center top;
}

.expand-top-enter-from,
.expand-top-leave-active {
  opacity: 0;
  transform: scaleY(0);
}

.article-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.article-title>h2 {
    display: inline;
    line-height: 0;
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
    margin: 8px 0;
    opacity: 0;
    animation-name: showLeft;
    animation-duration: 1.8s;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(.09,1.13,.26,.98);
}

@keyframes showLeft {
    0% {
        transform: translateX(40%);
        opacity: 0;
    }

    100% {
        transform: none;
        opacity: 1;
    }
}

.article>a {
    text-decoration: none;
    font-size: 25px;
    color: var(--el-text-color-regular);
    display: block;
    transition: transform .6s;
    /* transition-timing-function: ease-out; */
    transform: none;
}

.article>a:hover {
    color: var(--el-text-color-secondary);
    transform: translateX(8px);
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

.el-timeline {
    padding: 1.6rem 1.6rem 0;
}

.el-timeline>>>.el-timeline-item__timestamp {
    font-size: var(--el-font-size-extra-large);
}

.el-timeline>>>.el-timeline-item__node--large {
    width: var(--el-font-size-extra-large);
    height: var(--el-font-size-extra-large);
    left: -5px;
}

.el-timeline>>>.el-timeline-item:last-child .el-timeline-item__tail {
    display: block;
}

.show-more {
    display: flex;
    justify-content: center;
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
    .el-timeline {
        padding: 1.6rem .8rem;
    }
    .articles {
        padding: 1rem 0;
    }
    .article>a {
        font-size: 20px;
    }
}

@media only screen and (max-width: 768px) {
    .el-timeline {
        padding: 1.6rem .8rem;
    }
    .articles {
        padding: 1rem 0;
    }
    .article>a {
        font-size: 20px;
    }
}
</style>