<script lang="ts" setup>
import req from '@/utils/request'
import { watchEffect, reactive, ref, watch } from 'vue';
import type { ArticleParam, ArticleList, TagModel, CategoryModel, ArticleDetail } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import marked from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css";
import "/src/assets/marked.css"
import { computed } from '@vue/reactivity'

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
    <div>
        <h1>{{ data.article.title }}</h1>
        <p>
            <span>分类：{{ data.article.category }}</span>
            <span>创建时间：{{ data.article.createTime }}</span>
            <span>阅读人数：{{ data.article.viewCount }}</span>
        </p>
        <hr />
        <div class="tags">
            <RouterLink v-for="(tag, index) in data.article.tags" :to="{ name: 'articles', query: { tag: tag } }">
                <el-tag :key="tag" class="mx-1">{{ tag }}</el-tag>
            </RouterLink>
        </div>
        <hr />
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
</template>
<style scoped>
a {
    text-decoration: none !important;
}

.tags {
    display: flex;
    flex-wrap: wrap;
}

.tags>a {
    margin: 0 .5rem .5rem 0;
}
</style>