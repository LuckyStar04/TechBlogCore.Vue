<template>
    <RouterLink class="menuitem-wrapper" :class="{ active: currRoute == props.route }" :to="props.index">
        <slot></slot>
    </RouterLink>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    index: {
        type: String,
        required: true,
    },
    route: {
        type: String,
        required: true,
    }
})
const router = useRouter()

const currRoute = computed(() => '/' + router.currentRoute.value.fullPath.split('?')[0].split('/')[1].toLowerCase())
</script>
<style scoped>
.menuitem-wrapper {
    height: 60px;
    text-decoration: none;
    height: 60px;
    line-height: 60px;
    font-size: 15px;
}
</style>