<script lang="ts" setup>
import req from '@/utils/request'
import { nextTick, reactive, onMounted, computed, defineProps, defineEmits, watch } from 'vue'
import { Promotion, Close, CopyDocument } from '@element-plus/icons-vue'
import type { Chat } from '@/types'
import { calcTime } from '@/utils/dates'
import OpenAI from '@/icons/OpenAI.vue'
import { parseMarkdown } from '@/utils/markdown'
import "highlight.js/styles/atom-one-dark.css"
import "@/assets/marked-gpt.css"
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'

const props = defineProps({
    showExpand: {
        type: Boolean,
        required: false,
        default: false,
    }
})
const emit = defineEmits(['close'])

const userStore = useUserStore()
const router = useRouter()

const toggleLogin = () => {
    userStore.isShowLoginForm = !userStore.isShowLoginForm
}

const data = reactive({
    model: 'gpt-3.5-turbo-0301',
    input: '',
    chats: [] as Array<Chat>,
    isLoading: false,
})

const letter = computed(() => userStore.info.user[0].toUpperCase())

const parse = (s: string): string => {
    return JSON.parse(s).choices[0].message.content
}

const fetchData = async () => {
    if (!userStore.info.user) return
    let response = await req.request({
        url: `chat`, method: 'get'
    })
    if (response.status == 200 && response.data.length > 0) {
        response.data.map((d: Chat) => !d.isMe ? d.content = parse(d.content) : null)
        data.chats = response.data
        await scroll()
    }
}

watch(() => userStore.info.user, fetchData)

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
            <div v-if="props.showExpand" class="expand" @click="router.push('/chat')">
                <el-icon><CopyDocument /></el-icon>
            </div>
            <div class="close" @click="emit('close')">
                <el-icon><Close /></el-icon>
            </div>
        </div>
        <div class="chat-body regular-scrollbar">
            <div class="chat-container">
                <template v-if="userStore.info.user">
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
                            <div class="content-1">
                                <span>{{ calcTime(new Date()) }}</span>
                                <span>思考中...</span>
                            </div>
                        </div>
                        <div class="gap2"></div>
                    </div>
                </template>
                <div v-else class="no-login">
                    <span>您尚未登录，先去 <a @click="toggleLogin">登录</a></span>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <input v-model="data.input" @keyup.enter="send" placeholder="输入问题" :disabled="!userStore.info.user" />
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

.chat-title>.expand {
    width: 2.4rem;
    height: 2.4rem;
    font-size: 1.6rem;
    color: var(--el-text-color-secondary);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.chat-title>.expand>i {
    transform: translate(-6px, 2px) rotateZ(180deg);
}

.chat-title>.close {
    width: 2.4rem;
    height: 2.4rem;
    font-size: 1.6rem;
    color: var(--el-text-color-secondary);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.chat-title>.close>i {
    transform: translate(-6px, 3px);
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
    background-color: var(--bg-color-chat-secondary);
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
    background-color: var(--bg-color-chat-primary);
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
    padding: 1rem .8em;
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
    align-items: stretch;
    max-width: 100%;
}

.chat.me .content .content-1 {
    align-items: flex-end;
    color: var(--text-color-chat-primary);
}

.chat .content .content-1>*:nth-child(1) {
    font-size: 10px;
    color: var(--el-text-color-disabled);
    margin-bottom: 1px;
}

.chat .content .content-1>*:nth-child(2) {
    background-color: var(--bg-color-chat-primary);
    border-radius: 0px 10px 10px 10px;
    overflow-wrap: break-word;
    padding: 4px 8px;
    font-size: 14px;
}

.chat.me .content .content-1>*:nth-child(2) {
    border-radius: 10px 0px 10px 10px;
    color: white;
    background-color: #1580ef;
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
    background-color: var(--bg-color-chat-primary);
}

.avatar>span {
    font-size: 1.2rem;
}

.no-login {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 12px;
}

.no-login>span {
    display: inline-block;
    font-size: 14px;
    color: var(--el-text-color-placeholder);
}

.no-login>span>a {
    color: rgba(var(--el-color-primary-rgb), 0.8);
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
}

.chat-input input[disabled] {
    cursor: not-allowed;
}
</style>