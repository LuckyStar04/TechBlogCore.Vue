<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Banner from './components/Banner.vue'

const route = useRoute()
const showHeaderRoute = ['articles', 'archived', 'articleDetail', 'editArticle', 'createArticle']
const showBannerRoute = ['articles', 'archived']

const isShowHeader = computed(() => {
  return showHeaderRoute.includes(route.name as string)
})

const isShowBanner = computed(() => {
  return showBannerRoute.includes(route.name as string)
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <div id="teleport"></div>
    <el-container>
      <el-header v-show="isShowHeader">
        <RouterView name="navigation"></RouterView>
      </el-header>
      <el-main :class="{ pt0: !isShowHeader }" style="padding: var(--el-main-padding) 0;">
        <Banner v-if="isShowBanner"></Banner>
        <div class="flex-main" :class="{ pt60: !isShowBanner && isShowHeader }">
          <RouterView class="grow-2"></RouterView>
          <RouterView name="rightSide" class="grow-1"></RouterView>
        </div>
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<style scoped>
#teleport {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

#app,
.el-container {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.el-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: var(--el-bg-color);
  /* background-image: radial-gradient(transparent 1px,var(--el-bg-color) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px); */
  padding: 0;
  box-shadow: var(--header-shadow);
  animation: header-anime .5s cubic-bezier(.17,.67,.57,.93);
}

@keyframes header-anime {
  0% {
    transform: translateY(-50px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.el-main {
  background-color: var(--bg-color-secondary);
}

.pt60 {
  padding-top: 60px;
}

.flex-main {
  display: flex;
  width: 100%;
  margin: 0 auto;
  justify-content: space-around;
  align-items: stretch;
  overflow: hidden;
}

.pt0 {
  padding-top: 0 !important;
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
    width: 240px;
    flex-shrink: 0;
  }
}

@media only screen and (max-width: 768px) {
  .grow-1 {
    display: none;
  }
}
</style>
