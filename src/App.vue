<script setup lang="ts">
import { RouterView } from 'vue-router'
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
  display: inline;
  height: 100%;
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
  padding-top: 60px;
  margin: 0 auto;
  justify-content: space-around;
  align-items: stretch;
  overflow: auto;
}

.grow-2 {
  flex-grow: 1;
}

@media only screen and (min-width: 1440px) {
  .flex-main {
    width: 1150px;
  }

  .grow-1 {
    width: 360px;
    flex-shrink: 0;
  }
}

@media only screen and (min-width: 1024px) and (max-width: 1440px) {
  .flex-main {
    width: 960px;
  }

  .grow-1 {
    width: 320px;
    flex-shrink: 0;
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .flex-main {
    width: 768px;
  }

  .grow-1 {
    width: 280px;
    flex-shrink: 0;
  }
}

@media only screen and (max-width: 768px) {
  .grow-1 {
    display: none;
  }
  
  .flex-main {
    padding: 60px 0 0;
  }
}
</style>
