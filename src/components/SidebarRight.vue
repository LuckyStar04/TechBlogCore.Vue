<script lang="ts" setup>
import Categories from './Categories.vue'
import Tags from './Tags.vue'
</script>
<template>
    <div class="wrapper">
        <!-- <div class="sidebars">
            <el-scrollbar height="calc(100vh - 60px)"> -->
            <Categories></Categories>
            <Tags class="mt-15"></Tags>
            <!-- </el-scrollbar>
        </div> -->
    </div>
</template>
<style scoped>
.sidebars {
    /* position: fixed; */
    /* overflow: hidden; */
}

.mt-15 {
    margin-top: 15px;
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