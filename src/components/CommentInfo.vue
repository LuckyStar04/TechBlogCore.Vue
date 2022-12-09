<script lang="ts" setup>
import { getDateSpan } from '@/utils/dates'
import { useUserStore } from '@/stores/UserStore'
import { reactive } from 'vue'
import nologinpng from '@/assets/nologin.png'
import adminpng from '@/assets/user.png'
import userpng from '@/assets/panda.png'
import type { Comment } from '@/types'
import MakeComment from './MakeComment.vue'
import Comments from '@/components/Comments.vue'
import { CaretRight, ChatLineRound } from '@element-plus/icons-vue'

const props = defineProps<{
    comment: Comment,
}>()

const emits = defineEmits(['addComment'])

const userStore = useUserStore()

const data = reactive({
    showReply: false
})

const avatars = (role: string | any) => {
    if (role == "Admin") {
        return adminpng
    } else if (role == "CommonUser") {
        return userpng
    }
    return nologinpng
}

const addComment = (comment: Comment) => {
    if (props.comment.parentId == null) {
        if (!props.comment.children) {
            props.comment.children = [comment]
        } else {
            props.comment.children.push(comment)
        }
    } else {
        emits('addComment', comment)
    }
    data.showReply = false
}

const showMakeComment = () => {
    if (!userStore.info.role) {
        userStore.isShowLoginForm = true
    } else {
        data.showReply = !data.showReply
    }
}
</script>
<template>
    <div class="comment-info">
        <div class="left">
            <img class="avatar" :src="avatars(props.comment.role)" />
        </div>
        <div class="right">
            <div class="title"><span>{{ comment.userName }}</span><span v-if="comment.replyTo">&nbsp;<el-icon><CaretRight /></el-icon>&nbsp;{{comment.replyTo}}</span></div>
            <p class="content">{{ comment.content }}</p>
            <div class="meta">
                <span class="time-span">{{ getDateSpan(new Date(comment.commentTime)) }}</span>
                <div class="buttons">
                    <!-- <el-button type="info" link v-if="(userStore.info.role == 'Admin' || comment.email == userStore.info.email)" @click="deleteComment(comment.id)">删除</el-button> -->
                    <el-button type="info" link :icon="ChatLineRound" @click="showMakeComment">回复</el-button>
                </div>
            </div>
            <MakeComment class="make-comment" v-show="data.showReply" :placeholder="`回复 ${comment.userName}：`" :articleId="props.comment.articleId.toString()"
                :parentId="comment.parentId ? comment.parentId : comment.id" :replyTo="comment.userName"  @comment-success="addComment"></MakeComment>
            <Comments v-if="(comment.children.length > 0)" :comments="comment.children"></Comments>
        </div>
    </div>
</template>
<style scoped>
.comment-info {
    display: flex;
    align-items: flex-start;
}
.left {
    width: 36px;
    flex-shrink: 0;
}
.left>img {
    width: 34px;
}
.left>img {
    border-radius: 30%;
}
.right {
    flex-grow: 1;
    margin-left: 14px;
}
.right > .title {
    margin-top: 5px;
    font-size: var(--el-font-size-medium);
    color: var(--el-text-color-regular);
    font-weight: 600;
}

.right > .content {
    line-height: 0;
    margin-top: 1rem;
    font-size: var(--el-font-size-medium);
    color: var(--el-text-color-secondary);
}
.meta {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: .5rem;
}

.meta > .time-span {
    color: var(--el-color-info);
}

.make-comment {
    margin-bottom: 10px;
}
</style>
