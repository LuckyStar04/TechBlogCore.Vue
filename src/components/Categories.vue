<script lang="ts" setup>
import type { CategoryModel } from '@/types';
import { reactive } from 'vue';
import req from '@/utils/request'

const data = reactive({
    categories: [] as Array<CategoryModel>,
})

const fetchData = async () => {
    let response = await req.request({
        url: 'categories', method: 'get', params: { size: 30 }
    })
    if (response.status == 200) {
        data.categories = response.data
    }
}
fetchData()
</script>
<template>
    <div>
        <h3>文章分类</h3>
        <ul>
            <li v-for="category in data.categories">
                <RouterLink :to="{ name: 'articles', query: { category: category.name } }">{{ category.name }} ({{
                        category.count
                }})</RouterLink>
            </li>
        </ul>
    </div>
</template>
<style scoped>
a {
    text-decoration: none !important;
}
</style>