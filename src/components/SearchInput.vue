<template>
    <!-- <el-input v-model="data.search" placeholder="搜索" :prefix-icon="Search" @keydown.enter.prevent="search"/> -->
    <div class="input-wrapper" :class="{ focus: data.isFocus }">
        <span class="icon"><el-icon>
                <Search />
            </el-icon></span>
        <input type="text" placeholder="搜索" v-model="data.search" @keydown.enter.prevent="search"
            @focusin="data.isFocus = true" @focusout="data.isFocus = false" @mouseenter="" />
    </div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    bgcolor: {
        type: String,
        required: false,
        default: 'var(--el-bg-color)',
    }
})

const router = useRouter()

const data = reactive({
    search: '',
    isFocus: false,
})

const search = () => {
    router.push({ name: 'articles', query: { keyword: data.search } })
}
</script>
<style scoped>
.input-wrapper {
    --el-input-border-color: var(--el-border-color);
    width: 100%;
    border-radius: 4px;
    color: var(--el-text-color-regular);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1px 11px;
    background-color: var(--el-input-bg-color);
    transition: var(--el-transition-box-shadow);
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    background-color: v-bind('$props.bgcolor');
}

.input-wrapper>.icon {
    display: inline-flex;
    flex-shrink: 0;
    flex-wrap: nowrap;
    height: 100%;
    text-align: center;
    color: var(--el-text-color-placeholder);
}

.input-wrapper>.icon>i {
    margin-right: 8px;
}

.input-wrapper.focus {
    --el-input-border-color: var(--el-color-primary);
}

.input-wrapper input {
    width: 100%;
    flex-grow: 1;
    -webkit-appearance: none;
    appearance: none;
    color: var(--el-text-color-regular);
    height: 32px;
    line-height: var(--el-input-inner-height);
    padding: 0;
    outline: 0;
    border: none;
    background: 0 0;
    font-size: 14px;
}

.input-wrapper input::-moz-placeholder {
    color: var(--el-text-color-placeholder);
}

.input-wrapper input:-ms-input-placeholder {
    color: var(--el-text-color-placeholder);
}

.input-wrapper input::placeholder {
    color: var(--el-text-color-placeholder);
}</style>