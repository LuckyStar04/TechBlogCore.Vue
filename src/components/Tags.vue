<script lang="ts" setup>
import type { TagModel } from '@/types';
import { reactive } from 'vue';
import req from '@/utils/request'

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
            <RouterLink v-for="(tag, index) in data.tags" :to="{ name: 'articles', query: { tag: tag.name } }">
                <el-button :type="colors[index % colors.length]" size="small">{{ tag.name }}({{ tag.count }})</el-button>
            </RouterLink>
        </div>
    </div>
</template>
<style scoped>
a {
    text-decoration: none !important;
}
.wrapper {
    margin: .5rem;
    /* box-shadow: 0 1px 3px hsl(0deg 0% 7% / 10%);
    border-radius: 5px; */
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
}

.tags>a {
    margin: 0 0 .5rem .5rem;
}

h1, h2, h3 {
    color: var(--el-text-color-regular);
}

@media only screen and (max-width: 768px) {
    .wrapper {
        box-shadow: 0 0;
    }
}
</style>