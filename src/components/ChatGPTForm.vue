<script lang="ts" setup>
import req from '@/utils/request'
import { nextTick, reactive } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import type { Chat } from '@/types'
import OpenAI from '@/icons/OpenAI.vue'
import { parseMarkdown } from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css"
import "@/assets/marked-gpt.css"

const data = reactive({
    input: '',
    chats: [] as Array<Chat>,
    isLoading: false,
})

const send = async () => {
    data.input = data.input.trim()
    if (!data.input) return
    data.isLoading = true
    try {
        data.chats.push({
            isMe: true,
            content: data.input,
            time: new Date(),
        })
        let input = data.input
        data.input = ''
        await scroll()
        let response = await req.request({
            url: `chat`, method: 'post', data: { content: input }
        })
        // console.log(response);
        data.chats.push({
            isMe: false,
            content: response.data.choices[0].message.content,
            time: new Date(),
        })
    } catch (e) {
        console.log(e)
        data.chats.push({
            isMe: false,
            content: 'Error Response or Not Login',
            time: new Date(),
        })
    }
    data.isLoading = false
    await scroll()
}

const scroll = async () => {
    await nextTick()
    let body = document.querySelector('.chat-container')!
    body.scrollIntoView({ behavior: "smooth", block: "end" })
}
</script>
<template>
    <div class="chat-wrapper">
        <div class="chat-title">
            <div class="title-icon">
                <el-icon size="1.8rem"><OpenAI/></el-icon>
            </div>
            <div class="titles">
                <h1>ChatGPT</h1>
                <h2>gpt-3.5-turbo-0301</h2>
            </div>
        </div>
        <div class="chat-body regular-scrollbar">
            <div class="chat-container">
                <div v-for="chat in data.chats" class="chat" :class="{ me: chat.isMe }">
                    <div v-if="chat.isMe" class="avatar avatar-user">
                        <span>{{ 'L' }}</span>
                    </div>
                    <div v-else class="avatar avatar-openai">
                        <el-icon size="1.6rem" color="var(--el-text-color-primary)"><OpenAI/></el-icon>
                    </div>
                    <div class="gap"></div>
                    <div class="content">
                        <span v-if="chat.isMe">{{ chat.content }}</span>
                        <div v-else class="gpt-view" v-html="parseMarkdown(chat.content)"></div>
                    </div>
                    <div class="gap2"></div>
                </div>
                <div class="chat" v-if="data.isLoading">
                    <div class="avatar avatar-openai">
                        <el-icon size="1.6rem" color="var(--el-text-color-primary)"><OpenAI/></el-icon>
                    </div>
                    <div class="gap"></div>
                    <div class="content">
                        <span>......</span>
                    </div>
                    <div class="gap2"></div>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <input v-model="data.input" @keyup.enter="send" placeholder="输入问题" />
            <el-icon @click="send">
                <Promotion />
            </el-icon>
        </div>
    </div>
</template>
<style scoped>
.chat-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.chat-title {
    height: 2rem;
    flex-shrink: 0;
    padding: .8rem;
    display: flex;
    align-items: center;
}

.chat-title>.title-icon {
    flex-shrink: 0;
    width: 1.6rem;
    height: 1.6rem;
}

.chat-title>.titles {
    flex-grow: 1;
    margin-left: .6rem;
}

h1,
h2 {
    font-weight: normal;
    font-size: 14px;
    margin: 0;
    padding: 0;
}

h1 {
    color: var(--el-text-color-regular);
}

h2 {
    color: var(--el-text-color-disabled);
    font-size: 8px;
    letter-spacing: 1px;
}

.chat-body {
    flex-grow: 1;
    background-color: var(--el-color-info-light-8);
    overflow: auto;
    overflow-y: scroll;
}

.chat-input {
    height: 3.6rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.chat-input>input {
    flex-grow: 1;
    border: none;
    font-size: 14px;
    height: 100%;
    padding-left: .8rem;
    min-width: 0;
    background-color: var(--el-bg-color);
}

.chat-input>input:focus {
    outline: none;
}

.chat-input>.el-icon {
    flex-shrink: 0;
    font-size: 24px;
    color: var(--el-text-color-secondary);
    padding-right: .8rem;
}

.chat {
    display: flex;
    justify-content: flex-start;
    margin: 1rem .8em;
}

.chat.me {
    flex-direction: row-reverse;
}

.gap {
    height: 10px;
    width: .4rem;
    flex-shrink: 0;
}

.gap2 {
    width: 2.1rem;
    height: 10px;
    flex-shrink: 0;
}

.chat .content {
    background-color: var(--el-bg-color);
    padding: 4px 8px;
    font-size: 14px;
    border-radius: 6px;
    overflow-wrap: break-word;
    max-width: calc(100% - 5rem);
}

.avatar {
    width: 1.6rem;
    height: 1.6rem;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar.avatar-user {
    background-color: var(--el-color-primary-light-5);
    color: white;
    font-family: "Trebuchet MS";
}

.avatar.avatar-openai {
    background-color: var(--el-bg-color);
}

.avatar>span {
    font-size: 1.2rem;
}
</style>