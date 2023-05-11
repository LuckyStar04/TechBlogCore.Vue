<script lang="ts" setup>
import { MoreFilled, Sunny, Moon } from '@element-plus/icons-vue'
import logopng from '@/assets/logo-2.png'
import logowhitepng from '@/assets/logo-reverse-2.png'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import Categories from '@/components/Categories.vue'
import Menu from '@/components/Menu.vue'
import MenuItem from '@/components/MenuItem.vue'
import Tags from '@/components/Tags.vue'
import SearchInput from '@/components/SearchInput.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { useRoute, useRouter } from 'vue-router'
import { useDark } from '@vueuse/core'
import { useUserStore } from '@/stores/UserStore'

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

const userStore = useUserStore()

const data = reactive({
    drawer: false,
    search: '',
})

watch(() => route.query, () => {
    data.drawer = false
})

const showTitle = ref(false)
const handleScroll = () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop

    if (scrollTop > 200) {
        showTitle.value = true
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
    <div class="navigations-wrapper">
        <div class="navi-scroll" :class="{ scroll: showTitle }">
            <div class="navi-scroll-blue">
                <div class="navi-scroll-wrapper">
                    <el-button id="navi-button" type="primary" style="font-size: 22px; border: 1px solid var(--bg-sky-color-light-9);"
                        @click="data.drawer = true"><font-awesome-icon icon="fa-solid fa-bars" /></el-button>
                    <div class="logo-wrapper">
                        <div class="logo">
                            <router-link :to="{ name: 'home' }"><img :src="logowhitepng" /></router-link>
                        </div>
                    </div>
                    <div class="right-dock">
                        <SearchInput class="search" :bgcolor="'var(--bg-sky-color-light-9)'"
                            style="width: 160px;margin-right:1rem;"></SearchInput>
                        <Menu id="navi-menu" background-color="var(--bg-sky-color)"
                            hover-bg-color="var(--bg-sky-color-light-3)" text-color="#fff" active-text-color="#fff"
                            selected-text-color="#fff">
                            <MenuItem v-for="item in userStore.menu" :index="item.index" :route="item.route">{{ item.name }}</MenuItem>
                        </Menu>
                        <el-switch v-model="isDark" :inline-prompt="true" :active-icon="Sunny" :inactive-icon="Moon"
                            style="margin: 0 1.7rem;" />
                        <UserAvatar></UserAvatar>
                    </div>
                </div>
            </div>
            <div class="navi-scroll-white">
                <div class="navi-scroll-wrapper">
                    <el-button id="navi-button" type="primary" plain style="font-size: 22px;"
                        @click="data.drawer = true"><font-awesome-icon icon="fa-solid fa-bars" /></el-button>
                    <div class="logo-wrapper">
                        <div class="logo">
                            <router-link :to="{ name: 'home' }"><img :src="logopng" /></router-link>
                        </div>
                    </div>
                    <div class="right-dock">
                        <SearchInput class="search" style="width: 160px;margin-right:1rem;"></SearchInput>
                        <Menu id="navi-menu">
                            <MenuItem v-for="item in userStore.menu" :index="item.index" :route="item.route">{{ item.name }}</MenuItem>
                        </Menu>
                        <el-switch v-model="isDark" :inline-prompt="true" :active-icon="Sunny" :inactive-icon="Moon"
                            style="margin: 0 1.7rem;" />
                        <UserAvatar></UserAvatar>
                    </div>
                </div>
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
    width: 100%;
    overflow: hidden;
}

.navi-scroll {
    margin: 0 auto;
    height: 120px;
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

.navi-scroll-blue {
    background: var(--bg-sky-color);
}

.navi-scroll-white {
    background: var(--el-bg-color-overlay);
}

.navi-scroll-wrapper {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

#navi-button {
    display: none;
    width: 45px;
    height: 40px;
}

.logo-wrapper {
    flex-grow: 1;
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

.navi-scroll.scroll {
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
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

.mg-10 {
    margin: 10px;
}

@media only screen and (min-width: 1440px) {
    .navi-scroll-wrapper {
        width: 1150px;
    }
}

@media only screen and (min-width: 1024px) and (max-width: 1440px) {
    .navi-scroll-wrapper {
        width: 960px;
    }
}

@media only screen and (min-width: 769px) and (max-width: 1024px) {
    .navi-scroll-wrapper {
        width: 768px;
    }
}

@media only screen and (max-width: 768px) {
    .navi-scroll-wrapper {
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