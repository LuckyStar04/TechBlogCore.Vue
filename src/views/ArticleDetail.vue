<script lang="ts" setup>
import req from '@/utils/request'
import { nextTick, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import type { ArticleDetail, Comment, NavItem } from '@/types'
import { useRoute } from 'vue-router'
import { parseMarkdown } from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css"
import { computed } from '@vue/reactivity'
import { parseDateTime } from '@/utils/dates'
import { EditPen } from '@element-plus/icons-vue'
import Comments from '@/components/Comments.vue'
import MakeComment from '@/components/MakeComment.vue'
import ArticleNavi from '@/components/ArticleNavi.vue'
import { useUserStore } from '@/stores/UserStore'
import { useArticleStore } from '@/stores/ArticleStore'

const route = useRoute()
const userStore = useUserStore()
const articleStore = useArticleStore()


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
    hasNav: false,
    expandNav: false,
    navItems: [] as Array<NavItem>,
})

const fetchData = async () => {
    if (!route.params.id) return
    data.isLoading = true
    let response = await req.request({
        url: `articles/${route.params.id}`, method: 'get',
    })
    if (response.status == 200) {
        data.article = response.data as ArticleDetail
        data.isLoading = false
        articleStore.store.category = response.data.category
        articleStore.store.tags = response.data.tags
        await nextTick()
        makeNav()
    }
}

const makeNav = async () => {
    let nav = document.querySelectorAll('.note-view *[id]') as NodeListOf<HTMLElement>
    if (nav.length <= 0) return
    let newItem : NavItem = { level: nav[0].tagName, id: nav[0].id, title: nav[0].innerText, children: [], parent: null }
    let oldItem = newItem
    for (let i = 0; i < nav.length; i++) {
        newItem = { level: nav[i].tagName, id: nav[i].id, title: nav[i].innerText, children: [], parent: null }
        if (newItem.level > oldItem.level) {
            newItem.parent = oldItem
            oldItem.children.push(newItem)
            oldItem = newItem
        } else if (newItem.level == oldItem.level) {
            if (oldItem.parent != null) {
                newItem.parent = oldItem.parent
                oldItem.parent.children.push(newItem)
            } else {
                data.navItems.push(newItem)
            }
            oldItem = newItem
        } else {
            let pointer : NavItem|null = oldItem
            while (pointer != null && pointer.level != newItem.level) {
                pointer = pointer.parent
            }
            if (pointer?.parent != null) {
                pointer?.parent.children.push(newItem)
            } else {
                data.navItems.push(newItem)
            }
            oldItem = newItem
        }
    }
    data.hasNav = true
    setTimeout(switchNav, 150)
}

const switchNav = () => {
    data.expandNav = !data.expandNav
}

const addComment = (comment: Comment) => {
    data.article.comments.push(comment)
}

const backTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

watch(() => route.params.id, fetchData)
onMounted(() => fetchData())
const noteHtml = computed(() => {
    if (!data.article.content) return ''
    return parseMarkdown(data.article.content)
})

</script>
<template>
    <div v-loading.fullscreen.lock="data.isLoading" class="wrapper">
        <Teleport to="#navi-article-title">
            <h1 style="cursor: pointer;" @click.stop="backTop">{{ data.article.title }}</h1>
        </Teleport>
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
        <div v-if="data.hasNav" class="navi-wrapper autohide-scrollbar" :class="{ shrink: !data.expandNav }">
            <div class="navi-title" @click.stop="switchNav"><font-awesome-icon icon="fa-solid fa-list-ul" class="more-emojis-icon" />&nbsp;&nbsp;文章目录</div>
            <ArticleNavi class="navi-body" :items="data.navItems"></ArticleNavi>
        </div>
    </div>
</template>
<style scoped>
.article-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
}

.article-title>h1{
    overflow: hidden;
    white-space: pre-line;
    text-overflow: ellipsis;
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
    height: 40px;
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

.navi-wrapper {
    position: fixed;
    top: 80px;
    z-index: 998;
    max-height: calc(100vh - 160px);
    overflow: auto;
    overflow-y: scroll;
    /* border-radius: 8px; */
    /* box-shadow: 0px 0px 12px rgba(0, 0, 0, .12); */
    margin: 50px 20px 20px;
    /* box-sizing: border-box; */
    transition: max-height 1s;
}

.navi-body {
    overflow: hidden;
}

.navi-wrapper.shrink {
    max-height: 0px;
    overflow: hidden;
}

.navi-wrapper > ul {
    padding-left: 4px;
}

.navi-title {
    position: fixed;
    top: 80px;
    margin: 19px 20px 10px;
    /* border-radius: 8px; */
    /* box-sizing: border-box; */
    background-color: white;
    color: var(--el-text-color-regular);
    cursor: pointer;
}

@media only screen and (min-width: 1440px) {
    .navi-wrapper {
        left: calc(5vw - 57px);
        width: calc(47vw - 575px);
    }

    .navi-title {
        left: calc(5vw - 57px);
        width: calc(47vw - 582px);
    }
}

@media only screen and (min-width: 1280px) and (max-width: 1440px) {
    .navi-wrapper {
        left: calc(4vw - 40px);
        width: calc(47vw - 470px);
    }

    .navi-title {
        left: calc(4vw - 40px);
        width: calc(47vw - 477px);
    }
}

@media only screen and (min-width: 768px) and (max-width: 1280px) {
    .navi-wrapper, .navi-title {
        display: none;
    }
}

@media only screen and (max-width: 768px) {
    .navi-wrapper, .navi-title {
        display: none;
    }
}
</style>