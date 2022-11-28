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
    <div>
        <h3>文章标签</h3>
        <div class="tags">
            <RouterLink v-for="(tag, index) in data.tags" :to="{ name: 'articles', query: { tag: tag.name } }">
                <el-button :type="colors[index % colors.length]">{{ tag.name }}({{ tag.count }})</el-button>
            </RouterLink>
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