import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useArticleStore = defineStore('article', () => {
    const store = reactive({ category: '', tags: [] as Array<string> })
    return { store }
})