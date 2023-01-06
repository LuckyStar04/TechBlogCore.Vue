<script lang="ts" setup>
import Categories from './Categories.vue'
import Tags from './Tags.vue'
</script>
<template>
    <div>
        <div class="sidebars">
            <Categories></Categories>
            <Tags></Tags>
        </div>
    </div>
</template>
<style scoped>
.sidebars {
    position: fixed;
}
</style>