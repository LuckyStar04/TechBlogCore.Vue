<script lang="ts" setup>
import req from '@/utils/request'
import { reactive, watch } from 'vue';
import type { ArticleList } from '@/types'
import { useRoute } from 'vue-router'
import { parseDateTime } from '@/utils/dates'
import markdownToTxt from 'markdown-to-txt'
import { Plus } from '@element-plus/icons-vue'

const route = useRoute()

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
    data.isLoading = true
    let response = await req.request({
        url: 'articles', method: 'get', params: { tag: route.query.tag, category: route.query.category, keyword: route.query.keyword, pageSize: data.pageSize, pageNumber: data.pageNumber }
    })
    if (response.status == 200) {
        data.articles = response.data
        let a = JSON.parse(response.headers['x-pagination'] as string)
        data.totalCount = a.totalCount
        data.currentPage = a.currentPage
        data.totalPages = a.totalPages
        data.isLoading = false
    }
}

watch(() => route.query, fetchData)
watch(() => [data.pageNumber, data.pageSize], fetchData)

fetchData()

</script>

<template>
    <div v-loading.fullscreen="data.isLoading" class="wrapper">
        <div class="article-title">
            <h2 v-if="route.query.tag" class="color-success"># 标签：{{ route.query.tag }}</h2>
            <h2 v-else-if="route.query.category" class="color-primary"># 文章分类：{{ route.query.category }}</h2>
            <h2 v-else-if="route.query.keyword" class="color-purple"># 关键字搜索：{{route.query.keyword}}</h2>
            <h2 v-else>文章列表</h2>
            <RouterLink :to="{ name: 'createArticle' }"><el-button type="primary" plain :icon="Plus">创建文章</el-button></RouterLink>
        </div>
        <div class="articles">
            <div class="article" v-for="article in data.articles">
                <RouterLink :to="{ name: 'articleDetail', params: { id: article.id } }">{{ article.title }}</RouterLink>
                <br />
                <span class="create-time">{{ parseDateTime(article.createTime, true) }}</span> | <router-link
                    class="category" :to="{ name: 'articles', query: { category: article.category } }">
                    {{ article.category }}</router-link>
                <p class="content">{{ markdownToTxt(article.content) }}</p>
            </div>
            <el-pagination style="margin-top:10px;" layout="total, prev, pager, next" :total="data.totalCount" v-model:currentPage="data.pageNumber" />
        </div>
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
.article-title > h2 {
    display: inline;
    line-height: 0;
}

a {
    text-decoration: none;
}

h1, h2, h3 {
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

.article-title, .articles {
    padding: 1rem;
}
.article-title {
    border-bottom: 1px solid var(--el-border-color-light);
}
.article {
    border-bottom: 1px solid var(--el-border-color-light);
    margin-top: .6rem;
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