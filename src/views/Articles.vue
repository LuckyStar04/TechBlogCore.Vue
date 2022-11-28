<script lang="ts" setup>
import req from '@/utils/request'
import { reactive, watch } from 'vue';
import type { ArticleList, TagModel, CategoryModel } from '../types/index'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import { parseDateTime } from '@/utils/dates'

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
        url: 'articles', method: 'get', params: { tag: route.query.tag, category: route.query.category, pageSize: data.pageSize, pageNumber: data.pageNumber }
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
    <div v-loading.fullscreen="data.isLoading">
        <h1 v-if="route.query.tag">文章标签：{{ route.query.tag }}</h1>
        <h1 v-else-if="route.query.category">文章分类：{{ route.query.category }}</h1>
        <h1 v-else>文章列表</h1>
        <div class="article" v-for="article in data.articles">
            <RouterLink :to="{ name: 'articleDetail', params: { id: article.id } }">
                <h3>{{ article.title }}</h3>
            </RouterLink>
            <p>{{ article.content }}</p>
            <span>创建时间：{{ parseDateTime(article.createTime, true) }} 阅读人数({{ article.viewCount }}) 评论({{ article.commentCount }})</span>
        </div>
        <hr />
        <el-pagination layout="prev, pager, next" :total="data.totalCount" v-model:currentPage="data.pageNumber" />
    </div>
</template>
<style scoped>
.article > a {
    text-decoration: none;
}
</style>