<template>
    <el-input v-model="data.search" placeholder="搜索" :prefix-icon="Search" @keydown.enter.prevent="search"/>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const data = reactive({
    search: ''
})

const search = () => {
    router.push({ name: 'articles', query: { keyword: data.search }})
}
</script>