<script lang="ts" setup>
import req from '@/utils/request'
import { reactive, watch } from 'vue';
import type { ArticleDetail, Comment } from '@/types'
import { useRoute } from 'vue-router'
import marked from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css";
import { computed } from '@vue/reactivity'
import { parseDateTime } from '@/utils/dates'
import { EditPen } from '@element-plus/icons-vue'
import Comments from '@/components/Comments.vue'
import MakeComment from '@/components/MakeComment.vue'
import { useUserStore } from '@/stores/UserStore'

const route = useRoute()
const userStore = useUserStore()


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

const addComment = (comment: Comment) => {
    data.article.comments.push(comment)
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
            <RouterLink v-if="userStore.info.role=='Admin'" :to="{ name: 'editArticle', params: { id: route.params.id } }"><el-button type="primary" plain :icon="EditPen">编辑文章</el-button></RouterLink>
        </div>
        <table class="meta-table">
            <tbody>
                <tr>
                    <td>分类</td><td><RouterLink :to="{ name: 'articles', query: { category: data.article.category } }">{{data.article.category}}</RouterLink></td>
                </tr>
                <tr>
                    <td>创建于</td><td>{{ parseDateTime(data.article.createTime, true) }}&nbsp;&nbsp;&nbsp;&nbsp;{{ data.article.viewCount }} 人阅读</td>
                </tr>
                <tr>
                    <td>标签</td><td><div class="tags">
                <RouterLink v-for="(tag, index) in data.article.tags" :to="{ name: 'articles', query: { tag: tag } }">
                    <el-tag :key="tag" class="mx-1">{{ tag }}</el-tag>
                </RouterLink>
            </div></td>
                </tr>
            </tbody>
        </table>
        <div class="articles">
            <div class="note-view" v-html="noteHtml"></div>
            <div class="make-comment">
                <div class="make-comment-avatar">
                    <img class="avatar" :src="userStore.info.avatar" />
                </div>
                <MakeComment placeholder="期待您的更多见解 :)" :article-id="route.params.id.toString()" @comment-success="addComment"></MakeComment>
            </div>
            <p class="comment-title">{{data.article.comments.length}} 条评论</p>
            <div class="comment-body">
                <Comments v-if="(data.article.comments.length > 0)" :comments="data.article.comments"></Comments>
                <el-empty description="快来坐沙发吧~" :image-size="200" v-else style="height: 380px;padding-top: 0;"></el-empty>
            </div>
        </div>
    </div>
</template>
<style scoped>
.article-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.article-title, .meta-table {
    font-family: 'Trebuchet MS';
}
a {
    text-decoration: none !important;
}

.wrapper {
    margin: .5rem;
    width: calc(100% - 400px);
}
.article-title, .articles {
    padding: 1rem;
}
.article-title>h1{
    display: inline-block;
    margin: 0;
}
.article-title {
    border-bottom: 1px solid var(--el-border-color-light);
}
.meta-table {
    width: 100%;
    color: #8590a6;
    padding: 1rem;
    border-bottom: 1px solid var(--el-border-color-light);
}
.meta-table a {
    color: var(--el-text-color-regular);
}
.meta-table td {
    text-align: left;
    vertical-align: middle;
}
.meta-table a:hover {
    color: var(--el-text-color-secondary);
}
.meta-table tr>td:first-child {
    width: 60px;
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
    margin: 0 .5rem 0 0;
}

.comment-title {
    font-weight: 600;
    font-size: var(--el-font-size-large);
    color: var(--el-text-color-regular);
    line-height: 0;
    padding: 15px 0 30px 0;
    border-bottom: 1px solid var(--el-border-color-light);
}

.make-comment {
    padding-top: 30px;
    display: flex;
    align-items: flex-start;
}

.make-comment-avatar {
    display: inline-block;
    width: 57px;
}
.make-comment-avatar>img {
    width: 48px;
    border-radius: 5px;
}
.comment-body {
    min-height: 300px;
}
</style>