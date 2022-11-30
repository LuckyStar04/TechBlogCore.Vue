<script lang="ts" setup>
import type { CategoryModel } from '@/types';
import { reactive } from 'vue';
import req from '@/utils/request'
import { useRouter } from 'vue-router'

const router = useRouter()
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

const jumpCategory = (category: string) => {
    router.push({ name: 'articles', query: { category: category }})
}
</script>
<template>
    <div class="wrapper">
        <div class="category-title"><h2>文章分类</h2></div>
        <ul class="categories">
            <li v-for="category in data.categories" @click="jumpCategory(category.name)">
                {{ category.name }} ({{category.count}})
            </li>
        </ul>
    </div>
</template>
<style scoped>
a {
    text-decoration: none !important;
}
.wrapper {
    margin: .5rem;
}
.category-title, .categories {
    padding: 1rem;
}
.categories {
    margin: 0;
}
.category-title {
    border-bottom: 1px solid var(--el-border-color-light);
}
.category-title>h2 {
    line-height: 0;
}
h1, h2, h3 {
    color: var(--el-text-color-regular);
}
li {
    list-style-type: none;
    padding: .6rem 0 .6rem .2rem;
    cursor: pointer;
    color: var(--el-text-color-secondary);
    font-family: var(--el-font-family);
    /* font-weight: bold; */
}
li:not(:last-child) {
    border-bottom: 1px solid var(--el-border-color-light);
}
/* @media only screen and (max-width: 768px) {
    .wrapper {
        margin: 0;
    }
} */
</style>