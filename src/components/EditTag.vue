<template>
  <div class="wrapper thin-scrollbar">
    <el-tag v-for="tag in modelValue" :key="tag" class="mx-1" closable :disable-transitions="false"
      @close="handleClose(tag)">
      {{ tag }}
    </el-tag>
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
      @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
      + 新标签
    </el-button>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: Array<string>,
    default: [],
    required: true
  }
})
defineEmits(['update:modelValue'])

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const handleClose = (tag: string) => {
  props.modelValue.splice(props.modelValue.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && !props.modelValue.includes(inputValue.value)) {
    props.modelValue.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-grow: row nowrap;
  overflow: auto;
  overflow-x: scroll;
}

.wrapper > * {
  flex-shrink: 0;
}

.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
}

.w-20 {
  width: 5rem;
}
</style>