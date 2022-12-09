<script lang="ts" setup>
import { ElMenu } from 'element-plus'
import { Search, MoreFilled, Sunny, Moon } from '@element-plus/icons-vue'
import logopng from '@/assets/logo-2.png'
import { reactive, watch, watchEffect } from 'vue';
import Categories from '@/components/Categories.vue'
import Tags from '@/components/Tags.vue'
import SearchInput from '@/components/SearchInput.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useRoute } from 'vue-router'
import { useDark } from '@vueuse/core'

const isDark = useDark({
  onChanged(dark: boolean) {
    if (dark) {
        document.querySelector('html')!.classList.add('dark')
        document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#121212')
    } else {
        document.querySelector('html')!.classList.remove('dark')
        document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#ffffff')
    }
  },
})

const route = useRoute()

const data = reactive({
    drawer: false,
    search: '',
})

watch(() => route.query, () => {
    data.drawer = false
})
</script>
<template>
    <div class="navigations-wrapper">
        <el-button id="navi-button" type="primary" plain :icon="MoreFilled" style="font-size: 22px;"
            @click="data.drawer = true" />
        <div class="logo">
            <router-link :to="{ name: 'home' }"><img :src="logopng" /></router-link>
        </div>
        <div class="right-dock">
            <SearchInput style="width: 160px;margin-right:1rem;"></SearchInput>
            <el-menu id="navi-menu" default-active="1" class="el-menu-demo" mode="horizontal" :ellipsis="false" router>
                <el-menu-item index="0" route="/">首页</el-menu-item>
                <el-menu-item index="1" route="/articles">文章</el-menu-item>
            </el-menu>
            <el-switch v-model="isDark" :inline-prompt="true" :active-icon="Sunny" :inactive-icon="Moon"
                style="margin: 0 1.7rem;" />
            <UserAvatar></UserAvatar>
        </div>
    </div>
    <el-drawer class="drawer" v-model="data.drawer" title="侧边栏" direction="ltr" :with-header="false" size="70%"
        :close-on-click-modal="true">
        <div class="drawer-top">
            <SearchInput></SearchInput>
            <el-switch v-model="isDark" :inline-prompt="true" :active-icon="Sunny" :inactive-icon="Moon"
                style="margin-left:1.5rem;" />
        </div>
        <el-divider style="margin: 0;" />
        <Categories></Categories>
        <Tags></Tags>
    </el-drawer>
</template>
<style scoped>
.flex-grow {
    flex-grow: 1;
}

.navigations-wrapper {
    height: 60px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#navi-button {
    display: none;
    width: 45px;
    height: 40px;
}

.right-dock>.el-input,
#navi-menu {
    display: block;
}

.right-dock>.el-switch {
    display: inline-flex;
}

.right-dock {
    display: flex;
    align-items: center;
}

.drawer-top {
    display: flex;
    align-items: center;
    padding: 1rem 1rem 1rem 1.5rem;
}

.logo {
    padding: 5px 0;
}

.blank {
    flex-grow: 1;
}

.logo img {
    height: 50px;
}

@media only screen and (min-width: 1440px) {
    .navigations-wrapper {
        width: 1150px;
    }
}

@media only screen and (min-width: 1024px) and (max-width: 1440px) {
    .navigations-wrapper {
        width: 960px;
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
    .navigations-wrapper {
        width: 768px;
    }
}

@media only screen and (max-width: 768px) {
    .navigations-wrapper {
        padding: 0 10px;
    }
    #navi-button {
        display: flex;
    }

    .right-dock>.el-input,
    #navi-menu,
    .right-dock>.el-switch {
        display: none !important;
    }
}
</style>