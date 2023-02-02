<script lang="ts" setup>
import req from '@/utils/request'
import { getNow } from '@/utils/dates'
import type { ArticleEdit } from '@/types'
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditTag from '@/components/EditTag.vue'
import { parseMarkdown } from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css"
import { Edit } from '@element-plus/icons-vue'
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
</script>
<template>
    <div class="editor-wrapper" v-loading.fullscreen="data.isLoading">
        <input class="title" type="text" v-model="data.article.title" placeholder="请输入文章标题" />
        <div class="main">
            <div class="left">
                <div class="tag-wrapper">
                    <el-input class="category" v-model="data.article.category" placeholder="输入分类" clearable />
                    <EditTag class="tags" v-model="data.article.tags"></EditTag>
                    <el-button type="primary" class="save" plain :icon="Edit" @click="saveArticle">保存</el-button>
                </div>
                <el-input class="content" v-model="data.article.content" type="textarea" />
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
    height: calc(100vh - 80px);
    width: 100%;
    margin-top: 10px;
}

.title {
    box-sizing: border-box;
    display: block;
    width: 100%;
    font-size: 2rem;
    color: var(--el-text-color-regular);
    background-color: var(--el-bg-color);
    border: 0px;
    padding: 0 1rem 1rem;
    outline: none;
    overflow: hidden;
}

.main {
    background-color: var(--el-bg-color-page);
    width: 100%;
    height: calc(100vh - 143px);
    border-radius: 6px;
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
    border-right: 1px solid var(--el-border-color-light);
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
    height: calc(100vh - 210px);
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
        border-bottom: 1px solid var(--el-border-color-light);
    }

    .left>.content {
        height: calc(100% - 48px);
    }
}
</style>