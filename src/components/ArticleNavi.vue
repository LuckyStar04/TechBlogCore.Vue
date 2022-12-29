<script lang="ts" setup>
import type { NavItem } from '@/types'

const props = defineProps({
  items: {
    type: Array<NavItem>,
    default: [],
    required: true
  }
})
</script>
<template>
<ul>
    <li class="li-item" v-for="nav in props.items"><RouterLink :to="{ hash: `#${nav.id}` }">{{ nav.title }}</RouterLink>
        <ArticleNavi v-if="nav.children.length > 0" :items="nav.children"></ArticleNavi>
    </li>
</ul>
</template>
<style scoped>
ul {
    padding-left: 16px;
}

a {
    font-weight: 500;
    text-decoration: none !important;
    color: var(--el-text-color-secondary);
    /* color: var(--el-color-info); */
    /* color: #8590a6; */
}

.li-item {
    margin-top: 5px;
    font-size: 11px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>