<script lang="ts" setup>
import Categories from './Categories.vue'
import Tags from './Tags.vue'
</script>
<template>
    <div class="wrapper">
        <div class="sidebars autohide-scrollbar">
            <Categories></Categories>
            <Tags></Tags>
        </div>
    </div>
</template>
<style scoped>
.sidebars {
    position: fixed;
    height: calc(100vh - 60px);
    overflow: auto;
    overflow-y: scroll;
}

@media only screen and (min-width: 1440px) {
    .sidebars {
        width: 360px;
    }
}

@media only screen and (min-width: 1024px) and (max-width: 1440px) {
    .sidebars {
        width: 320px;
    }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) {
    .sidebars {
        width: 280px;
    }
}
</style>