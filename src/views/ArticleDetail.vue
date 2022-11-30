<script lang="ts" setup>
import req from '@/utils/request'
import { watchEffect, reactive, ref, watch } from 'vue';
import type { ArticleParam, ArticleList, TagModel, CategoryModel, ArticleDetail } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import marked from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css";
import { computed } from '@vue/reactivity'
import { parseDateTime } from '@/utils/dates'

const route = useRoute()


const data = reactive({
    article: {
        id: 0,
        title: '',
        content: '',
        category: '',
        state: 1,
        viewCount: 1,
        createTime: new Date(),
        modifyTime: new Date(),
        tags: [],
        comments: [],
    } as ArticleDetail,
    isLoading: true,
})

const fetchData = async () => {
    data.isLoading = true
    let response = await req.request({
        url: `articles/${route.params.id}`, method: 'get',
    })
    if (response.status == 200) {
        data.article = response.data as ArticleDetail
        data.isLoading = false
    }
}

watch(() => route.params.id, fetchData)
fetchData()
const noteHtml = computed(() => {
    if (!data.article.content) return ''
    return marked.parse(data.article.content)
})

</script>
<template>
    <div v-loading.fullscreen="data.isLoading" class="wrapper">
        <div class="article-title">
            <h1>{{ data.article.title }}</h1>
        </div>
        <div class="meta-info">
            <div class="subtitle">
                分类 - <RouterLink :to="{ name: 'articles', query: { category: data.article.category } }">{{
                        data.article.category
                }}</RouterLink>
                <br />
                <span v-if="data.article.modifyTime != data.article.createTime">修改于
                    {{ parseDateTime(data.article.modifyTime, true) }}</span>
                <span v-else>创建于 {{ parseDateTime(data.article.createTime, true) }}</span>
                <span>{{ data.article.viewCount }} 人阅读</span>
            </div>
            <div class="tags">
                <RouterLink v-for="(tag, index) in data.article.tags" :to="{ name: 'articles', query: { tag: tag } }">
                    <el-tag :key="tag" class="mx-1">{{ tag }}</el-tag>
                </RouterLink>
            </div>
        </div>
        <div class="articles">
            <div class="note-view" v-html="noteHtml"></div>
            <h2>评论</h2>
            <hr />
            <div class="comments">
                <template v-if="data.article.comments.length > 0">
                    <div v-for="comment in data.article.comments">
                        <div>{{ comment.userName }}</div>
                        <div>{{ comment.content }}</div>
                        <div v-if="comment.modifyTime">修改时间：{{ comment.modifyTime }}</div>
                        <div v-else>评论时间：{{ comment.commentTime }}</div>
                        <div class="children-comments">
                            <div v-for="child in comment.children">
                                <div>{{ child.userName }}</div>
                                <div>{{ child.content }}</div>
                                <div v-if="child.modifyTime">修改时间：{{ child.modifyTime }}</div>
                                <div v-else>评论时间：{{ child.commentTime }}</div>
                            </div>
                        </div>
                    </div>
                </template>
                <p v-else>没有评论哦，快来坐沙发吧~</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.article-title, .meta-info {
    font-family: 'Trebuchet MS';
}
a {
    text-decoration: none !important;
}

.wrapper {
    margin: .5rem;
}
.article-title, .articles {
    padding: 1rem;
}
.article-title>h1{
    line-height: 0;
}
.article-title {
    border-bottom: 1px solid var(--el-border-color-light);
}
.meta-info {
    padding: 1rem;
    border-bottom: 1px solid var(--el-border-color-light);
}
.meta-info a {
    color: var(--el-text-color-regular);
}
.meta-info a:hover {
    color: var(--el-text-color-secondary);
}
.subtitle {
    margin-bottom: 1rem;
    color: #8590a6;
}
.subtitle>span {
    margin-right: 1rem;
}

.tags {
    display: flex;
    flex-wrap: wrap;
}

.tags>a {
    margin: 0 .5rem .5rem 0;
}

/* @media only screen and (max-width: 768px) {
    .wrapper {
        height: calc(100vh - 5rem);
        overflow: auto;
        overflow-y: scroll;
        padding: 1rem 1.5rem 0 1.5rem;
    }
} */
</style>