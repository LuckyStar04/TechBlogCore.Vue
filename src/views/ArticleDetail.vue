<script lang="ts" setup>
import req from '@/utils/request'
import { nextTick, onMounted, reactive, watch } from 'vue'
import type { ArticleDetail, Comment, NavItem } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { parseMarkdown } from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css"
import { computed } from '@vue/reactivity'
import { parseDateTime } from '@/utils/dates'
import { EditPen, Calendar, Histogram, Reading, Clock, TakeawayBox, PriceTag, Comment as CommentIcon } from '@element-plus/icons-vue'
import Comments from '@/components/Comments.vue'
import MakeComment from '@/components/MakeComment.vue'
import ArticleNavi from '@/components/ArticleNavi.vue'
import ModalCarousel from '@/components/ModalCarousel.vue'
import { useUserStore } from '@/stores/UserStore'
import { useArticleStore } from '@/stores/ArticleStore'

const route = useRoute()
const router = useRouter()
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
    navDrawer: false,
    showModal: false,
    pics: [] as Array<HTMLElement>,
    currPic: 0,
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
        setImageModal()
    }
}

const makeNav = async () => {
    let nav = document.querySelectorAll('.note-view h1[id],.note-view h2[id],.note-view h3[id],.note-view h4[id],.note-view h5[id],.note-view h6[id]') as NodeListOf<HTMLElement>
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

let imgs: Array<HTMLElement> = []
let canGoBack = false

const setImageModal = () => {
    imgs = [...document.querySelectorAll('.note-view img') as NodeListOf<HTMLElement>]
    data.pics = imgs
    imgs.forEach((e, i) => {
        e.onclick = function () {
            canGoBack = true
            router.push({ name: 'articleDetail', params: { id: route.params.id }, hash: `#${e.id}` })
        }
    })
    handleModal()
}

const handleModal = () => {
    if (!route.hash.startsWith('#img-')) {
        data.showModal = false
        return
    }
    const img = document.querySelector(route.hash) as HTMLElement
    if (!img) {
        data.showModal = false
        return
    }
    let i = imgs.indexOf(img)
    if (i < 0) {
        data.showModal = false
        return
    }
    data.currPic = i
    data.showModal = true
}

watch(() => route.hash, handleModal)

const switchNav = () => {
    data.expandNav = !data.expandNav
}

const switchNavDrawer = () => {
    data.navDrawer = !data.navDrawer
}

const closeNavDrawer = () => {
    data.navDrawer = false
}

const closeModal = () => {
    data.showModal = false
    if (route.hash) {
        if (canGoBack) {
            canGoBack = false
            router.back()
        } else {
            router.replace({ name: 'articleDetail', params: { id: route.params.id }})
        }
    }
}

const addComment = (comment: Comment) => {
    data.article.comments.push(comment)
}

const backTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

const calcLength = (length: number): string => {
    if (length < 1000) return length.toString()
    if (length < 1000000) return (length / 1000).toFixed(1) + 'k'
    return (length / 1000000).toFixed(1) + 'm'
}

const calcReadMinutes = (length: number): string => {
    return (length / 900).toFixed(0)
}

watch(() => route.params.id, fetchData)
watch(() => route.hash, closeNavDrawer)
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
        <ModalCarousel :show="data.showModal" :pic-items="data.pics" :current="data.currPic" @hide="closeModal"></ModalCarousel>
        <div class="article-title">
            <h1>{{ data.article.title }}</h1>
            <RouterLink v-if="userStore.info.role=='Admin'" :to="{ name: 'editArticle', params: { id: route.params.id } }"><el-button type="primary" plain :icon="EditPen">编辑文章</el-button></RouterLink>
        </div>
        <div class="meta">
            <span><el-icon><Calendar /></el-icon> {{ parseDateTime(data.article.createTime, true) }}</span>
            <span><RouterLink :to="{ name: 'articles', query: { category: data.article.category } }"><el-icon><TakeawayBox /></el-icon> {{data.article.category}}</RouterLink></span>
            <br />
            <span><el-icon><Reading /></el-icon> {{ data.article.viewCount }} 次阅读</span>
            <span><el-icon><CommentIcon /></el-icon> {{ data.article.comments.length }} 条评论</span>
            <br />
            <span><el-icon><Histogram /></el-icon> {{ calcLength(data.article.content.length) }} 字</span>
            <span><el-icon><Clock /></el-icon> {{ calcReadMinutes(data.article.content.length) }} 分钟</span>
        </div>
        <div class="articles">
            <div class="note-view" v-html="noteHtml"></div>
            <div class="category">
                <span><RouterLink :to="{ name: 'articles', query: { category: data.article.category } }"><el-icon><TakeawayBox /></el-icon> {{ data.article.category }}</RouterLink></span>
                <span v-for="tag in data.article.tags"><RouterLink :to="{ name: 'articles', query: { tag: tag } }"><el-icon><PriceTag /></el-icon> {{ tag }}</RouterLink></span>
            </div>
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
        <template v-if="data.hasNav">
            <div class="navi-wrapper autohide-scrollbar" :class="{ shrink: !data.expandNav }">
                <div class="navi-title" @click.stop="switchNav"><font-awesome-icon icon="fa-solid fa-list-ul" class="more-emojis-icon" />&nbsp;&nbsp;文章目录&nbsp;&nbsp;<font-awesome-icon icon="fa-solid fa-angle-down" /></div>
                <ArticleNavi class="navi-body" :items="data.navItems"></ArticleNavi>
            </div>
            <div class="navi-drawer-button" @click.stop="switchNavDrawer"><font-awesome-icon icon="fa-solid fa-list-ul" class="more-emojis-icon" />&nbsp;目录</div>
            <el-drawer class="navi-drawer" v-model="data.navDrawer" title="侧边目录" direction="ltr" :with-header="false" size="70%"
                :close-on-click-modal="true">
                <div class="drawer-wrapper">
                    <div class="drawer-title"><font-awesome-icon icon="fa-solid fa-list-ul" class="more-emojis-icon" />&nbsp;&nbsp;文章目录</div>
                    <ArticleNavi class="navi-body" :items="data.navItems"></ArticleNavi>
                </div>
            </el-drawer>
        </template>
    </div>
</template>
<style scoped>
.note-view :deep(.img-flex) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.note-view :deep(.img-flex>img) {
    cursor: pointer;
}

.note-view :deep(.img-flex>p) {
    font-family: var(--el-font-family);
    font-size: var(--el-font-size-small);
    font-style: italic;
}

@keyframes enlarge-anime {
    0% {
        transform: scale(.6);
    }

    100% {
        transform: scale(1);
    }
}

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
    width: calc(100% - 400px);
    border-radius: 6px;
    background-color: var(--bg-color-primary);
    box-shadow: var(--content-shadow);
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

.meta {
    padding: 1rem;
    color: #8590a6;
    border-bottom: 1px solid var(--el-border-color-light);
}

.meta a {
    color: #8590a6;
}

.meta a:hover {
    color: #bfc8d9;
}

.category {
    padding: 1.6rem 0 1.6rem;
    color: var(--el-text-color-regular);
    font-size: 1.1em;
    border-bottom: 1px solid var(--el-border-color-light);
}

.category a {
    color: var(--el-text-color-regular);
}

.category a:hover {
    color: var(--el-text-color-secondary);
}

.meta span, .category span {
    line-height: 1.6rem;
    white-space: nowrap;
}

.meta span + span, .category span + span {
    margin-left: 1rem;
}

.meta .el-icon, .category .el-icon {
    position: relative;
    top: 1px;
}

.comment-title {
    font-weight: 700;
    font-size: var(--el-font-size-large);
    color: var(--el-text-color-primary);
    line-height: 0;
    padding: 15px 0 0 0;
    /* border-bottom: 1px solid var(--el-border-color-light); */
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

.fa-angle-down {
    transition: transform .5s;
}

.navi-wrapper.shrink .fa-angle-down {
    transform: rotateZ(-90deg);
}

.navi-wrapper > ul,
.drawer-wrapper > ul {
    padding-left: 4px;
}

:deep(.el-drawer__body) {
    padding: .2rem !important;
}

.navi-title {
    position: fixed;
    top: 80px;
    margin: 19px 20px 10px;
    /* border-radius: 8px; */
    /* box-sizing: border-box; */
    background-color: var(--bg-color-secondary);
    color: var(--el-text-color-regular);
    cursor: pointer;
}

.navi-drawer-button {
    position: fixed;
    bottom: 30px;
    left: 0px;
    color: var(--el-text-color-regular);
    writing-mode: vertical-rl;
    letter-spacing: 5px;
    background-color: var(--el-bg-color);
    padding: 5px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 0 6px 6px 0;
    vertical-align: middle;
    cursor: pointer;
}

.drawer-wrapper {
    margin: 30px;
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

    .navi-drawer-button {
        display: none;
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
    
    .navi-drawer-button {
        display: none;
    }
}

@media only screen and (min-width: 768px) and (max-width: 1280px) {
    .navi-wrapper, .navi-title {
        display: none;
    }

    .navi-drawer-button {
        display: block;
    }
}

@media only screen and (max-width: 768px) {
    .navi-wrapper, .navi-title {
        display: none;
    }

    .navi-drawer-button {
        display: block;
    }
}
</style>