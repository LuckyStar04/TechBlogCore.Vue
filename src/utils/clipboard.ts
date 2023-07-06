import { ElNotification } from 'element-plus'

const copyToClipboard = (str: string) => {
    const el = document.createElement("textarea")
    el.value = str
    el.setAttribute("readonly", "")
    el.style.position = "absolute"
    el.style.left = "-9999px"
    document.body.appendChild(el)
    const selected =
        document.getSelection()!.rangeCount > 0
            ? document.getSelection()!.getRangeAt(0)
            : false
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
    if (selected) {
        document.getSelection()!.removeAllRanges()
        document.getSelection()!.addRange(selected)
    }
}

export function handleCopyClick(evt: MouseEvent): void {
    const target = evt.target as any
    const innerText = target.parentElement?.nextElementSibling?.innerText
    copyToClipboard(innerText)
    ElNotification({
        title: '成功',
        message: '代码复制成功。',
        type: 'success',
        duration: 1500,
    })
}