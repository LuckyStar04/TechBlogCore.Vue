import { marked } from 'marked'
import hljs from 'highlight.js'
import markedKatex from "marked-katex-extension"

const renderer = new marked.Renderer()
renderer.link = function (href, title, text) {
    if (href === null) {
        return text
    }
    let out = '<a href="' + href + '" target="_blank"'
    if (title) {
        out += ' title="' + title + '"'
    }
    out += '>' + text + '</a>'
    return out
}

let imgId = 1

renderer.image = function (href, title, text) {
    if (href === null) {
        return text
    }

    let out = `<div class="img-flex"><img id="img-${imgId++}" src="${href}" alt="${text}"`
    if (title) {
        out += ` title="${title}"`
    }
    out += '/>'
    if (text) {
        out += `<p>${text}</p>`
    }
    out += '</div>'
    return out;
}

let _base = renderer.code

renderer.code = function (code, infostring, escaped) {
    let base = _base.call(renderer, code, infostring, escaped)
    return [base.slice(0, 5), `<div class="bsr-head"><div class="bsr-dot"></div><div class="bsr-dot"></div><div class="bsr-dot"></div><div class="bsr-title">${infostring?.toUpperCase()}</div><button class="bsr-copy">复制</button></div>`, base.slice(5)].join('')
  }

marked.setOptions({
    renderer: renderer,
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
    },
    langPrefix: 'hljs language-',
    pedantic: false,
    gfm: true,
    breaks: true,
    sanitize: true,
    smartypants: false,
    xhtml: false
})

marked.use(markedKatex({
    displayMode: true,
    throwOnError: false,
    output: 'html',
}))

export function parseMarkdown(content: string) {
    imgId = 1
    return marked.parse(content)
}