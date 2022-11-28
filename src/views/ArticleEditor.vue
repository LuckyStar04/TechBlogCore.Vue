<script lang="ts" setup>
import req from '@/utils/request'
import { getNow } from '@/utils/dates'
import type { ArticleEdit } from '@/types'
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditTag from '@/components/EditTag.vue'
import marked from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css"
import "/src/assets/marked.css"
import "@/assets/editor.css"
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
    return marked.parse(data.article.content)
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
                console.log(e)
            })
        return
    }
}
</script>
<template>
    <div class="editor-wrapper" v-loading.fullscreen="data.isLoading">
        <input class="title" type="text" v-model="data.article.title" placeholder="请输入文章标题" />
        <div class="main">
            <div class="left">
                <div class="tag-wrapper">
                    <el-input class="category" v-model="data.article.category" placeholder="请输入文章分类" clearable />
                    <EditTag class="tags" v-model="data.article.tags"></EditTag>
                    <el-button type="primary" class="save" size="small" :icon="Edit" @click="saveArticle">保存</el-button>
                </div>
                <el-input class="content" v-model="data.article.content" type="textarea"/>
            </div>
            <div class="right">
                <div class="note-view" v-html="noteHtml"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.editor-wrapper {
    height: calc(100vh - 6.25rem);
}

.title {
    display: block;
    width: 96%;
    font-size: 2rem;
    color: #566;
    border: 0px;
    padding: 0 1rem 1rem;
    outline: none;
}

.main {
    background-color: #E7E9EB;
    width: 100%;
    height: calc(100vh - 9.6rem);
}

.left, .right {
    box-sizing: border-box;
    width: 50%;
    height: 100%;
    float: left;
    padding: 10px;
}

.left {
    border-right: 1px solid #bcc;
}
.right {
    overflow: auto;
}

.left>.tag-wrapper {
    padding: 0 2px 10px 0;
    display: flex;
    align-items: baseline;
}
.tag-wrapper > .category {
    width: 200px;
}

.tag-wrapper>.tags {
    flex-grow: 1;
    margin-left: 6px;
}

.tag-wrapper .save {
    flex-shrink: 0;
}

.left>.content {
    height: calc(100vh - 13.475rem)
}

</style>