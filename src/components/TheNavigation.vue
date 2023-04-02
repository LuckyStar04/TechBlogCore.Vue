<script lang="ts" setup>
import { MoreFilled, Sunny, Moon } from '@element-plus/icons-vue'
import logopng from '@/assets/logo-2.png'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import Categories from '@/components/Categories.vue'
import Menu from '@/components/Menu.vue'
import MenuItem from '@/components/MenuItem.vue'
import Tags from '@/components/Tags.vue'
import SearchInput from '@/components/SearchInput.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useRoute, useRouter } from 'vue-router'
import { useDark } from '@vueuse/core'

const isDark = useDark({
    onChanged(dark: boolean) {
        if (dark) {
            document.documentElement.classList.add('dark')
            document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#121212')
        } else {
            document.documentElement.classList.remove('dark')
            document.querySelector('meta[name="theme-color"]')!.setAttribute('content', '#ffffff')
        }
    },
})

const route = useRoute()
const router = useRouter()

const data = reactive({
    drawer: false,
    search: '',
})

watch(() => route.query, () => {
    data.drawer = false
})

const showTitle = ref(false)
const handleScroll = () => {
    if (route.name != 'articleDetail') {
        showTitle.value = false
        return
    }
    const navi = document.getElementById('navi-button')!
    if (window.getComputedStyle(navi).display === "none") {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        if (scrollTop > 200) {
            showTitle.value = true
        } else {
            showTitle.value = false
        }
    } else {
        showTitle.value = false
    }
}

onMounted(() => {
    window.addEventListener("scroll", handleScroll, false)
})

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll, false)
})
</script>
<template>
    <div class="navigations-wrapper" :class="{ scroll: showTitle }">
        <el-button id="navi-button" type="primary" plain style="font-size: 22px;"
            @click="data.drawer = true" ><font-awesome-icon icon="fa-solid fa-bars" /></el-button>
        <div class="logo-wrapper">
            <div class="logo">
                <router-link :to="{ name: 'home' }"><img :src="logopng" /></router-link>
            </div>
            <div id="navi-article-title"></div>
        </div>
        <div class="right-dock">
            <SearchInput class="search" style="width: 160px;margin-right:1rem;"></SearchInput>
            <Menu id="navi-menu">
                <MenuItem index="/" route="/">封面</MenuItem>
                <MenuItem index="/articles" route="/articles">文章</MenuItem>
                <MenuItem index="/archived" route="/archived">归档</MenuItem>
            </Menu>
            <el-switch v-model="isDark" :inline-prompt="true" :active-icon="Sunny" :inactive-icon="Moon"
                style="margin: 0 1.7rem;" />
            <UserAvatar></UserAvatar>
        </div>
        <el-drawer class="drawer" v-model="data.drawer" title="侧边栏" direction="ltr" :with-header="false" size="70%"
            :close-on-click-modal="true">
            <div class="drawer-top">
                <SearchInput></SearchInput>
                <el-switch v-model="isDark" :inline-prompt="true" :active-icon="Sunny" :inactive-icon="Moon"
                    style="margin-left:1.5rem;" />
            </div>
            <el-divider style="margin: 0;" />
            <Categories :showShadow="false" class="trans"></Categories>
            <Tags :showShadow="false" class="trans"></Tags>
        </el-drawer>
    </div>
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
    align-items: flex-start;
    overflow: hidden;
}

#navi-button {
    display: none;
    width: 45px;
    height: 40px;
}

.logo-wrapper {
    height: 120px;
    flex-grow: 1;
    display: flex;
    flex-flow: column nowrap;
    overflow: hidden;
    -webkit-transition: -webkit-transform .3s;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    transition-delay: 0s;
    transition-property: -webkit-transform;
    transition: -webkit-transform .3s;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    transition-delay: 0s;
    transition-property: -webkit-transform;
    transition: transform .3s;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    transition-delay: 0s;
    transition-property: transform;
    transition: transform .3s, -webkit-transform .3s;
    transition-duration: 0.3s, 0.3s;
    transition-timing-function: ease, ease;
    transition-delay: 0s, 0s;
    transition-property: transform, -webkit-transform;
}

#navi-article-title {
    height: 60px;
    overflow: hidden;
    padding-right: 6px;
    font-family: 'Trebuchet MS';
}

#navi-article-title :deep(*) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.scroll .logo-wrapper {
    -webkit-transform: translateY(-54%);
    transform: translateY(-54%);
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
}

/* .scroll #navi-article-title {
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;
}

.scroll .logo {
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;
} */

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
    flex-shrink: 0;
}

:deep(.el-drawer__body) {
    padding: .2rem !important;
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

.logo,
.logo img {
    height: 50px;
}

.trans {
    transition: all var(--el-transition-duration);
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

@media only screen and (min-width: 769px) and (max-width: 1024px) {
    .navigations-wrapper {
        width: 768px;
    }
}

@media only screen and (max-width: 768px) {
    .navigations-wrapper {
        padding: 0 10px;
        align-items: center;
    }

    .logo-wrapper {
        height: 60px;
        flex-grow: 0;
        transform: translateY(0) !important;
    }

    #navi-article-title {
        display: none;
    }

    #navi-button {
        display: flex;
    }

    .right-dock>.search,
    #navi-menu,
    .right-dock>.el-switch {
        display: none !important;
    }
}
</style>