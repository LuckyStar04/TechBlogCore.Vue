<script lang="ts" setup>
import req from '@/utils/request'
import { nextTick, reactive, onMounted, computed } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import type { Chat } from '@/types'
import { calcTime } from '@/utils/dates'
import OpenAI from '@/icons/OpenAI.vue'
import { parseMarkdown } from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css"
import "@/assets/marked-gpt.css"
import { useUserStore } from '@/stores/UserStore'

const data = reactive({
    model: 'gpt-3.5-turbo-0301',
    input: '',
    chats: [] as Array<Chat>,
    isLoading: false,
})

const userStore = useUserStore()

const letter = computed(() => userStore.info.user[0].toUpperCase())

const parse = (s: string) : string => {
    return JSON.parse(s).choices[0].message.content
}

const fetchData = async () => {
    let response = await req.request({
        url: `chat`, method: 'get'
    })
    if (response.status == 200 && response.data.length > 0) {
        response.data.map((d : Chat) => !d.isMe ? d.content = parse(d.content) : null)
        data.chats = response.data
        await scroll()
    }
}

onMounted(() => {
    fetchData()
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
        data.model = response.data.model
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
                <el-icon>
                    <OpenAI />
                </el-icon>
            </div>
            <div class="titles">
                <h1>ChatGPT</h1>
                <h2>{{ data.model }}</h2>
            </div>
        </div>
        <div class="chat-body regular-scrollbar">
            <div class="chat-container">
                <div v-for="chat in data.chats" class="chat" :class="{ me: chat.isMe }">
                    <div v-if="chat.isMe" class="avatar avatar-user">
                        <span>{{ letter }}</span>
                    </div>
                    <div v-else class="avatar avatar-openai">
                        <el-icon size="1.6rem" color="var(--el-text-color-primary)">
                            <OpenAI />
                        </el-icon>
                    </div>
                    <div class="gap"></div>
                    <div class="content">
                        <div class="content-1">
                            <span>{{ calcTime(chat.time) }}</span>
                            <span v-if="chat.isMe">{{ chat.content }}</span>
                            <div v-else class="gpt-view" v-html="parseMarkdown(chat.content)"></div>
                        </div>
                    </div>
                    <div class="gap2"></div>
                </div>
                <div class="chat" v-if="data.isLoading">
                    <div class="avatar avatar-openai">
                        <el-icon size="1.6rem" color="var(--el-text-color-primary)">
                            <OpenAI />
                        </el-icon>
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
    box-sizing: border-box;
    height: 3.6rem;
    flex-shrink: 0;
    padding: .4rem;
    padding-left: .8rem;
    display: flex;
    align-items: stretch;
    --icon-size: 2.4rem;
}

.chat-title>.title-icon {
    flex-shrink: 0;
    width: var(--icon-size);
    height: var(--icon-size);
    font-size: var(--icon-size);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chat-title>.titles {
    flex-grow: 1;
    margin-left: .6rem;
}

h1,
h2 {
    font-weight: normal;
    margin: 0;
    padding: 0;
}

h1 {
    color: var(--el-text-color-regular);
    font-size: 20px;
}

h2 {
    color: var(--el-text-color-disabled);
    font-size: 12px;
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
    font-size: 16px;
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
    width: 2.6rem;
    height: 10px;
    flex-shrink: 0;
}

.chat .content {
    max-width: calc(100% - 6rem);
}

.chat .content .content-1 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.chat.me .content .content-1 {
    align-items: flex-end;
}

.chat .content .content-1>*:nth-child(1) {
    font-size: 10px;
    color: var(--el-text-color-disabled);
    margin-bottom: 4px;
}

.chat .content .content-1>*:nth-child(2) {
    background-color: var(--el-bg-color);
    border-radius: 6px;
    overflow-wrap: break-word;
    padding: 4px 8px;
    font-size: 14px;
}

.avatar {
    width: 2.6rem;
    height: 2.6rem;
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