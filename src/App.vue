<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TheNavigation from './components/TheNavigation.vue'
import { ElContainer, ElHeader, ElMain } from 'element-plus'
</script>

<template>
  <el-container>
    <el-header>
      <RouterView name="navigation"></RouterView>
    </el-header>
    <el-main class="flex-main">
        <RouterView class="grow-2"></RouterView>
        <RouterView name="rightSide" class="grow-1"></RouterView>
    </el-main>
  </el-container>
</template>

<style scoped>
#app, .el-container {
  min-height: 100vh;
}
.flex-main {
  display: flex;
  width: 100%;
  margin: auto;
  justify-content: space-around;
  align-items: stretch;
  overflow: auto;
}
.grow-2 {
  flex-grow: 2;
}
.grow-1 {
  flex-grow: 1;
  width: 0;
}
</style>
