<script lang="ts" setup>
import req from '@/utils/request'
import { reactive, watch } from 'vue';
import type { ArticleList, TagModel, CategoryModel } from '../types/index'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import { parseDateTime } from '@/utils/dates'
import markdownToTxt from 'markdown-to-txt'

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

h1, h2, h3 {
    color: var(--el-text-color-regular);
}

.color-success {
    color: var(--el-color-success);
}

.color-primary {
    color: var(--el-text-color-primary);
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
.article-title>h2{
    line-height: 0;
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
    /* height: calc(100vh - 5rem); */
    margin: .5rem;
    /* box-shadow: 0 1px 3px hsl(0deg 0% 7% / 10%);
    border-radius: 5px; */
}

/* .wrapper::-webkit-scrollbar {
    width: 6px;
}

.wrapper::-webkit-scrollbar-thumb {
    background-color: #0003;
    border-radius: 10px;
    transition: all .2s ease-in-out;
}

.wrapper::-webkit-scrollbar-track {
    border-radius: 10px;
} */

/* @media only screen and (max-width: 768px) {
    .wrapper {
        height: calc(100vh - 8rem);
        overflow: auto;
        overflow-y: scroll;
        padding: 1rem 1.5rem 0 1.5rem;
    }
} */
</style>