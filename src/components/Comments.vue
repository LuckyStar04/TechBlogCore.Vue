<script lang="ts" setup>
import type { Comment } from '@/types'
import CommentInfo from './CommentInfo.vue'

const props = defineProps({
    comments: {
        type: Array<Comment>,
        default: [],
        required: true
    },
})

const addComment = (c: Comment) => {
    props.comments.push(c)
}
</script>
<template>
    <div class="comment-wrapper">
        <CommentInfo v-for="comment in props.comments" :comment="comment" @addComment="addComment"></CommentInfo>
    </div>
</template>
<style scoped>
.comment-wrapper {
    margin-top: 30px;
}
</style>