<script lang="ts" setup>
import req from '@/utils/request'
import { reactive, watch } from 'vue';
import type { ArticleList, GroupedArticleList } from '@/types'

const data = reactive({
    articles: [] as Array<ArticleList>,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    pageNumber: 1,
    isLoading: true,
    groupedArticles: [] as Array<GroupedArticleList>,
})

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
    let response = await req.request({
        url: 'articles', method: 'get', params: { pageSize: data.pageSize, pageNumber: data.pageNumber }
    })
    if (response.status == 200) {
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

fetchData()

</script>

<template>
    <div v-loading.fullscreen="data.isLoading" class="wrapper">
        <div class="article-title">
            <h2>文章归档</h2>
        </div>
        <el-timeline>
            <el-timeline-item v-for="group in data.groupedArticles" :key="group.year" :timestamp="group.year.toString()"
                type="primary" :hollow="true" size="large" placement="top">
                <div class="articles">
                    <div class="article" v-for="article in group.articles">
                        <RouterLink :to="{ name: 'articleDetail', params: { id: article.id } }">{{ article.title }}
                        </RouterLink>
                    </div>
                </div>
            </el-timeline-item>
        </el-timeline>
        <el-divider v-if="data.pageNumber < data.totalPages"><el-button @click="data.pageNumber++"
                link>查看更多</el-button></el-divider>
        <el-divider v-else>已经到底啦</el-divider>
    </div>
</template>
<style scoped>
* {
    font-family: 'Trebuchet MS';
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
}

.article>a {
    text-decoration: none;
    font-size: 25px;
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