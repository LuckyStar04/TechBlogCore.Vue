<script lang="ts" setup>
import nologinpng from '@/assets/nologin.png'
import adminpng from '@/assets/user.png'
import userpng from '@/assets/panda.png'
import type { Comment } from '@/types'

const props = defineProps<{
    comments: Array<Comment>,
    placeholder: string
}>()
</script>
<template>
    <div class="wrapper">
        <div class="comment-info" v-for="comment in props.comments">
            <div class="left">
                <img class="avatar" :src="nologinpng" />
            </div>
            <div class="right">
                <h3>username</h3>
                <p>comment</p>
                <div class="meta">
                    <span>createTime</span>
                    <el-button>回复</el-button>
                </div>
            </div>
        </div>
    </div>
</template>