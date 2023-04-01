<template>
    <div class="menu-wrapper">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    backgroundColor: {
        type: String,
        required: false,
        default: 'var(--el-bg-color)',
    },
    hoverBgColor: {
        type: String,
        required: false,
        default: 'var(--el-color-primary-light-9)',
    },
    textColor: {
        type: String,
        required: false,
        default: 'var(--el-text-color-secondary)',
    },
    activeTextColor: {
        type: String,
        required: false,
        default: 'var(--el-color-primary)',
    },
    selectedTextColor: {
        type: String,
        required: false,
        default: 'var(--el-text-color-primary)',
    },
})
</script>
<style scoped>
.menu-wrapper {
    height: 60px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

.menu-wrapper :deep(a) {
    display: inline-block;
    padding: 0 20px;
    background-color: v-bind('$props.backgroundColor');
    color: v-bind('$props.textColor');
    box-sizing: border-box;
    transition: none;
}

.menu-wrapper :deep(a:hover) {
    background-color: v-bind('$props.hoverBgColor');
    color: v-bind('$props.activeTextColor');
}

.menu-wrapper :deep(a.active) {
    font-weight: bold;
    color: v-bind('$props.selectedTextColor');
    border-bottom: 3px solid v-bind('$props.activeTextColor');
}
</style>