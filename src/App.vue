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
#app,
.el-container {
  min-height: 100vh;
}

.el-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: var(--el-bg-color);
  padding: 0;
  border-bottom: solid 1px var(--el-menu-border-color);
  box-shadow: var(--header-shadow);
}

.flex-main {
  display: flex;
  width: 100%;
  padding: 0;
  margin: 60px auto 0;
  justify-content: space-around;
  align-items: stretch;
  overflow: auto;
}

.grow-2 {
  flex-grow: 1;
}

@media only screen and (min-width: 1440px) {
  .flex-main {
    width: 1400px;
  }

  .grow-1 {
    width: 400px;
    flex-shrink: 0;
  }
}

@media only screen and (min-width: 1024px) and (max-width: 1440px) {
  .flex-main {
    width: 1000px;
  }

  .grow-1 {
    width: 350px;
    flex-shrink: 0;
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .flex-main {
    width: 768px;
  }

  .grow-1 {
    width: 300px;
    flex-shrink: 0;
  }
}

@media only screen and (max-width: 768px) {
  .grow-1 {
    display: none;
  }
}
</style>
