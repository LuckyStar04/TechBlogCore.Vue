<script lang="ts" setup>
import type { TagModel } from '@/types';
import { reactive } from 'vue';
import req from '@/utils/request'
import { useRoute } from 'vue-router'

const route = useRoute()
const colors = ['primary', 'success', 'info', 'warning', 'danger']

const data = reactive({
    tags: [] as Array<TagModel>,
})

const fetchData = async () => {
    let response = await req.request({
        url: 'tags', method: 'get', params: { size: 30 }
    })
    if (response.status == 200) {
        data.tags = response.data
    }
}
fetchData()
</script>
<template>
    <div class="wrapper">
        <div class="tag-title"><h2>文章标签</h2></div>
        <div class="tags">
            <template v-for="(tag, index) in data.tags">
                <RouterLink :to="{ name: 'articles', query: { tag: tag.name } }">
                    <el-button v-if="(route.query.tag == tag.name)" type="success" round>{{ tag.name }}({{ tag.count }})</el-button>
                    <el-button v-else type="info" link>{{ tag.name }}({{ tag.count }})</el-button>
                </RouterLink>
            </template>
        </div>
    </div>
</template>
<style scoped>
* {
    font-family: 'Trebuchet MS';
}
a {
    text-decoration: none !important;
}
.wrapper {
    margin: .5rem;
}
.tag-title, .tags {
    padding: 1rem;
}
.tag-title {
    border-bottom: 1px solid var(--el-border-color-light);
}
.tag-title>h2 {
    line-height: 0;
}
.tags {
    margin-left: -.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
}

.tags>a {
    margin: 0 0 .5rem .5rem;
}

h1, h2, h3 {
    color: var(--el-text-color-regular);
}
</style>