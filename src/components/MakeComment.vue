<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import req from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const input = ref<HTMLInputElement | null>(null)
const data = reactive({
    comment: '',
    isLoading: false
})
const showExtra = ref(false)
const emojis = ['๐', '๐', '๐', '๐', '๐', '๐', '๐คฃ', '๐', '๐', '๐', '๐', '๐', '๐', '๐ฅฐ', '๐', '๐คฉ', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐คช', '๐', '๐ค', '๐ค', '๐คญ', '๐คซ', '๐ค', '๐ค', '๐คจ', '๐', '๐', '๐ถ', '๐', '๐', '๐', '๐ฌ', '๐คฅ', '๐', '๐', '๐ช', '๐คค', '๐ด', '๐ท', '๐ค', '๐ค', '๐คข', '๐คฎ', '๐คง', '๐ฅต', '๐ฅถ', '๐ฅด', '๐ต', '๐คฏ', '๐ค ', '๐ฅณ', '๐', '๐ค', '๐ง', '๐', '๐', '๐', '๐ฎ', '๐ฏ', '๐ฒ', '๐ณ', '๐ฅบ', '๐ฆ', '๐ง', '๐จ', '๐ฐ', '๐ฅ', '๐ข', '๐ญ', '๐ฑ', '๐', '๐ฃ', '๐', '๐', '๐ฉ', '๐ซ', '๐ฅฑ', '๐ค', '๐ก', '๐ ', '๐คฌ', '๐', '๐ฟ', '๐']
const hotEmojis = ['๐', '๐', '๐', '๐', '๐']
const props = defineProps({
    placeholder: {
        type: String,
        default: '่พๅฅ่ฏ่ฎบ',
        required: false
    },
    articleId: {
        type: String,
        default: '0',
        required: true
    },
    parentId: {
        type: Number,
        default: null,
        required: false
    },
    replyTo: {
        type: String,
        default: null,
        required: false
    }
})
const emit = defineEmits(['commentSuccess'])

const expandExtra = (e: MouseEvent) => {
    if (e.target == null || (e.target as Element).className != 'mc-wrapper') {
        showExtra.value = false
    } else {
        showExtra.value = true
    }
}

onMounted(() => {
    document.addEventListener('click', expandExtra, false)
})
onUnmounted(() => {
    document.removeEventListener('click', expandExtra, false)
})
const addEmoji = async (emoji: string) => {
    const textarea = input.value
    if (textarea == null) return
    const cursorPosition = textarea.selectionEnd ?? 0
    const start = data.comment.substring(0, textarea.selectionStart ?? 0)
    const end = data.comment.substring(textarea.selectionStart ?? 0)
    data.comment = start + emoji + end
    textarea.focus()
    await nextTick()
    textarea.selectionEnd = cursorPosition + emoji.length
}

const commitComment = async () => {
    if (data.comment.trim().length == 0) {
        ElMessageBox.alert('่ฏ่ฎบไธ่ฝไธบ็ฉบๅฆ', 'ๆ็คบ', { confirmButtonText: 'ๅฅฝ็' })
        return
    }
    try {
        let response = await req.request({
            url: `articles/${props.articleId}/comments`, method: 'post', data: {
                parentId: props.parentId,
                content: data.comment,
                replyTo: props.replyTo,
            }
        })
        if (response.status == 201) {
            data.comment = ''
            showExtra.value = false
            emit('commentSuccess', response.data)
            ElMessage({ message: '่ฏ่ฎบๆๅ', type: 'success', duration: 1500 })
        }
    } catch (e: any) {
        ElMessage({ message: '่ฏ่ฎบๅคฑ่ดฅ', type: 'error', duration: 1500 })
    }
}

const showExtraEmoji = () => {
    if (userStore.info.role) {
        showExtra.value = true
    } else {
        userStore.isShowLoginForm = true
    }
}

</script>
<template>
    <div class="mc-wrapper" v-loading.fullscreen="data.isLoading" @click.stop="showExtraEmoji">
        <input v-if="userStore.info.role" type="text" ref="input" class="comment" v-model="data.comment"
            :placeholder="placeholder" maxlength="1000" />
        <input v-else type="text" ref="input" class="comment" disabled v-model="data.comment"
            placeholder="ๆจ่ฟๆช็ปๅฝ๏ผๅๅป็ปๅฝ" />
        <transition name="el-zoom-in-top">
            <div class="extra" v-if="showExtra">
                <div class="emojis">
                    <el-popover :width="380" trigger="click"
                        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                        <template #reference>
                            <font-awesome-icon icon="fa-regular fa-face-smile" class="more-emojis-icon" />
                        </template>
                        <template #default>
                            <div class="more-emojis" @click.stop="showExtra = true">
                                <span v-for="em in emojis" class="emoji-button"
                                    @click.prevent.stop="addEmoji(em)">{{ em }}</span>
                            </div>
                        </template>
                    </el-popover>
                    <div class="default-emojis">
                        <span v-for="em in hotEmojis" class="emoji-button"
                            @click.prevent.stop="addEmoji(em)">{{ em }}</span>
                    </div>
                </div>
                <el-button type="primary" @click="commitComment">ๅๅธ</el-button>
            </div>
        </transition>
    </div>
</template>
<style scoped>
.mc-wrapper {
    box-sizing: border-box;
    width: 100%;
    border: 1px solid var(--el-border-color-light);
    border-radius: 5px;
    padding: 12px;
}

.mc-wrapper>.comment {
    width: 98%;
    border: 0;
    outline: 0;
    font-size: var(--el-font-size-medium);
    color: var(--el-text-color-regular);
    background-color: var(--el-bg-color);
}

.mc-wrapper>.extra {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--el-border-color-light);
    margin-top: 12px;
    padding-top: 12px;
}

.mc-wrapper>.extra>.emojis {
    display: flex;
    align-items: center;
}

.emojis {
    font-size: var(--el-font-size-extra-large);
    color: var(--el-text-color-regular);
}

.default-emojis {
    margin-left: 8px;
    padding-left: 8px;
    border-left: 1px solid var(--el-border-color-light);
}

.default-emojis,
.more-emojis {
    display: flex;
    flex-flow: row wrap;
}

.default-emojis>span,
.more-emojis>span {
    margin: 0 1px 1px 0;
    font-size: var(--el-font-size-large);
    cursor: pointer;
}

.more-emojis>span {
    margin-bottom: 5px;
}

.more-emojis-icon {
    outline: 0;
    cursor: pointer;
}
</style>