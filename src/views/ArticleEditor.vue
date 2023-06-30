<script lang="ts" setup>
import req from '@/utils/request'
import { getNow } from '@/utils/dates'
import type { ArticleEdit } from '@/types'
import { onBeforeMount, onBeforeUnmount, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditTag from '@/components/EditTag.vue'
import { parseMarkdown } from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css"
import "katex/dist/katex.min.css"
import { Edit, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { AxiosResponse } from 'axios'
import { computed } from '@vue/reactivity'

const route = useRoute()
const router = useRouter()

const data = reactive({
    article: {
        title: getNow(false),
        content: '',
        category: '',
        state: 1,
        tags: [],
    } as ArticleEdit,
    isLoading: false,
    isChanged: false,
    find: '',
    replace: '',
    showFind: false,
    showReplace: false,
})

const fetchData = async () => {
    if (route.name != 'editArticle') return
    if (!route.params.id) return
    data.isLoading = true
    let response = await req.request({
        url: `articles/${route.params.id}`, method: 'get',
    })
    if (response.status == 200) {
        data.article.title = response.data.title
        data.article.content = response.data.content
        data.article.category = response.data.category
        data.article.state = response.data.state
        data.article.tags = response.data.tags
        data.isLoading = false
    }
}
watch(() => route.params, fetchData)
fetchData()
const noteHtml = computed(() => {
    if (!data.article.content) return ''
    return parseMarkdown(data.article.content)
})

const handleChange = () => {
    if (data.isChanged) return
    data.isChanged = true
    window.onbeforeunload = function (e) {
        var dialogText = 'Dialog text here';
        e.returnValue = dialogText;
        return dialogText;
    }
}

onBeforeMount(() => {
    document.addEventListener('keydown', handleHotKey)
})

onBeforeUnmount(() => {
    window.onbeforeunload = null
    document.removeEventListener('keydown', handleHotKey)
})

const saveArticle = async () => {
    if (data.article.title.trim().length == 0) {
        ElMessageBox.alert('标题必填哦', '提示', { confirmButtonText: '好的' })
        return
    } else if (data.article.tags.length == 0) {
        ElMessageBox.alert('必须输入至少一个标签', '提示', { confirmButtonText: '好的' })
        return
    } else if (data.article.category.trim().length == 0) {
        ElMessageBox.alert('文章分类不能为空', '提示', { confirmButtonText: '好的' })
        return
    } else if (data.article.content.trim().length == 0) {
        ElMessageBox.alert('内容不能为空哦', '提示', { confirmButtonText: '好的' })
        return
    }
    data.isLoading = true
    let response: AxiosResponse<any, any>
    try {
        if (route.params.id) {
            response = await req.request({
                url: `articles/${route.params.id}`, method: 'put', data: data.article
            })
        } else {
            response = await req.request({
                url: 'articles', method: 'post', data: data.article
            })
        }
        if (response.status == 200 || response.status == 201) {
            data.isLoading = false
            data.isChanged = false
            window.onbeforeunload = () => {}
            ElMessageBox.confirm('保存成功', '成功', {
                confirmButtonText: '跳转',
                cancelButtonText: '关闭',
                type: 'success',
            })
                .then(() => {
                    if (route.params.id) {
                        router.push({ name: 'articleDetail', params: { id: route.params.id } })
                    } else {
                        router.push({ name: 'articleDetail', params: { id: response.data.id } })
                    }
                })
                .catch((e) => {
                    //console.log(e)
                    if (!route.params.id) {
                        router.push({ name: 'editArticle', params: { id: response.data.id } })
                    }
                })
            return
        }
    } catch (ex: any) {
        data.isLoading = false
        ElMessage({ message: '保存失败', type: 'error' })
    }
}

const findNext = () => {
    let t = document.querySelector('textarea')!
    if (!data.find) {

    } else {
        let i = data.article.content.indexOf(data.find, t.selectionEnd)
        if (i > -1) {
            t.focus()
            t.setSelectionRange(i, i + data.find.length)
        } else {
            i = data.article.content.indexOf(data.find, 0)
            if (i > -1) {
                t.focus()
                t.setSelectionRange(i, i + data.find.length)
            }
        }
    }
}

watch(() => data.find, findNext)

const showFind = () => {
    let t = document.querySelector('textarea')!
    data.find = data.article.content.substring(t.selectionStart, t.selectionEnd)
    data.showReplace = false
    data.showFind = true
}

const showReplace = () => {
    let t = document.querySelector('textarea')!
    data.find = data.article.content.substring(t.selectionStart, t.selectionEnd)
    data.showReplace = true
    data.showFind = true
}

const handleHotKey = (event: KeyboardEvent) => {
    let target = event.target as HTMLElement
    if (target.classList.contains('el-textarea__inner')) {
        if (event.ctrlKey && event.key == 's') {
            event.preventDefault()
            saveArticle()
        } else if (event.ctrlKey && event.key == 'h') {
            event.preventDefault()
            showReplace()
        } else if (event.ctrlKey && event.key == 'f') {
            event.preventDefault()
            showFind()
        }
    }
}
</script>
<template>
    <div class="editor-wrapper" v-loading.fullscreen="data.isLoading">
        <input class="title" type="text" v-model="data.article.title" placeholder="请输入文章标题" @input="handleChange" />
        <div class="main">
            <div class="left">
                <div class="tag-wrapper">
                    <el-input class="category" v-model="data.article.category" placeholder="输入分类" clearable
                        @input="handleChange" />
                    <EditTag class="tags" v-model="data.article.tags"></EditTag>
                    <el-button type="primary" class="save" plain :icon="Edit" @click="saveArticle">保存</el-button>
                </div>
                <div class="content">
                    <el-input class="content-1" v-model="data.article.content" type="textarea" @input="handleChange" autofocus/>
                    <div class="replace-dialog" :class="{ show: data.showFind, expand: data.showReplace }">
                        <div class="expand" :class="{ show: data.showReplace }">
                            <el-icon @click="data.showReplace = !data.showReplace">
                                <ArrowRight />
                            </el-icon>
                        </div>
                        <div class="levels">
                            <div class="level-1">
                                <el-input v-model="data.find" placeholder="查找" @keyup.enter="findNext" />
                                <div class="empty"></div>
                                <el-icon title="关闭" @click="data.showFind = data.showReplace = false;"><font-awesome-icon
                                        icon="fa-solid fa-xmark" /></el-icon>
                            </div>
                            <div class="level-2" :class="{ show: data.showReplace }">
                                <el-input v-model="data.replace" placeholder="替换" />
                                <el-icon title="替换"><font-awesome-icon icon="fa-regular fa-keyboard" /></el-icon>
                                <el-icon title="替换全部"><font-awesome-icon icon="fa-solid fa-keyboard" /></el-icon>
                                <div class="empty-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right regular-scrollbar">
                <div class="note-view" v-html="noteHtml"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.content :deep(textarea::-webkit-scrollbar-track) {
    border-radius: 10px;
}

.content :deep(.el-textarea__inner) {
    height: 100%;
}

.content :deep(textarea) {
    resize: none !important;
    overflow: auto;
}

.content :deep(textarea::-webkit-scrollbar) {
    width: 6px;
}

.content :deep(textarea::-webkit-scrollbar-thumb) {
    background-color: #0003;
    border-radius: 10px;
    transition: all .2s ease-in-out;
}

.editor-wrapper {
    height: 100%;
    width: 100%;
    margin: 0px;
}

.title {
    box-sizing: border-box;
    display: block;
    width: 100%;
    font-size: 2rem;
    color: var(--el-text-color-regular);
    background-color: var(--bg-color-primary);
    border: 0px;
    padding-left: 1rem;
    line-height: 4rem;
    outline: none;
    overflow: hidden;
}

.main {
    background-color: var(--bg-color-secondary);
    width: 100%;
    height: calc(100vh - 143px);
    border-radius: 6px;
    /* box-shadow: var(--content-shadow); */
}

.left,
.right {
    box-sizing: border-box;
    width: 50%;
    height: 100%;
    float: left;
    padding: 10px;
}

.left {
    border-right: 1px solid var(--el-border-color);
}

.right {
    overflow: auto;
    padding: 12px;
}

.note-view :deep(.img-flex) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.note-view :deep(.img-flex>p) {
    font-family: var(--el-font-family);
    font-size: var(--el-font-size-small);
    font-style: italic;
}

.left>.tag-wrapper {
    padding: 0 2px 10px 0;
    display: flex;
    align-items: baseline;
}

.tag-wrapper>.category {
    width: 200px;
    flex-shrink: 0;
}

.tag-wrapper>.tags {
    flex-grow: 1;
    margin: 0 6px;
}

.tag-wrapper .save {
    flex-shrink: 0;
}

.left>.content {
    position: relative;
}

.left>.content,
.left>.content>.content-1 {
    height: calc(100vh - 210px);
}

.left>.content>.replace-dialog {
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
    width: 260px;
    height: 0px;
    border: 1px solid var(--el-border-color);
    border-left: 2px solid var(--el-border-color-darker);
    border-right: 2px solid var(--el-border-color-darker);
    background-color: var(--bg-color-secondary);
    display: flex;
    align-items: center;
    transition: height .4s, visibility .4s;
    overflow: hidden;
    visibility: hidden;
}

.left>.content>.replace-dialog.show {
    visibility: visible;
    height: 44px;
}

.left>.content>.replace-dialog.show.expand {
    height: 84px;
}

.replace-dialog>.expand {
    flex: 0 0 20px;
    transition: transform .4s ease;
}

.replace-dialog>.expand.show {
    transform: rotateZ(90deg);
}

.replace-dialog>.levels {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
}

.level-2 {
    height: 0px;
    padding-top: 0px;
    box-sizing: border-box;
    transition: height .4s, padding-top .4s;
    overflow: hidden;
}

.level-2.show {
    height: 40px;
    padding-top: 6px;
}

.replace-dialog>.levels>.level-1,
.replace-dialog>.levels>.level-2 {
    display: flex;
    /* justify-content: space-between; */
}

.replace-dialog>.levels>.level-1>*:first-child,
.replace-dialog>.levels>.level-2>*:first-child {
    flex: 0 1 auto;
    min-width: 0;
}

.replace-dialog>.levels>.level-1>*:not(:first-child),
.replace-dialog>.levels>.level-2>*:not(:first-child) {
    flex: 0 0 auto;
}

.replace-dialog .el-icon {
    font-size: 20px;
    color: var(--el-text-color-regular);
    padding: 6px;
    cursor: pointer;
}

.replace-dialog .levels .el-icon:hover {
    background-color: var(--el-border-color);
}

.replace-dialog .empty {
    width: 64px;
    height: 32px;
}

.replace-dialog .empty-1 {
    width: 32px;
    height: 32px;
}

@media only screen and (max-width: 768px) {
    .tag-wrapper>.category {
        width: 100px !important;
    }

    .left,
    .right {
        display: inline;
        box-sizing: border-box;
        width: 100%;
        height: 50%;
        padding: 10px;
    }

    .left {
        border-bottom: 1px solid var(--el-border-color-darker);
    }

    .left>.content,
    .left>.content>.content-1 {
        height: calc(100% - 48px);
    }
}
</style>