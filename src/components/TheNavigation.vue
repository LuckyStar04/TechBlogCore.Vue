<script lang="ts" setup>
import { ElMenu } from 'element-plus';
</script>
<template>
    <el-menu default-active="0" class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
        <el-menu-item index="0" route="/">TechBlog.Core</el-menu-item>
        <div class="flex-grow"></div>
        <el-menu-item index="1" route="/articles">文章</el-menu-item>
        <el-menu-item index="2" route="/about">归档</el-menu-item>
    </el-menu>
</template>

<style scoped>
.flex-grow {
    flex-grow: 1;
}
</style>